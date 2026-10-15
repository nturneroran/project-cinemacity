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
    expect(alice.currentRoleId).toBeNull();
  });

  it('rejects taking a role when player already has a role', () => {
    const { game } = makeMinimalGame({ playerRank: 2 });

    const first = game.takeRole('scene-a-lead');
    const second = game.takeRole('loc-a-extra');

    expect(first.success).toBe(true);
    expect(second.success).toBe(false);
    expect(second.message.toLowerCase()).toContain('already');
  });

  it('rejects taking a role that is already taken by another player', () => {
    const { game } = makeMinimalGame({ playerRank: 2 });

    const aliceTake = game.takeRole('scene-a-lead');
    game.endTurn();
    const bobTake = game.takeRole('scene-a-lead');

    expect(aliceTake.success).toBe(true);
    expect(bobTake.success).toBe(false);
  });

  it('marks the role as unavailable after it is taken', () => {
    const { game, locA } = makeMinimalGame({ playerRank: 2 });

    const result = game.takeRole('scene-a-lead');
    const role = locA.currentScene!.roles.find((r) => r.id === 'scene-a-lead')!;

    expect(result.success).toBe(true);
    expect(role.isAvailable()).toBe(false);
    expect(role.takenByPlayerId).toBe('alice');
  });

  it('allows taking an off-card role with rank 1', () => {
    const { game, alice } = makeMinimalGame({ playerRank: 1 });

    const result = game.takeRole('loc-a-extra');

    expect(result.success).toBe(true);
    expect(alice.currentRoleId).toBe('loc-a-extra');
    expect(alice.currentRoleIsOnCard).toBe(false);
  });

  it('rejects taking a role with no active scene at the location', () => {
    const { game, locA } = makeMinimalGame({ playerRank: 2 });
    locA.clearScene();

    const result = game.takeRole('scene-a-lead');

    expect(result.success).toBe(false);
    expect(result.message.toLowerCase()).toContain('scene');
  });

  it('domain rejects illegal action — rank insufficient (domain-layer enforcement)', () => {
    const { game, alice } = makeMinimalGame({ playerRank: 1 });

    const result = game.takeRole('scene-a-lead');

    expect(result.success).toBe(false);
    expect(alice.hasRole()).toBe(false);
  });
});
