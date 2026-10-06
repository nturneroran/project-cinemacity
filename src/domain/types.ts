/**
 * Shared type definitions used across the CinemaCity domain layer.
 *
 * Keeping types in one file makes contracts visible and easy to modify
 * when teaching about interface design and coupling.
 */

/** The four player colors supported in a 2–4 player game. */
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

/** Currency types a player can spend on rank upgrades. */
export type Currency = 'credits' | 'reputation';

/**
 * The result returned by every domain action.
 * Using a result object (rather than exceptions) keeps control flow readable
 * and allows the UI to display meaningful feedback without try/catch.
 */
export interface ActionResult {
  /** Whether the action was legally executed. */
  success: boolean;
  /** Human-readable explanation for the UI log. */
  message: string;
  /** Die roll used during Act, if applicable. */
  dieRoll?: number;
  /** Whether a shot counter was removed from the scene. */
  shotRemoved?: boolean;
  /** Whether the scene completed (wrapped) after this action. */
  sceneCompleted?: boolean;
}

// ---------------------------------------------------------------------------
// Raw data shapes — used only by factories to deserialize JSON.
// Domain classes should NOT depend on these; they depend on domain objects.
// ---------------------------------------------------------------------------

export interface RoleData {
  id: string;
  name: string;
  requiredRank: number;
  pay: number;
  line: string;
}

export interface SceneCardData {
  id: string;
  title: string;
  description: string;
  budget: number;
  shots: number;
  roles: RoleData[];
}

export interface LocationData {
  id: string;
  name: string;
  description: string;
  neighbors: string[];
  offCardRoles: RoleData[];
  isUpgradeLocation: boolean;
}

/** One row in the upgrade cost table. */
export interface UpgradeCostEntry {
  toRank: number;
  creditCost: number;
  reputationCost: number;
}

/** Summary used by the UI when the game ends. */
export interface ScoreEntry {
  playerName: string;
  score: number;
}
