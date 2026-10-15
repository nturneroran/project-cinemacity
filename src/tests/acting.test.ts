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
    expect(result.message.toLowerCase()).toContain('role');
  });

  it('rejects act when player has already acted this turn', () => {
    const { game } = makeMinimalGame({ rollDie: () => 6, budget: 6, shots: 2 });
    game.takeRole('loc-a-extra');

    const first = game.act();
    const second = game.act();

    expect(first.success).toBe(true);
    expect(second.success).toBe(false);
    expect(second.message.toLowerCase()).toContain('already');
  });

  it('successful on-card act: removes shot, awards +1 reputation', () => {
    const { game, alice, locA } = makeMinimalGame({ budget: 3, rollDie: () => 6 });
    game.takeRole('scene-a-lead');

    const beforeRep = alice.reputation;
    const beforeCredits = alice.credits;
    const beforeShots = locA.currentScene!.remainingShots;
    const result = game.act();

    expect(result.success).toBe(true);
    expect(result.shotRemoved).toBe(true);
    expect(alice.reputation).toBe(beforeRep + 1);
    expect(alice.credits).toBe(beforeCredits);
    expect(locA.currentScene!.remainingShots).toBe(beforeShots - 1);
  });

  it('failed on-card act: no reward', () => {
    const { game, alice } = makeMinimalGame({ budget: 5, rollDie: () => 1 });
    game.takeRole('scene-a-lead');

    const beforeRep = alice.reputation;
    const beforeCredits = alice.credits;
    const result = game.act();

    expect(result.success).toBe(true);
    expect(result.shotRemoved).toBe(false);
    expect(alice.reputation).toBe(beforeRep);
    expect(alice.credits).toBe(beforeCredits);
  });

  it('successful off-card act: removes shot, awards +2 credits +1 reputation', () => {
    const { game, alice, locA } = makeMinimalGame({ budget: 3, rollDie: () => 6 });
    game.takeRole('loc-a-extra');

    const beforeRep = alice.reputation;
    const beforeCredits = alice.credits;
    const beforeShots = locA.currentScene!.remainingShots;
    const result = game.act();

    expect(result.success).toBe(true);
    expect(result.shotRemoved).toBe(true);
    expect(alice.reputation).toBe(beforeRep + 1);
    expect(alice.credits).toBe(beforeCredits + 2);
    expect(locA.currentScene!.remainingShots).toBe(beforeShots - 1);
  });

  it('failed off-card act: awards +1 credit (consolation)', () => {
    const { game, alice } = makeMinimalGame({ budget: 6, rollDie: () => 1 });
    game.takeRole('loc-a-extra');

    const beforeRep = alice.reputation;
    const beforeCredits = alice.credits;
    const result = game.act();

    expect(result.success).toBe(true);
    expect(result.shotRemoved).toBe(false);
    expect(alice.reputation).toBe(beforeRep);
    expect(alice.credits).toBe(beforeCredits + 1);
  });

  it('rehearsal tokens add to the die roll', () => {
    const { game, locA } = makeMinimalGame({ budget: 4, rollDie: () => 3, shots: 2 });
    game.takeRole('scene-a-lead');

    const rehearseResult = game.rehearse();
    game.endTurn();
    game.endTurn();
    const beforeShots = locA.currentScene!.remainingShots;
    const actResult = game.act();

    expect(rehearseResult.success).toBe(true);
    expect(actResult.success).toBe(true);
    expect(actResult.shotRemoved).toBe(true);
    expect(locA.currentScene!.remainingShots).toBe(beforeShots - 1);
  });

  it('rehearsal tokens accumulate across turns', () => {
    const { game, alice } = makeMinimalGame({ budget: 10, shots: 2 });
    game.takeRole('scene-a-lead');

    const firstRehearse = game.rehearse();
    game.endTurn();
    game.endTurn();
    const secondRehearse = game.rehearse();

    expect(firstRehearse.success).toBe(true);
    expect(secondRehearse.success).toBe(true);
    expect(alice.rehearsalTokens).toBe(2);
  });

  it('cannot rehearse and act in the same turn', () => {
    const { game } = makeMinimalGame({ rollDie: () => 6 });
    game.takeRole('scene-a-lead');

    const rehearseResult = game.rehearse();
    const actResult = game.act();

    expect(rehearseResult.success).toBe(true);
    expect(actResult.success).toBe(false);
    expect(actResult.message.toLowerCase()).toContain('already');
  });
});
