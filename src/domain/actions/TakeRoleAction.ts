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
   * TODO: implement this method
   * Hint: reject if player already has a role, already took a role this turn,
   *       role not found/available at location, or player rank is too low
   */
  validate(): ActionResult {
    throw new Error('Not implemented');
  }

  /**
   * TODO: implement this method
   * Hint: call validate(); if valid: role.assign, player.takeRole, recordTakeRole,
   *       emit roleTaken + stateChanged
   */
  execute(): ActionResult {
    throw new Error('Not implemented');
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
