import { describe, it, expect } from 'vitest';
import { makeMinimalGame } from './helpers';

describe('Role rules', () => {
  it('allows taking a role when rank is sufficient', () => {
    // TODO: implement this test
    // Hint: makeMinimalGame({ playerRank: 2 }); scene-a-lead requires rank 2; assert success and currentRoleId
    expect(true).toBe(false);
  });

  it('rejects taking a role when rank is too low', () => {
    // TODO: implement this test
    // Hint: makeMinimalGame({ playerRank: 1 }); scene-a-lead requires rank 2; assert failure and message
    expect(true).toBe(false);
  });

  it('rejects taking a role when player already has a role', () => {
    // TODO: implement this test
    // Hint: take a role, then try taking another; assert second attempt fails with "already" in message
    expect(true).toBe(false);
  });

  it('rejects taking a role that is already taken by another player', () => {
    // TODO: implement this test
    // Hint: Alice takes scene-a-lead; Bob (after endTurn) tries same role; assert failure
    expect(true).toBe(false);
  });

  it('marks the role as unavailable after it is taken', () => {
    // TODO: implement this test
    // Hint: after takeRole succeeds, assert role.isAvailable() === false and role.takenByPlayerId === 'alice'
    expect(true).toBe(false);
  });

  it('allows taking an off-card role with rank 1', () => {
    // TODO: implement this test
    // Hint: makeMinimalGame({ playerRank: 1 }); loc-a-extra is off-card rank 1; assert success and isOnCard === false
    expect(true).toBe(false);
  });

  it('rejects taking a role with no active scene at the location', () => {
    // TODO: implement this test
    // Hint: clearScene() on locA, then try to take a role; assert failure
    expect(true).toBe(false);
  });

  it('domain rejects illegal action — rank insufficient (domain-layer enforcement)', () => {
    // TODO: implement this test
    // Hint: confirm that player.hasRole() is still false after a failed takeRole
    expect(true).toBe(false);
  });
});
