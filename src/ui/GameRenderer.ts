import { Game } from '../domain/Game';
import { Player } from '../domain/Player';
import { Location } from '../domain/Location';
import { GameEvent } from '../domain/events/GameEvents';
import { UPGRADE_COSTS, MAX_RANK } from '../domain/actions/UpgradeAction';

/**
 * Responsible for all DOM rendering.
 *
 * DESIGN PATTERN: Observer (View side)
 * This renderer subscribes to game events and re-renders the relevant
 * sections of the UI in response. It never mutates game state directly.
 *
 * MVC analogy:
 *  - Game      = Model
 *  - GameRenderer = View
 *  - ActionHandler (in ActionHandler.ts) = Controller
 *
 * Implementation note: We use innerHTML for simplicity since all content
 * is generated from trusted game state (no user-supplied text is rendered).
 */
export class GameRenderer {
  private readonly _log: string[] = [];

  constructor(
    private readonly _game: Game,
    private readonly _root: HTMLElement,
  ) {
    // Subscribe to all game events.
    this._game.events.subscribe((event) => this._onEvent(event));
  }

  /** Initial render — called once on startup. */
  render(): void {
    this._root.innerHTML = this._buildLayout();
    this._renderAll();
  }

  private _onEvent(event: GameEvent): void {
    switch (event.type) {
      case 'playerMoved':
        this._addLog(
          `${event.payload.player.name} moved to ${event.payload.to.name}.`,
        );
        break;
      case 'roleTaken':
        this._addLog(
          `${event.payload.player.name} took the role "${event.payload.roleName}" ` +
            `(${event.payload.isOnCard ? 'on-card' : 'off-card'}).`,
        );
        break;
      case 'actPerformed':
        this._addLog(event.payload.result.message);
        break;
      case 'rehearsed':
        this._addLog(
          `${event.payload.player.name} rehearsed — now has ` +
            `${event.payload.newTokenCount} token(s).`,
        );
        break;
      case 'sceneWrapped':
        {
          const r = event.payload;
          const bonuses = r.rewards
            .map((rw) => `${rw.player.name} +${rw.credits}cr +${rw.reputation}rep`)
            .join(', ');
          this._addLog(
            `🎬 Scene wrapped: "${r.scene.title}" at ${r.location.name}.` +
              (bonuses ? ` Wrap bonuses: ${bonuses}.` : ''),
          );
        }
        break;
      case 'rankUpgraded':
        this._addLog(
          `${event.payload.player.name} upgraded to rank ${event.payload.newRank}!`,
        );
        break;
      case 'turnEnded':
        this._addLog(
          `--- ${event.payload.nextPlayer.name}'s turn ---`,
        );
        break;
      case 'gameOver':
        this._addLog(
          `🏆 Game over! Winner: ${event.payload.winner.name} ` +
            `(${event.payload.winner.calculateScore()} pts)`,
        );
        break;
      case 'stateChanged':
        this._renderAll();
        break;
    }
  }

  private _renderAll(): void {
    this._renderStatus();
    this._renderPlayers();
    this._renderBoard();
    this._renderActions();
    this._renderLog();
  }

  private _renderStatus(): void {
    const el = document.getElementById('game-status');
    if (!el) return;
    if (this._game.isOver) {
      el.innerHTML = `<span class="game-over">GAME OVER</span>`;
    } else {
      const cp = this._game.currentPlayer;
      el.innerHTML =
        `<span class="turn-label">Turn ${this._game.turnManager.turnNumber}</span> — ` +
        `<span style="color:${cp.color}">● ${cp.name}'s turn</span> &nbsp;|&nbsp; ` +
        `Scenes completed: <strong>${this._game.completedScenes}</strong> &nbsp;|&nbsp; ` +
        `Deck remaining: <strong>${this._game.remainingScenes}</strong>`;
    }
  }

  private _renderPlayers(): void {
    const el = document.getElementById('players-panel');
    if (!el) return;
    el.innerHTML = this._game.players
      .map((p) => this._buildPlayerCard(p))
      .join('');
  }

