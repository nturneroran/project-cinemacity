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
   * Checks role ownership, the per-turn act/rehearse limit, and scene presence.
   */
  validate(): ActionResult {
    if (!this.player.hasRole()) {
      return { success: false, message: 'You must take a role before acting.' };
    }
    if (this.turnManager.hasActed || this.turnManager.hasRehearsed) {
      return { success: false, message: 'You have already acted or rehearsed this turn.' };
    }
    const location = this.board.getLocation(this.player.locationId);
    if (!location.hasScene()) {
      return { success: false, message: 'There is no active scene at this location.' };
    }
    return { success: true, message: '' };
  }

  /**
   * Rolls for the player's role, applies the result rewards, and handles scene
   * completion through the configured wrap callback.
   */
  execute(): ActionResult {
    const validation = this.validate();
    if (!validation.success) return validation;

    const location = this.board.getLocation(this.player.locationId);
    const scene = location.currentScene!;
    const role = [...scene.roles, ...location.offCardRoles].find(
      (candidate) => candidate.id === this.player.currentRoleId,
    );
    if (!role) {
      return { success: false, message: 'Your role is not present at this location.' };
    }

    const dieRoll = this.rollDie();
    const total = dieRoll + this.player.rehearsalTokens;
    const succeeded = total >= scene.budget;
    let shotRemoved = false;
    let sceneCompleted = false;

    if (succeeded) {
      sceneCompleted = scene.removeShot();
      shotRemoved = true;
      if (role.isOnCard) {
        this.player.earnReputation(1);
      } else {
        this.player.earnCredits(2);
        this.player.earnReputation(1);
      }
    } else if (!role.isOnCard) {
      this.player.earnCredits(1);
    }

    this.turnManager.recordAct();
    const result: ActionResult = {
      success: true,
      message: succeeded ? 'The acting attempt succeeded.' : 'The acting attempt failed.',
      dieRoll,
      shotRemoved,
      sceneCompleted,
    };
    this.events.emit({ type: 'actPerformed', payload: { player: this.player, result } });

    if (sceneCompleted) {
      const rewards = this.onSceneWrap(scene, location);
      this.events.emit({ type: 'sceneWrapped', payload: { location, scene, rewards } });
    }
    this.events.emit({ type: 'stateChanged', payload: {} });
    return result;
  }
}
