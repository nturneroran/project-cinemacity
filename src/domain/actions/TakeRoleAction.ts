import { Action } from './Action';
import { ActionResult } from '../types';
import { Player } from '../Player';
import { Board } from '../Board';
import { Role } from '../Role';
import { TurnManager } from '../TurnManager';
import { GameEventEmitter } from '../events/GameEventEmitter';

/** Command: assign the current player to an available role at their location. */
export class TakeRoleAction implements Action {
  readonly type = 'takeRole';

  constructor(
    private readonly player: Player,
    private readonly board: Board,
    private readonly turnManager: TurnManager,
    private readonly events: GameEventEmitter,
    private readonly roleId: string,
  ) {}

  /**
   * Checks role ownership, turn limits, availability, and rank requirements.
   */
  validate(): ActionResult {
    if (this.player.hasRole()) {
      return { success: false, message: 'You already have a role.' };
    }
    if (this.turnManager.hasTakenRole) {
      return { success: false, message: 'You have already taken a role this turn.' };
    }
    const location = this.board.getLocation(this.player.locationId);
    const role = this._findRole(location);
    if (!role) {
      return { success: false, message: 'That role is not available at this location.' };
    }
    if (this.player.rank < role.requiredRank) {
      return { success: false, message: `This role requires rank ${role.requiredRank}.` };
    }
    return { success: true, message: '' };
  }

  /**
   * Assigns the available role and publishes the corresponding game events.
   */
  execute(): ActionResult {
    const validation = this.validate();
    if (!validation.success) return validation;

    const location = this.board.getLocation(this.player.locationId);
    const role = this._findRole(location)!;
    role.assign(this.player.id);
    this.player.takeRole(role.id, role.isOnCard);
    this.turnManager.recordTakeRole();
    this.events.emit({
      type: 'roleTaken',
      payload: {
        player: this.player,
        roleId: role.id,
        roleName: role.name,
        isOnCard: role.isOnCard,
        location,
      },
    });
    this.events.emit({ type: 'stateChanged', payload: {} });
    return { success: true, message: `${this.player.name} took the role "${role.name}".` };
  }

  /**
   * Search both scene (on-card) and location (off-card) roles.
   * Returns undefined if the role is not found or no scene is active.
   */
  private _findRole(
    location: ReturnType<Board['getLocation']>,
  ): Role | undefined {
    const available = location.getAvailableRoles();
    return available.find((r) => r.id === this.roleId);
  }
}
