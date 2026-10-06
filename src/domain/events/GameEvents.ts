import { Player } from '../Player';
import { Location } from '../Location';
import { SceneCard } from '../SceneCard';
import { ActionResult } from '../types';

/**
 * Typed event payloads emitted by the Game.
 *
 * DESIGN PATTERN: Observer (see GameEventEmitter)
 *
 * Using a discriminated union means the UI can switch on `event.type` and
 * get full type inference on the payload — no casting needed.
 */

export interface PlayerMovedPayload {
  player: Player;
  from: Location;
  to: Location;
}

export interface RoleTakenPayload {
  player: Player;
  roleId: string;
  roleName: string;
  isOnCard: boolean;
  location: Location;
}

export interface ActPerformedPayload {
  player: Player;
  result: ActionResult;
}

export interface RehearsedPayload {
  player: Player;
  newTokenCount: number;
}

export interface SceneWrappedPayload {
  location: Location;
  scene: SceneCard;
  rewards: Array<{ player: Player; credits: number; reputation: number }>;
}

export interface RankUpgradedPayload {
  player: Player;
  oldRank: number;
  newRank: number;
}

export interface TurnEndedPayload {
  previousPlayer: Player;
  nextPlayer: Player;
}

export interface GameOverPayload {
  winner: Player;
  scores: Array<{ player: Player; score: number }>;
}

/** Discriminated union covering all events the Game can emit. */
export type GameEvent =
  | { type: 'playerMoved'; payload: PlayerMovedPayload }
  | { type: 'roleTaken'; payload: RoleTakenPayload }
  | { type: 'actPerformed'; payload: ActPerformedPayload }
  | { type: 'rehearsed'; payload: RehearsedPayload }
  | { type: 'sceneWrapped'; payload: SceneWrappedPayload }
  | { type: 'rankUpgraded'; payload: RankUpgradedPayload }
  | { type: 'turnEnded'; payload: TurnEndedPayload }
  | { type: 'gameOver'; payload: GameOverPayload }
  /** Catch-all to trigger a full UI re-render after any state change. */
  | { type: 'stateChanged'; payload: Record<string, never> };
