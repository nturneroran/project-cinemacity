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
   * Checks upgrade location, turn limits, sequential rank progression, and cost.
   */
  validate(): ActionResult {
    if (this.player.hasRole()) {
      return { success: false, message: 'You cannot upgrade while committed to a role.' };
    }
    if (this.turnManager.hasUpgraded) {
      return { success: false, message: 'You have already upgraded this turn.' };
    }
    if (!this.board.getLocation(this.player.locationId).isUpgradeLocation) {
      return { success: false, message: 'You must be at the upgrade location.' };
    }
    if (this.toRank !== this.player.rank + 1) {
      return { success: false, message: 'You must upgrade one rank at a time.' };
    }
    if (this.toRank > MAX_RANK) {
      return { success: false, message: `Rank cannot exceed ${MAX_RANK}.` };
    }
    const cost = UPGRADE_COSTS.find((entry) => entry.toRank === this.toRank);
    if (!cost) {
      return { success: false, message: 'No upgrade cost is defined for that rank.' };
    }
    const balance = this.currency === 'credits' ? this.player.credits : this.player.reputation;
    const required = this.currency === 'credits' ? cost.creditCost : cost.reputationCost;
    if (balance < required) {
      return { success: false, message: `Insufficient ${this.currency} for this upgrade.` };
    }
    return { success: true, message: '' };
  }

  /**
   * Spends the selected currency, updates rank, and publishes upgrade events.
   */
  execute(): ActionResult {
    const validation = this.validate();
    if (!validation.success) return validation;

    const oldRank = this.player.rank;
    const cost = UPGRADE_COSTS.find((entry) => entry.toRank === this.toRank)!;
    if (this.currency === 'credits') {
      this.player.spendCredits(cost.creditCost);
    } else {
      this.player.spendReputation(cost.reputationCost);
    }
    this.player.upgradeRank(this.toRank);
    this.turnManager.recordUpgrade();
    this.events.emit({
      type: 'rankUpgraded',
      payload: { player: this.player, oldRank, newRank: this.toRank },
    });
    this.events.emit({ type: 'stateChanged', payload: {} });
    return { success: true, message: `${this.player.name} upgraded to rank ${this.toRank}.` };
  }
}
