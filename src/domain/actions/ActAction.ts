import { Action } from './Action';
import { ActionResult } from '../types';
import { Player } from '../Player';
import { Board } from '../Board';
import { SceneCard } from '../SceneCard';
import { Location } from '../Location';
import { TurnManager } from '../TurnManager';
import { GameEventEmitter } from '../events/GameEventEmitter';

/**
 * Callback provided by the Game to handle scene-wrap side effects
 * (reward distribution, role cleanup, deck draw, game-over check).
 * Keeping this as a callback avoids a circular import between ActAction ↔ Game.
 */
export type WrapHandler = (
  scene: SceneCard,
  location: Location,
) => Array<{ player: Player; credits: number; reputation: number }>;

/**
 * Command: attempt to act in the current scene.
 *
 * Acting mechanic:
 *  - Roll one six-sided die.
 *  - Add rehearsal tokens as a bonus.
 *  - If (roll + tokens) >= scene budget: SUCCESS.
 *    - Remove one shot counter from the scene.
 *    - On-card role: earn +1 reputation. (Wrap bonus paid separately on scene completion.)
 *    - Off-card role: earn +2 credits, +1 reputation.
 *  - If roll < budget: FAILURE.
 *    - On-card role: no reward.
 *    - Off-card role: earn +1 credit (consolation — showed up for the day).
 *  - If the scene's last shot is removed, onSceneWrap() is called.
 */
export class ActAction implements Action {
  readonly type = 'act';

  constructor(
    private readonly player: Player,
    private readonly board: Board,
    private readonly turnManager: TurnManager,
    private readonly events: GameEventEmitter,
    /** Injectable die roller — pass a deterministic function in tests. */
    private readonly rollDie: () => number,
    /** Provided by Game; handles wrap bonuses, cleanup, and next-card draw. */
    private readonly onSceneWrap: WrapHandler,
  ) {}

  /**
   * TODO: implement this method
   * Hint: reject if player has no role, already acted/rehearsed this turn,
   *       or no active scene at location
   */
  validate(): ActionResult {
    throw new Error('Not implemented');
  }

  /**
   * TODO: implement this method
   * Hint:
   *  1. Call validate(); return early if invalid.
   *  2. Look up the location and scene.
   *  3. Find the player's role among scene.roles and location.offCardRoles.
   *  4. Roll die, add rehearsal tokens; compare total to scene.budget.
   *  5. On success: call scene.removeShot(); award on-card (+1 rep) or off-card (+2 cr, +1 rep).
   *  6. On failure: award off-card consolation (+1 cr only).
   *  7. Call turnManager.recordAct().
   *  8. Emit actPerformed.
   *  9. If scene completed, call onSceneWrap and emit sceneWrapped.
   * 10. Emit stateChanged.
   * 11. Return the ActionResult with dieRoll, shotRemoved, sceneCompleted fields.
   */
  execute(): ActionResult {
    throw new Error('Not implemented');
  }
}
