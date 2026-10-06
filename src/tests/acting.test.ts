import { describe, it, expect } from 'vitest';
import { makeMinimalGame } from './helpers';

/**
 * Acting tests verify the core mechanic:
 *   die roll + rehearsal tokens >= scene budget → success
 *   success (on-card)  → +1 rep, shot removed
 *   success (off-card) → +2 credits, +1 rep, shot removed
 *   failure (on-card)  → no reward
 *   failure (off-card) → +1 credit (consolation)
 */
describe('Acting rules', () => {
  it('rejects act when player has no role', () => {
    const { game } = makeMinimalGame();
    const result = game.act();
    expect(result.success).toBe(false);
    expect(result.message).toContain('role');
  });

  it('rejects act when player has already acted this turn', () => {
    const { game } = makeMinimalGame();
    game.takeRole('scene-a-lead');
    expect(game.act().success).toBe(true);
    const result = game.act();
    expect(result.success).toBe(false);
    expect(result.message).toContain('already');
  });

  it('successful on-card act: removes shot, awards +1 reputation', () => {
    const { game, alice, locA } = makeMinimalGame({ budget: 3, rollDie: () => 6 });
    const startingCredits = alice.credits;
    game.takeRole('scene-a-lead');
    const result = game.act();
    expect(result.success).toBe(true);
    expect(result.shotRemoved).toBe(true);
    expect(alice.reputation).toBe(1);
    expect(alice.credits).toBe(startingCredits);
    expect(locA.currentScene!.remainingShots).toBe(1);
  });

  it('failed on-card act: no reward', () => {
    const { game, alice } = makeMinimalGame({ budget: 5, rollDie: () => 1 });
    const startingCredits = alice.credits;
    game.takeRole('scene-a-lead');
    game.act();
    expect(alice.credits).toBe(startingCredits);
    expect(alice.reputation).toBe(0);
  });

  it('successful off-card act: removes shot, awards +2 credits +1 reputation', () => {
    const { game, alice } = makeMinimalGame({ budget: 3, rollDie: () => 6 });
    game.takeRole('loc-a-extra');
    const result = game.act();
    expect(result.shotRemoved).toBe(true);
    expect(alice.credits).toBe(7);
    expect(alice.reputation).toBe(1);
  });

  it('failed off-card act: awards +1 credit (consolation)', () => {
    const { game, alice } = makeMinimalGame({ budget: 6, rollDie: () => 1 });
    game.takeRole('loc-a-extra');
    game.act();
    expect(alice.credits).toBe(6);
    expect(alice.reputation).toBe(0);
  });

  it('rehearsal tokens add to the die roll', () => {
    const { game, alice } = makeMinimalGame({ budget: 4, rollDie: () => 3 });
    game.takeRole('scene-a-lead');
    expect(game.rehearse().success).toBe(true);
    game.endTurn();
    game.endTurn();
    const result = game.act();
    expect(result.success).toBe(true);
    expect(result.shotRemoved).toBe(true);
    expect(alice.reputation).toBe(1);
  });

  it('rehearsal tokens accumulate across turns', () => {
    const { game, alice } = makeMinimalGame();
    game.takeRole('scene-a-lead');
    game.rehearse();
    game.endTurn();
    game.endTurn();
    expect(game.rehearse().success).toBe(true);
    expect(alice.rehearsalTokens).toBe(2);
  });

  it('cannot rehearse and act in the same turn', () => {
    const { game } = makeMinimalGame();
    game.takeRole('scene-a-lead');
    game.rehearse();
    const result = game.act();
    expect(result.success).toBe(false);
    expect(result.message).toContain('already');
  });
});
