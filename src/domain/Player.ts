/**
 * Represents a single player in the game.
 *
 * Responsibilities:
 *  - Own all player state: identity, position, rank, resources, role, tokens.
 *  - Provide mutation methods that validate preconditions (e.g., spendCredits).
 *  - Calculate the final score for winner determination.
 *
 * Does NOT know about the board, rules, or other players.
 */
export class Player {
  private _locationId: string;
  private _rank: number;
  private _credits: number;
  private _reputation: number;
  private _currentRoleId: string | null = null;
  private _currentRoleIsOnCard: boolean = false;
  private _rehearsalTokens: number = 0;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly color: string,
    startingLocationId: string,
    startingRank: number = 1,
    startingCredits: number = 2,
    startingReputation: number = 0,
  ) {
    this._locationId = startingLocationId;
    this._rank = startingRank;
    this._credits = startingCredits;
    this._reputation = startingReputation;
  }

  // --- Getters ---

  get locationId(): string {
    return this._locationId;
  }
  get rank(): number {
    return this._rank;
  }
  get credits(): number {
    return this._credits;
  }
  get reputation(): number {
    return this._reputation;
  }
  get currentRoleId(): string | null {
    return this._currentRoleId;
  }
  get currentRoleIsOnCard(): boolean {
    return this._currentRoleIsOnCard;
  }
  get rehearsalTokens(): number {
    return this._rehearsalTokens;
  }

  hasRole(): boolean {
    return this._currentRoleId !== null;
  }

  // --- Mutators ---

  moveTo(locationId: string): void {
    this._locationId = locationId;
  }

  takeRole(roleId: string, isOnCard: boolean): void {
    this._currentRoleId = roleId;
    this._currentRoleIsOnCard = isOnCard;
    this._rehearsalTokens = 0;
  }

  clearRole(): void {
    this._currentRoleId = null;
    this._currentRoleIsOnCard = false;
    this._rehearsalTokens = 0;
  }

  addRehearsalToken(): void {
    this._rehearsalTokens += 1;
  }

  earnCredits(amount: number): void {
    this._credits += amount;
  }

  earnReputation(amount: number): void {
    this._reputation += amount;
  }

  spendCredits(amount: number): void {
    if (amount > this._credits) {
      throw new Error('Insufficient credits.');
    }
    this._credits -= amount;
  }

  spendReputation(amount: number): void {
    if (amount > this._reputation) {
      throw new Error('Insufficient reputation.');
    }
    this._reputation -= amount;
  }

  upgradeRank(toRank: number): void {
    this._rank = toRank;
  }

  /**
   * Final score for winner calculation.
   * Formula: reputation × 2 + credits + rank
   * Reputation is worth the most because it reflects artistic success.
   *
   * Reputation is worth the most because it reflects artistic success.
   */
  calculateScore(): number {
    return this._reputation * 2 + this._credits + this._rank;
  }
}
