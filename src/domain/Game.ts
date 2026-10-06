import { Board } from './Board';
import { Player } from './Player';
import { SceneDeck } from './SceneDeck';
import { SceneCard } from './SceneCard';
import { Location } from './Location';
import { TurnManager } from './TurnManager';
import { GameEventEmitter } from './events/GameEventEmitter';
import { ActionResult, Currency } from './types';
import { MoveAction } from './actions/MoveAction';
import { TakeRoleAction } from './actions/TakeRoleAction';
import { ActAction } from './actions/ActAction';
import { RehearseAction } from './actions/RehearseAction';
import { UpgradeAction } from './actions/UpgradeAction';
import { EndTurnAction } from './actions/EndTurnAction';

/**
 * The central game orchestrator.
 *
 * Responsibilities:
 *  - Hold references to Board, Players, SceneDeck, TurnManager, and EventEmitter.
 *  - Create and execute Command objects for each player action.
 *  - Handle scene-wrap side effects (reward distribution, cleanup, next card).
 *  - Determine and announce game-over conditions.
 *
 * Does NOT render anything — the UI subscribes to events via the emitter.
 *
 * DESIGN PATTERN: Facade
 * The UI calls simple game methods (game.move(), game.act(), etc.) instead of
 * constructing domain objects directly. This hides internal complexity.
 */
export class Game {
  readonly board: Board;
  readonly players: Player[];
  readonly events: GameEventEmitter;

  private readonly _turnManager: TurnManager;
  private readonly _sceneDeck: SceneDeck;
  private readonly _rollDie: () => number;
  private _completedScenes: number = 0;
  private _isOver: boolean = false;

  constructor(
    board: Board,
    players: Player[],
    sceneDeck: SceneDeck,
    rollDie: () => number = () => Math.ceil(Math.random() * 6),
  ) {
    this.board = board;
    this.players = players;
    this._sceneDeck = sceneDeck;
    this._rollDie = rollDie;
    this._turnManager = new TurnManager(players);
    this.events = new GameEventEmitter();
  }

  // --- Accessors ---

  get currentPlayer(): Player {
    return this._turnManager.currentPlayer;
  }

  get turnManager(): TurnManager {
    return this._turnManager;
  }

  get completedScenes(): number {
    return this._completedScenes;
  }

  get remainingScenes(): number {
    return this._sceneDeck.remaining;
  }

  get isOver(): boolean {
    return this._isOver;
  }

  // --- Player Actions (Command factory + execute) ---
  // Each method constructs a Command object and calls execute().

  move(targetLocationId: string): ActionResult {
    if (this._isOver) return this._gameOverResult();
    return new MoveAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      targetLocationId,
    ).execute();
  }

  takeRole(roleId: string): ActionResult {
    if (this._isOver) return this._gameOverResult();
    return new TakeRoleAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      roleId,
    ).execute();
  }

  act(): ActionResult {
    if (this._isOver) return this._gameOverResult();
    return new ActAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      this._rollDie,
      (scene, location) => this._handleSceneWrap(scene, location),
    ).execute();
  }

  rehearse(): ActionResult {
    if (this._isOver) return this._gameOverResult();
    return new RehearseAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
    ).execute();
  }

  upgrade(toRank: number, currency: Currency): ActionResult {
    if (this._isOver) return this._gameOverResult();
    return new UpgradeAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      toRank,
      currency,
    ).execute();
  }

  endTurn(): ActionResult {
    if (this._isOver) return this._gameOverResult();
    return new EndTurnAction(this.currentPlayer, this._turnManager, this.events).execute();
  }

  // --- Scene Wrap Handler ---

  /**
   * Called by ActAction when a scene's last shot is removed.
   *
   * Awards on-card wrap bonuses, clears the finished scene's roles, then
   * replaces the scene from the deck and checks whether the game has ended.
   */
  private _handleSceneWrap(
    scene: SceneCard,
    location: Location,
  ): Array<{ player: Player; credits: number; reputation: number }> {
    const rewards: Array<{ player: Player; credits: number; reputation: number }> = [];

    for (const role of scene.roles) {
      if (!role.takenByPlayerId) continue;
      const player = this.players.find((candidate) => candidate.id === role.takenByPlayerId);
      if (!player) {
        throw new Error(`Role "${role.id}" is assigned to an unknown player.`);
      }
      player.earnCredits(role.pay);
      player.earnReputation(2);
      rewards.push({ player, credits: role.pay, reputation: 2 });
    }

    for (const player of this.players) {
      if (player.locationId === location.id && player.hasRole()) {
        player.clearRole();
      }
    }
    for (const role of scene.roles) role.vacate();
    for (const role of location.offCardRoles) role.vacate();

    location.clearScene();
    this._completedScenes += 1;
    if (!this._sceneDeck.isEmpty()) {
      const nextScene = this._sceneDeck.draw();
      if (nextScene) location.setScene(nextScene);
    }
    this._checkGameOver();
    return rewards;
  }

  private _gameOverResult(): ActionResult {
    return { success: false, message: 'The game is over; no more actions are allowed.' };
  }

  // --- Game Over ---

  private _checkGameOver(): void {
    if (this._isOver) return;

    // Game ends when the deck is empty AND no scene locations have an active scene.
    if (this._sceneDeck.isEmpty()) {
      const hasActiveScene = this.board
        .getSceneLocations()
        .some((loc) => loc.hasScene());

      if (!hasActiveScene) {
        this._isOver = true;
        const scores = this.players
          .map((p) => ({ player: p, score: p.calculateScore() }))
          .sort((a, b) => b.score - a.score);

        this.events.emit({
          type: 'gameOver',
          payload: { winner: scores[0].player, scores },
        });
      }
    }
  }

  /** Validate a move without executing it. */
  canMove(targetLocationId: string): boolean {
    if (this._isOver) return false;
    const action = new MoveAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      targetLocationId,
    );
    return action.validate().success;
  }

  /** Validate a role-take without executing it. */
  canTakeRole(roleId: string): boolean {
    if (this._isOver) return false;
    const action = new TakeRoleAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      roleId,
    );
    return action.validate().success;
  }

  /** Validate act without executing it. */
  canAct(): boolean {
    if (this._isOver) return false;
    const action = new ActAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      this._rollDie,
      () => [],
    );
    return action.validate().success;
  }

  /** Validate rehearse without executing it. */
  canRehearse(): boolean {
    if (this._isOver) return false;
    const action = new RehearseAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
    );
    return action.validate().success;
  }

  /** Validate upgrade without executing it. */
  canUpgrade(toRank: number, currency: Currency): boolean {
    if (this._isOver) return false;
    const action = new UpgradeAction(
      this.currentPlayer,
      this.board,
      this._turnManager,
      this.events,
      toRank,
      currency,
    );
    return action.validate().success;
  }
}
