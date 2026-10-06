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

  // TODO: implement this method
  // Hint: construct a MoveAction with the required dependencies and call execute()
  move(targetLocationId: string): ActionResult {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: construct a TakeRoleAction with the required dependencies and call execute()
  takeRole(roleId: string): ActionResult {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: construct an ActAction — pass this._rollDie and a callback to _handleSceneWrap
  act(): ActionResult {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: construct a RehearseAction with the required dependencies and call execute()
  rehearse(): ActionResult {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: construct an UpgradeAction with the required dependencies and call execute()
  upgrade(toRank: number, currency: Currency): ActionResult {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: if _isOver return { success: false, ... }; otherwise construct EndTurnAction and execute
  endTurn(): ActionResult {
    throw new Error('Not implemented');
  }

  // --- Scene Wrap Handler ---

  /**
   * Called by ActAction when a scene's last shot is removed.
   *
   * TODO: implement this method
   * Steps:
   *  1. Award wrap bonuses to on-card role players (role.pay credits + 2 reputation each).
   *  2. Clear all player roles at this location (clearRole() for players at location.id with a role).
   *  3. Vacate all role slots (scene.roles and location.offCardRoles).
   *  4. Call location.clearScene().
   *  5. Increment _completedScenes.
   *  6. If the deck is not empty, draw a card and call location.setScene(card).
   *  7. Call _checkGameOver().
   *  8. Return the rewards array.
   */
  private _handleSceneWrap(
    scene: SceneCard,
    location: Location,
  ): Array<{ player: Player; credits: number; reputation: number }> {
    throw new Error('Not implemented');
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
