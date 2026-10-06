import { Role } from './Role';
import { SceneCard } from './SceneCard';

/**
 * A named place on the board where players can move, take roles, and film scenes.
 *
 * Responsibilities:
 *  - Know its neighbor IDs (adjacency is validated by Board).
 *  - Hold the current scene card (if any).
 *  - Hold permanent off-card roles.
 *  - Expose all currently available roles to interested parties.
 *
 * Does NOT know about players or game rules.
 */
export class Location {
  private _currentScene: SceneCard | null = null;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    /** IDs of adjacent locations. Adjacency is symmetric by convention. */
    public readonly neighborIds: string[],
    /** Roles permanently attached to this location (off-card roles). */
    public readonly offCardRoles: Role[],
    /** If true, players may upgrade their rank here (no scene cards). */
    public readonly isUpgradeLocation: boolean,
  ) {}

  get currentScene(): SceneCard | null {
    return this._currentScene;
  }

  // TODO: implement this method
  // Hint: assign the given card to _currentScene
  setScene(card: SceneCard): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _currentScene to null
  clearScene(): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: return true when _currentScene is not null
  hasScene(): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Returns all roles available for a player to take at this location.
   *
   * CRITICAL: Roles are only available if a scene is active here.
   * Return [] when there is no scene, even if offCardRoles exist.
   *
   * TODO: implement this method
   * Hint: if no scene, return []; otherwise combine scene's available roles with available off-card roles
   */
  getAvailableRoles(): Role[] {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: return true when locationId appears in the neighborIds array
  isNeighborOf(locationId: string): boolean {
    throw new Error('Not implemented');
  }
}
