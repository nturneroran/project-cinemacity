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
    const { game, alice } = makeMinimalGame({ playerRank: 1 });
    const result = game.takeRole('scene-a-lead');
    expect(result.success).toBe(false);
    expect(result.message.toLowerCase()).toContain('rank');
    expect(alice.hasRole()).toBe(false);
  });

  it('rejects taking a role when player already has a role', () => {
    const { game } = makeMinimalGame({ playerRank: 2 });
    expect(game.takeRole('scene-a-lead').success).toBe(true);
    const result = game.takeRole('scene-b-lead');
    expect(result.success).toBe(false);
    expect(result.message.toLowerCase()).toContain('already');
  });

  it('rejects taking a role that is already taken by another player', () => {
    const { game } = makeMinimalGame({ playerRank: 2 });
    expect(game.takeRole('scene-a-lead').success).toBe(true);
    expect(game.endTurn().success).toBe(true);
    const result = game.takeRole('scene-a-lead');
    expect(result.success).toBe(false);
  });

  it('marks the role as unavailable after it is taken', () => {
    const { game, locA } = makeMinimalGame({ playerRank: 2 });
    const role = locA.currentScene!.roles[0];
    expect(game.takeRole(role.id).success).toBe(true);
    expect(role.isAvailable()).toBe(false);
    expect(role.takenByPlayerId).toBe('alice');
  });

  it('allows taking an off-card role with rank 1', () => {
    const { game, alice } = makeMinimalGame({ playerRank: 1 });
    expect(game.takeRole('loc-a-extra').success).toBe(true);
    expect(alice.currentRoleId).toBe('loc-a-extra');
    expect(alice.currentRoleIsOnCard).toBe(false);
  });

  it('rejects taking a role with no active scene at the location', () => {
    const { game, locA } = makeMinimalGame();
    locA.clearScene();
    expect(game.takeRole('loc-a-extra').success).toBe(false);
  });

  it('domain rejects illegal action — rank insufficient (domain-layer enforcement)', () => {
    const { game, alice } = makeMinimalGame({ playerRank: 1 });
    expect(game.takeRole('scene-a-lead').success).toBe(false);
    expect(alice.hasRole()).toBe(false);
  });
});
