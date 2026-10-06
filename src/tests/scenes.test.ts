import { describe, it, expect } from 'vitest';
import { makeMinimalGame } from './helpers';

/**
 * Scene completion (wrapping) tests.
 *
 * When all shot counters reach 0:
 *  - On-card players receive wrap bonuses (pay in credits, +2 reputation).
 *  - All player roles are cleared.
 *  - All role slots are vacated.
 *  - Scene is removed from the location.
 *  - completedScenes counter increments.
 *  - A new scene is dealt if the deck has cards.
 */
describe('Scene completion', () => {
  it('removes the scene after all shots are taken', () => {
    const { game, locA } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    game.takeRole('scene-a-lead');
    const result = game.act();
    expect(result.sceneCompleted).toBe(true);
    expect(locA.currentScene).toBeNull();
  });

  it('tracks completed scene count', () => {
    const { game } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    expect(game.completedScenes).toBe(0);
    game.takeRole('scene-a-lead');
    game.act();
    expect(game.completedScenes).toBe(1);
  });

  it('awards wrap bonuses to on-card players', () => {
    const { game, alice } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    game.takeRole('scene-a-lead');
    game.act();
    expect(alice.credits).toBe(8);
    expect(alice.reputation).toBe(3);
  });

  it('clears player roles after scene wrap', () => {
    const { game, alice } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    game.takeRole('scene-a-lead');
    alice.addRehearsalToken();
    game.act();
    expect(alice.hasRole()).toBe(false);
    expect(alice.rehearsalTokens).toBe(0);
  });

  it('vacates role slots so they are available in future scenes', () => {
    const { game, locA } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    const role = locA.currentScene!.roles[0];
    game.takeRole(role.id);
    game.act();
    expect(role.isAvailable()).toBe(true);
  });

  it('does not complete scene prematurely — requires all shots', () => {
    const { game } = makeMinimalGame({ shots: 3, budget: 1, rollDie: () => 6 });
    game.takeRole('scene-a-lead');
    game.act();
    expect(game.completedScenes).toBe(0);
    game.endTurn();
    game.endTurn();
    game.act();
    expect(game.completedScenes).toBe(0);
  });

  it('clears off-card player roles on wrap too', () => {
    const { game, alice } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    game.takeRole('loc-a-extra');
    game.act();
    expect(alice.hasRole()).toBe(false);
  });
});
