import { Action } from './Action';
import { ActionResult } from '../types';
import { Player } from '../Player';
import { Board } from '../Board';
import { TurnManager } from '../TurnManager';
import { GameEventEmitter } from '../events/GameEventEmitter';

/** Command: move the current player to a neighboring location. */
export class MoveAction implements Action {
  readonly type = 'move';

  constructor(
    private readonly player: Player,
    private readonly board: Board,
    private readonly turnManager: TurnManager,
    private readonly events: GameEventEmitter,
    private readonly targetLocationId: string,
  ) {}

  /**
   * TODO: implement this method
   * Hint: reject if player has a role, if already moved this turn, or if target is not a neighbor
   */
  validate(): ActionResult {
    throw new Error('Not implemented');
  }

  /**
   * TODO: implement this method
   * Hint: call validate() first; if valid: moveTo, recordMove, emit playerMoved + stateChanged
   */
  execute(): ActionResult {
    throw new Error('Not implemented');
  }
}