  private _buildPlayerCard(p: Player): string {
    const isCurrent =
      !this._game.isOver && p.id === this._game.currentPlayer.id;
    const roleText = p.hasRole()
      ? `<em>${p.currentRoleId} (${p.currentRoleIsOnCard ? 'on-card' : 'off-card'})</em> — ${p.rehearsalTokens} token(s)`
      : 'No role';
    return `
      <div class="player-card ${isCurrent ? 'active-player' : ''}">
        <div class="player-header" style="border-left: 4px solid ${p.color}">
          <span class="player-dot" style="background:${p.color}"></span>
          <strong>${p.name}</strong>${isCurrent ? ' ★' : ''}
        </div>
        <div class="player-stats">
          <span>📍 ${this._locationName(p.locationId)}</span>
          <span>⭐ Rank ${p.rank}</span>
          <span>💰 ${p.credits} cr</span>
          <span>🎭 ${p.reputation} rep</span>
        </div>
        <div class="player-role">Role: ${roleText}</div>
        <div class="player-score">Score: ${p.calculateScore()}</div>
      </div>`;
  }

  private _locationName(id: string): string {
    try {
      return this._game.board.getLocation(id).name;
    } catch {
      return id;
    }
  }

  private _renderBoard(): void {
    const el = document.getElementById('board-panel');
    if (!el) return;
    el.innerHTML = this._game.board
      .getAllLocations()
      .map((loc) => this._buildLocationCard(loc))
      .join('');
  }

  private _buildLocationCard(loc: Location): string {
    const playersHere = this._game.players
      .filter((p) => p.locationId === loc.id)
      .map(
        (p) =>
          `<span class="player-token" style="background:${p.color}" title="${p.name}"></span>`,
      )
      .join('');

    const scene = loc.currentScene;
    const sceneHtml = scene
      ? `<div class="scene-info">
           <strong>${scene.title}</strong> (budget ${scene.budget}, ${scene.remainingShots}/${scene.totalShots} shots)
           <div class="scene-roles">
             ${scene.roles.map((r) => `<span class="role-badge ${r.isAvailable() ? '' : 'taken'}">${r.name} [R${r.requiredRank}]</span>`).join('')}
           </div>
         </div>`
      : loc.isUpgradeLocation
        ? `<div class="scene-info upgrade-note">Upgrade location</div>`
        : `<div class="scene-info empty-note">No active scene</div>`;

    const offCardHtml =
      loc.offCardRoles.length > 0
        ? `<div class="offcard-roles">Off-card: ${loc.offCardRoles.map((r) => `<span class="role-badge off-card ${r.isAvailable() ? '' : 'taken'}">${r.name} [R${r.requiredRank}]</span>`).join('')}</div>`
        : '';

    const isCurrentLocation =
      !this._game.isOver &&
      loc.id === this._game.currentPlayer.locationId;

    return `
      <div class="location-card ${isCurrentLocation ? 'current-location' : ''}">
        <div class="location-header">
          <strong>${loc.name}</strong>
          <span class="player-tokens">${playersHere}</span>
        </div>
        <div class="location-neighbors">→ ${loc.neighborIds.map((n) => this._locationName(n)).join(', ')}</div>
        ${sceneHtml}
        ${offCardHtml}
      </div>`;
  }

  private _renderActions(): void {
    const el = document.getElementById('action-panel');
    if (!el) return;

    if (this._game.isOver) {
      el.innerHTML = this._buildGameOverPanel();
      return;
    }

    const cp = this._game.currentPlayer;
    const loc = this._game.board.getLocation(cp.locationId);
    const neighbors = this._game.board.getNeighbors(cp.locationId);

    // Build sections
    const moveSection = this._buildMoveSection(neighbors);
    const roleSection = this._buildRoleSection(loc);
    const actSection = this._buildActSection();
    const upgradeSection = this._buildUpgradeSection(cp, loc);

    el.innerHTML = `
      <div class="action-section">
        <h3>Actions — ${cp.name}</h3>
        ${moveSection}
        ${roleSection}
        ${actSection}
        ${upgradeSection}
        <div class="action-group">
          <button id="btn-end-turn" class="btn-primary">End Turn</button>
        </div>
      </div>`;
  }

  private _buildMoveSection(
    neighbors: Location[],
  ): string {
    const canMoveAtAll = !this._game.currentPlayer.hasRole() && !this._game.turnManager.hasMoved;
    const buttons = neighbors
      .map((loc) => {
        const ok = this._game.canMove(loc.id);
        return `<button class="btn-move ${ok ? '' : 'disabled'}" data-move-to="${loc.id}" ${ok ? '' : 'disabled'}>Move to ${loc.name}</button>`;
      })
      .join('');
    return `<div class="action-group">
      <h4>Move ${canMoveAtAll ? '' : '(unavailable)'}</h4>
      ${buttons}
    </div>`;
  }

