import { Player } from './Player';

/**
 * Tracks whose turn it is and what actions the current player has already
 * taken this turn.
 *
 * Responsibilities:
 *  - Maintain the turn order (circular, round-robin).
 *  - Track per-turn action flags so duplicate actions can be rejected.
 *  - Advance the turn and reset flags.
 *
 * Does NOT know about the board, locations, or scene logic.
 *
 * Per-turn rules enforced here:
 *  - A player may move at most once.
 *  - A player may take at most one role.
 *  - A player may act OR rehearse (not both), at most once.
 *  - A player may upgrade at most once.
 */
export class TurnManager {
  private _currentIndex: number = 0;
  private _turnNumber: number = 1;

  // Per-turn flags — reset when advanceTurn() is called.
  private _hasMoved: boolean = false;
  private _hasTakenRole: boolean = false;
  private _hasActed: boolean = false;
  private _hasRehearsed: boolean = false;
  private _hasUpgraded: boolean = false;

  constructor(private readonly _players: Player[]) {
    if (_players.length === 0) {
      throw new Error('TurnManager requires at least one player.');
    }
  }

  get currentPlayer(): Player {
    return this._players[this._currentIndex];
  }

  get turnNumber(): number {
    return this._turnNumber;
  }

  get hasMoved(): boolean {
    return this._hasMoved;
  }
  get hasTakenRole(): boolean {
    return this._hasTakenRole;
  }
  get hasActed(): boolean {
    return this._hasActed;
  }
  get hasRehearsed(): boolean {
    return this._hasRehearsed;
  }
  get hasUpgraded(): boolean {
    return this._hasUpgraded;
  }

  // TODO: implement this method
  // Hint: set _hasMoved = true
  recordMove(): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _hasTakenRole = true
  recordTakeRole(): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _hasActed = true
  recordAct(): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _hasRehearsed = true
  recordRehearse(): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _hasUpgraded = true
  recordUpgrade(): void {
    throw new Error('Not implemented');
  }

  /**
   * Move to the next player and reset all per-turn flags.
   *
   * TODO: implement this method
   * Hint: advance _currentIndex with modulo; increment _turnNumber when index wraps to 0;
   *       reset all five _has* flags to false
   */
  advanceTurn(): void {
    throw new Error('Not implemented');
  }
}
