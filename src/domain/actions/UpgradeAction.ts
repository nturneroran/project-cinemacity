import { Action } from './Action';
import { ActionResult, Currency, UpgradeCostEntry } from '../types';
import { Player } from '../Player';
import { Board } from '../Board';
import { TurnManager } from '../TurnManager';
import { GameEventEmitter } from '../events/GameEventEmitter';

/** Maximum rank a player can reach. */
export const MAX_RANK = 6;

/**
 * Upgrade cost table. A player may pay with credits OR reputation (not both).
 * Each entry represents the cost to reach that rank from rank - 1.
 */
export const UPGRADE_COSTS: UpgradeCostEntry[] = [
  { toRank: 2, creditCost: 4, reputationCost: 2 },
  { toRank: 3, creditCost: 10, reputationCost: 4 },
  { toRank: 4, creditCost: 18, reputationCost: 6 },
  { toRank: 5, creditCost: 28, reputationCost: 8 },
  { toRank: 6, creditCost: 40, reputationCost: 12 },
];

/**
 * Command: upgrade the current player's rank at an upgrade location.
 *
 * Rules:
 *  - Player must be at a location with isUpgradeLocation === true.
 *  - Player must not be currently on a role.
 *  - Player must not have upgraded this turn.
 *  - Target rank must be exactly current rank + 1 (one step at a time).
 *  - Player chooses to pay with credits OR reputation (not both).
 */
export class UpgradeAction implements Action {
  readonly type = 'upgrade';

  constructor(
    private readonly player: Player,
    private readonly board: Board,
    private readonly turnManager: TurnManager,
    private readonly events: GameEventEmitter,
    private readonly toRank: number,
    private readonly currency: Currency,
  ) {}

  /**
   * TODO: implement this method
   * Hint: reject if player has a role, already upgraded, not at upgrade location,
   *       toRank !== player.rank + 1, toRank > MAX_RANK, or insufficient currency
   */
  validate(): ActionResult {
    throw new Error('Not implemented');
  }

  /**
   * TODO: implement this method
   * Hint: call validate(); if valid: deduct currency (spendCredits or spendReputation),
   *       upgradeRank, recordUpgrade, emit rankUpgraded + stateChanged
   */
  execute(): ActionResult {
    throw new Error('Not implemented');
  }
}
