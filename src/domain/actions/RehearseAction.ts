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
   * TODO: implement this method
   * Hint: reject if player has no role, already acted/rehearsed this turn,
   *       or no active scene at the player's location
   */
  validate(): ActionResult {
    throw new Error('Not implemented');
  }

  /**
   * TODO: implement this method
   * Hint: call validate(); if valid: addRehearsalToken, recordRehearse,
   *       emit rehearsed + stateChanged
   */
  execute(): ActionResult {
    throw new Error('Not implemented');
  }
}
