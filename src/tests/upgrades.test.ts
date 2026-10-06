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
    // TODO: implement this test
    // Hint: use setupForUpgrade with exact credit cost; upgrade(2, 'credits'); assert rank===2 and credits===0
    expect(true).toBe(false);
  });

  it('allows upgrading with reputation instead of credits', () => {
    // TODO: implement this test
    // Hint: use setupForUpgrade with exact reputation cost; upgrade(2, 'reputation'); assert rank===2
    expect(true).toBe(false);
  });

  it('rejects upgrade when credits are insufficient', () => {
    // TODO: implement this test
    // Hint: setupForUpgrade with 0 credits; upgrade(2, 'credits'); assert failure and rank unchanged
    expect(true).toBe(false);
  });

  it('rejects upgrade when reputation is insufficient', () => {
    // TODO: implement this test
    // Hint: setupForUpgrade with 0 reputation; upgrade(2, 'reputation'); assert failure and rank unchanged
    expect(true).toBe(false);
  });

  it('rejects upgrading more than one rank at a time', () => {
    // TODO: implement this test
    // Hint: rank=1; try upgrade(3, 'credits'); assert failure (must do rank 1→2 first)
    expect(true).toBe(false);
  });

  it('rejects upgrade when not at upgrade location', () => {
    // TODO: implement this test
    // Hint: makeMinimalGame (Alice is at locA, not upgrade); upgrade(2, 'credits'); assert failure
    expect(true).toBe(false);
  });

  it('rejects upgrade when on a role', () => {
    // TODO: implement this test
    // Hint: take a role first; attempt upgrade; assert failure
    expect(true).toBe(false);
  });

  it('rejects upgrading beyond the maximum rank', () => {
    // TODO: implement this test
    // Hint: setupForUpgrade with rank=MAX_RANK; upgrade(MAX_RANK+1, 'credits'); assert failure
    expect(true).toBe(false);
  });

  it('cannot upgrade twice in one turn', () => {
    // TODO: implement this test
    // Hint: upgrade once successfully, then upgrade again same turn; second should fail
    expect(true).toBe(false);
  });

  it('UPGRADE_COSTS table has entries for ranks 2 through MAX_RANK', () => {
    // TODO: implement this test
    // Hint: iterate rank 2..MAX_RANK; assert each entry exists with positive credit and reputation costs
    expect(true).toBe(false);
  });
});
