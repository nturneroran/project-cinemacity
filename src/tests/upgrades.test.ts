import { describe, it, expect } from 'vitest';
import { makeMinimalGame } from './helpers';
import { UPGRADE_COSTS, MAX_RANK } from '../domain/actions/UpgradeAction';

describe('Upgrade rules', () => {
  /**
   * Helper: move Alice (player 0) to the upgrade location.
   * In the minimal game map: locA → upgrade is a valid move.
   */
  function setupForUpgrade(credits: number = 10, reputation: number = 10, rank: number = 1) {
    const { game, alice } = makeMinimalGame({ playerCredits: credits, playerReputation: reputation, playerRank: rank });
    game.move('upgrade');
    return { game, alice };
  }

  it('allows upgrading rank 1 → 2 with sufficient credits', () => {
    const { game, alice } = setupForUpgrade(UPGRADE_COSTS[0].creditCost, 0);
    const result = game.upgrade(2, 'credits');
    expect(result.success).toBe(true);
    expect(alice.rank).toBe(2);
    expect(alice.credits).toBe(0);
  });

  it('allows upgrading with reputation instead of credits', () => {
    const { game, alice } = setupForUpgrade(0, UPGRADE_COSTS[0].reputationCost);
    expect(game.upgrade(2, 'reputation').success).toBe(true);
    expect(alice.rank).toBe(2);
    expect(alice.reputation).toBe(0);
  });

  it('rejects upgrade when credits are insufficient', () => {
    const { game, alice } = setupForUpgrade(0, 10);
    const result = game.upgrade(2, 'credits');
    expect(result.success).toBe(false);
    expect(alice.rank).toBe(1);
  });

  it('rejects upgrade when reputation is insufficient', () => {
    const { game, alice } = setupForUpgrade(10, 0);
    const result = game.upgrade(2, 'reputation');
    expect(result.success).toBe(false);
    expect(alice.rank).toBe(1);
  });

  it('rejects upgrading more than one rank at a time', () => {
    const { game } = setupForUpgrade();
    const result = game.upgrade(3, 'credits');
    expect(result.success).toBe(false);
  });

  it('rejects upgrade when not at upgrade location', () => {
    const { game } = makeMinimalGame();
    expect(game.upgrade(2, 'credits').success).toBe(false);
  });

  it('rejects upgrade when on a role', () => {
    const { game } = makeMinimalGame();
    game.takeRole('scene-a-lead');
    expect(game.upgrade(2, 'credits').success).toBe(false);
  });

  it('rejects upgrading beyond the maximum rank', () => {
    const { game } = setupForUpgrade(100, 100, MAX_RANK);
    expect(game.upgrade(MAX_RANK + 1, 'credits').success).toBe(false);
  });

  it('cannot upgrade twice in one turn', () => {
    const { game } = setupForUpgrade(100, 100);
    expect(game.upgrade(2, 'credits').success).toBe(true);
    expect(game.upgrade(3, 'credits').success).toBe(false);
  });

  it('UPGRADE_COSTS table has entries for ranks 2 through MAX_RANK', () => {
    for (let rank = 2; rank <= MAX_RANK; rank += 1) {
      const entry = UPGRADE_COSTS.find((cost) => cost.toRank === rank);
      expect(entry).toBeDefined();
      expect(entry!.creditCost).toBeGreaterThan(0);
      expect(entry!.reputationCost).toBeGreaterThan(0);
    }
  });
});
