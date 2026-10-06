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
   * Checks role commitment, the per-turn move limit, and adjacency.
   */
  validate(): ActionResult {
    if (this.player.hasRole()) {
      return { success: false, message: 'You cannot move while committed to a role.' };
    }
    if (this.turnManager.hasMoved) {
      return { success: false, message: 'You have already moved this turn.' };
    }
    if (!this.board.isNeighbor(this.player.locationId, this.targetLocationId)) {
      return { success: false, message: 'The target location is not adjacent.' };
    }
    return { success: true, message: '' };
  }

  /**
   * Moves the player and publishes the movement and state events.
   */
  execute(): ActionResult {
    const validation = this.validate();
    if (!validation.success) return validation;

    const from = this.board.getLocation(this.player.locationId);
    const to = this.board.getLocation(this.targetLocationId);
    this.player.moveTo(to.id);
    this.turnManager.recordMove();
    this.events.emit({ type: 'playerMoved', payload: { player: this.player, from, to } });
    this.events.emit({ type: 'stateChanged', payload: {} });
    return { success: true, message: `${this.player.name} moved to ${to.name}.` };
  }
}
