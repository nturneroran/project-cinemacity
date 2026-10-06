import { Action } from './Action';
import { ActionResult } from '../types';
import { Player } from '../Player';
import { Board } from '../Board';
import { TurnManager } from '../TurnManager';
import { GameEventEmitter } from '../events/GameEventEmitter';

/**
 * Command: rehearse for the current role, gaining one rehearsal token.
 *
 * Rehearsal tokens carry over to future act rolls as a flat bonus.
 * A player may rehearse at most once per turn.
 * A player cannot rehearse if they have already acted this turn (and vice-versa).
 */
export class RehearseAction implements Action {
  readonly type = 'rehearse';

  constructor(
    private readonly player: Player,
    private readonly board: Board,
    private readonly turnManager: TurnManager,
    private readonly events: GameEventEmitter,
  ) {}

  /**
   * Checks role ownership, per-turn limits, and scene presence.
   */
  validate(): ActionResult {
    if (!this.player.hasRole()) {
      return { success: false, message: 'You must take a role before rehearsing.' };
    }
    if (this.turnManager.hasActed || this.turnManager.hasRehearsed) {
      return { success: false, message: 'You have already acted or rehearsed this turn.' };
    }
    const location = this.board.getLocation(this.player.locationId);
    if (!location.hasScene()) {
      return { success: false, message: 'There is no active scene at this location.' };
    }
    return { success: true, message: '' };
  }

  /**
   * Adds a rehearsal token and publishes the updated token count.
   */
  execute(): ActionResult {
    const validation = this.validate();
    if (!validation.success) return validation;

    this.player.addRehearsalToken();
    this.turnManager.recordRehearse();
    this.events.emit({
      type: 'rehearsed',
      payload: { player: this.player, newTokenCount: this.player.rehearsalTokens },
    });
    this.events.emit({ type: 'stateChanged', payload: {} });
    return { success: true, message: `${this.player.name} rehearsed.` };
  }
}
