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

  setScene(card: SceneCard): void {
    this._currentScene = card;
  }

  clearScene(): void {
    this._currentScene = null;
  }

  hasScene(): boolean {
    return this._currentScene !== null;
  }

  /**
   * Returns all roles available for a player to take at this location.
   *
   * CRITICAL: Roles are only available if a scene is active here.
   * Return [] when there is no scene, even if offCardRoles exist.
   *
   * Returns an empty list without an active scene; otherwise combines
   * available scene and off-card roles.
   */
  getAvailableRoles(): Role[] {
    if (!this._currentScene) return [];
    return [
      ...this._currentScene.getAvailableRoles(),
      ...this.offCardRoles.filter((role) => role.isAvailable()),
    ];
  }

  isNeighborOf(locationId: string): boolean {
    return this.neighborIds.includes(locationId);
  }
}
