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
    // TODO: implement this test
    // Hint: makeMinimalGame(); call game.act() without taking a role; assert failure with 'role' in message
    expect(true).toBe(false);
  });

  it('rejects act when player has already acted this turn', () => {
    // TODO: implement this test
    // Hint: take role, act once, act again; second should fail with 'already' in message
    expect(true).toBe(false);
  });

  it('successful on-card act: removes shot, awards +1 reputation', () => {
    // TODO: implement this test
    // Hint: budget=3, rollDie=()=>6; take scene-a-lead (on-card); act; assert rep+1, credits unchanged, shot removed
    expect(true).toBe(false);
  });

  it('failed on-card act: no reward', () => {
    // TODO: implement this test
    // Hint: budget=5, rollDie=()=>1; take on-card role; act; assert credits and rep unchanged
    expect(true).toBe(false);
  });

  it('successful off-card act: removes shot, awards +2 credits +1 reputation', () => {
    // TODO: implement this test
    // Hint: budget=3, rollDie=()=>6; take loc-a-extra (off-card); act; assert credits+2, rep+1, shot removed
    expect(true).toBe(false);
  });

  it('failed off-card act: awards +1 credit (consolation)', () => {
    // TODO: implement this test
    // Hint: budget=6, rollDie=()=>1; take off-card role; act; assert credits+1
    expect(true).toBe(false);
  });

  it('rehearsal tokens add to the die roll', () => {
    // TODO: implement this test
    // Hint: budget=4, rollDie=()=>3; rehearse (+1 token); endTurn both players; act; 3+1=4 >= 4 → success
    expect(true).toBe(false);
  });

  it('rehearsal tokens accumulate across turns', () => {
    // TODO: implement this test
    // Hint: rehearse on turn 1, endTurn; rehearse again on turn 2; assert rehearsalTokens === 2
    expect(true).toBe(false);
  });

  it('cannot rehearse and act in the same turn', () => {
    // TODO: implement this test
    // Hint: rehearse, then act; act should fail with 'already' in message
    expect(true).toBe(false);
  });
});