  private _buildRoleSection(loc: Location): string {
    const available = loc.getAvailableRoles();
    if (available.length === 0) {
      return `<div class="action-group"><h4>Roles</h4><em>No roles available here.</em></div>`;
    }
    const buttons = available
      .map((role) => {
        const ok = this._game.canTakeRole(role.id);
        return `<button class="btn-role ${ok ? '' : 'disabled'}" data-role-id="${role.id}" ${ok ? '' : 'disabled'}>
          Take: ${role.name} [R${role.requiredRank}] ${role.isOnCard ? '(on-card)' : '(off-card)'}
        </button>`;
      })
      .join('');
    return `<div class="action-group"><h4>Roles</h4>${buttons}</div>`;
  }

  private _buildActSection(): string {
    const canAct = this._game.canAct();
    const canRehearse = this._game.canRehearse();
    return `<div class="action-group">
      <h4>Scene</h4>
      <button id="btn-act" class="btn-act ${canAct ? '' : 'disabled'}" ${canAct ? '' : 'disabled'}>Act</button>
      <button id="btn-rehearse" class="btn-rehearse ${canRehearse ? '' : 'disabled'}" ${canRehearse ? '' : 'disabled'}>Rehearse</button>
    </div>`;
  }

  private _buildUpgradeSection(cp: Player, loc: Location): string {
    if (!loc.isUpgradeLocation) return '';
    const rows = UPGRADE_COSTS.filter((c) => c.toRank === cp.rank + 1 && cp.rank < MAX_RANK)
      .map((c) => {
        const canCredit = this._game.canUpgrade(c.toRank, 'credits');
        const canRep = this._game.canUpgrade(c.toRank, 'reputation');
        return `
          <button class="btn-upgrade ${canCredit ? '' : 'disabled'}" data-upgrade-rank="${c.toRank}" data-upgrade-currency="credits" ${canCredit ? '' : 'disabled'}>
            Rank ${c.toRank} — ${c.creditCost} credits
          </button>
          <button class="btn-upgrade ${canRep ? '' : 'disabled'}" data-upgrade-rank="${c.toRank}" data-upgrade-currency="reputation" ${canRep ? '' : 'disabled'}>
            Rank ${c.toRank} — ${c.reputationCost} reputation
          </button>`;
      })
      .join('');
    return rows
      ? `<div class="action-group"><h4>Upgrade Rank</h4>${rows}</div>`
      : `<div class="action-group"><h4>Upgrade Rank</h4><em>${cp.rank >= MAX_RANK ? 'Maximum rank reached.' : 'Cannot upgrade (insufficient funds).'}</em></div>`;
  }

  private _buildGameOverPanel(): string {
    const scores = this._game.players
      .map((p) => ({ p, score: p.calculateScore() }))
      .sort((a, b) => b.score - a.score);
    const rows = scores
      .map(
        ({ p, score }, i) =>
          `<tr>
            <td>${i + 1}</td>
            <td><span style="color:${p.color}">●</span> ${p.name}</td>
            <td>${score}</td>
            <td>${p.reputation * 2} rep×2</td>
            <td>${p.credits} cr</td>
            <td>rank ${p.rank}</td>
          </tr>`,
      )
      .join('');
    return `
      <div class="game-over-panel">
        <h2>🏆 Game Over</h2>
        <p>Winner: <strong>${scores[0].p.name}</strong></p>
        <table class="score-table">
          <thead><tr><th>#</th><th>Player</th><th>Score</th><th>Rep</th><th>Credits</th><th>Rank</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  private _renderLog(): void {
    const el = document.getElementById('log-panel');
    if (!el) return;
    const items = this._log
      .slice(-20)
      .reverse()
      .map((msg) => `<div class="log-entry">${msg}</div>`)
      .join('');
    el.innerHTML = `<h4>Event Log</h4><div class="log-entries">${items}</div>`;
  }

  private _addLog(msg: string): void {
    this._log.push(msg);
    this._renderLog();
  }

  private _buildLayout(): string {
    return `
      <header class="game-header">
        <h1>🎬 CinemaCity</h1>
        <div id="game-status" class="game-status"></div>
      </header>
      <main class="game-main">
        <section class="board-section">
          <h2>Studio Locations</h2>
          <div id="board-panel" class="board-panel"></div>
        </section>
        <aside class="sidebar">
          <div id="players-panel" class="players-panel"></div>
          <div id="action-panel" class="action-panel"></div>
          <div id="log-panel" class="log-panel"></div>
        </aside>
      </main>`;
  }
}
