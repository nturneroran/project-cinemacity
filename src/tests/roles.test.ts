import { describe, it, expect } from 'vitest';
import { makeMinimalGame } from './helpers';

describe('Role rules', () => {
  it('allows taking a role when rank is sufficient', () => {
    const { game, alice } = makeMinimalGame({ playerRank: 2 });
    const result = game.takeRole('scene-a-lead');
    expect(result.success).toBe(true);
    expect(alice.currentRoleId).toBe('scene-a-lead');
  });

  it('rejects taking a role when rank is too low', () => {
    const { game } = makeMinimalGame({ playerRank: 1 });
    const result = game.takeRole('scene-a-lead');
    expect(result.success).toBe(false);
    expect(result.message).toContain('rank');
  });

  it('rejects taking a role when player already has a role', () => {
    const { game } = makeMinimalGame();
    expect(game.takeRole('scene-a-lead').success).toBe(true);
    const result = game.takeRole('loc-a-extra');
    expect(result.success).toBe(false);
    expect(result.message).toContain('already');
  });

  it('rejects taking a role that is already taken by another player', () => {
    const { game } = makeMinimalGame();
    expect(game.takeRole('scene-a-lead').success).toBe(true);
    game.endTurn();
    const result = game.takeRole('scene-a-lead');
    expect(result.success).toBe(false);
  });

  it('marks the role as unavailable after it is taken', () => {
    const { game, locA } = makeMinimalGame();
    expect(game.takeRole('scene-a-lead').success).toBe(true);
    const role = locA.currentScene!.roles[0];
    expect(role.isAvailable()).toBe(false);
    expect(role.takenByPlayerId).toBe('alice');
  });

  it('allows taking an off-card role with rank 1', () => {
    const { game, alice } = makeMinimalGame({ playerRank: 1 });
    const result = game.takeRole('loc-a-extra');
    expect(result.success).toBe(true);
    expect(alice.currentRoleIsOnCard).toBe(false);
  });

  it('rejects taking a role with no active scene at the location', () => {
    const { game, locA } = makeMinimalGame();
    locA.clearScene();
    const result = game.takeRole('loc-a-extra');
    expect(result.success).toBe(false);
  });

  it('domain rejects illegal action — rank insufficient (domain-layer enforcement)', () => {
    const { game, alice } = makeMinimalGame({ playerRank: 1 });
    const result = game.takeRole('scene-a-lead');
    expect(result.success).toBe(false);
    expect(alice.hasRole()).toBe(false);
  });
});
