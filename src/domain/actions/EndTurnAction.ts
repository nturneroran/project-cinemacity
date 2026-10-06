import { Action } from './Action';
import { ActionResult } from '../types';
import { Player } from '../Player';
import { TurnManager } from '../TurnManager';
import { GameEventEmitter } from '../events/GameEventEmitter';

/**
 * Command: end the current player's turn and pass control to the next player.
 * This action is always legal (a player may always choose to pass).
 */
export class EndTurnAction implements Action {
  readonly type = 'endTurn';

  constructor(
    private readonly currentPlayer: Player,
    private readonly turnManager: TurnManager,
    private readonly events: GameEventEmitter,
  ) {}

  // TODO: implement this method
  // Hint: end turn is always valid — always return { success: true, message: '' }
  validate(): ActionResult {
    throw new Error('Not implemented');
  }

  /**
   * TODO: implement this method
   * Hint: call turnManager.advanceTurn(); emit turnEnded (with previousPlayer and nextPlayer)
   *       and stateChanged; return success message naming the next player
   */
  execute(): ActionResult {
    throw new Error('Not implemented');
  }
}
