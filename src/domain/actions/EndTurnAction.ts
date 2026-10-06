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

  validate(): ActionResult {
    return { success: true, message: '' };
  }

  /**
   * Advances the turn, emits turn events, and names the next player.
   */
  execute(): ActionResult {
    const validation = this.validate();
    if (!validation.success) return validation;
    const previousPlayer = this.currentPlayer;
    this.turnManager.advanceTurn();
    const nextPlayer = this.turnManager.currentPlayer;
    this.events.emit({ type: 'turnEnded', payload: { previousPlayer, nextPlayer } });
    this.events.emit({ type: 'stateChanged', payload: {} });
    return { success: true, message: `Turn ended. It is now ${nextPlayer.name}'s turn.` };
  }
}
