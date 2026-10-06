import { Board } from '../Board';
import { Location } from '../Location';
import { Role } from '../Role';
import { LocationData, RoleData } from '../types';

/**
 * DESIGN PATTERN: Factory
 *
 * Converts raw JSON data (LocationData[]) into fully constructed domain objects
 * (Board, Location, Role).
 *
 * Separating construction from the domain classes themselves:
 *  - Keeps domain classes focused on behavior, not parsing.
 *  - Makes the JSON → object mapping explicit and testable.
 *  - Allows swapping data sources (JSON file vs network vs hard-coded) without
 *    touching the domain.
 */
export class BoardFactory {
  static create(locationsData: LocationData[]): Board {
    const locations = locationsData.map((data) =>
      BoardFactory.createLocation(data),
    );
    return new Board(locations);
  }

  static createLocation(data: LocationData): Location {
    const offCardRoles = data.offCardRoles.map((r) =>
      BoardFactory.createRole(r, false),
    );
    return new Location(
      data.id,
      data.name,
      data.description,
      data.neighbors,
      offCardRoles,
      data.isUpgradeLocation,
    );
  }

  static createRole(data: RoleData, isOnCard: boolean): Role {
    return new Role(
      data.id,
      data.name,
      data.requiredRank,
      data.pay,
      isOnCard,
      data.line,
    );
  }
}
