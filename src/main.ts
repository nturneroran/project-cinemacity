/**
 * main.ts — Application entry point.
 *
 * Responsibilities:
 *  1. Show a startup screen where players enter their names.
 *  2. Construct the Game using GameFactory (Factory pattern).
 *  3. Initialize the GameRenderer (Observer pattern — subscribes to events).
 *  4. Initialize the ActionHandler (Controller — wires DOM events to Game).
 */
import './style.css';
import { GameFactory } from './domain/factories/GameFactory';
import { GameRenderer } from './ui/GameRenderer';
import { ActionHandler } from './ui/ActionHandler';
import locationsData from './data/locations.json';
import sceneCardsData from './data/scenecards.json';

const app = document.getElementById('app')!;

// Show startup screen first.
showStartupScreen();

function showStartupScreen(): void {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const defaultNames = ['Alice', 'Bob', 'Carol', 'Dave'];

  app.innerHTML = `
    <div class="startup-screen">
      <h1>🎬 CinemaCity</h1>
      <p>A movie studio board game for 2–4 players. Move around the lot, take roles, act in scenes, and earn the most points to win.</p>
      <div class="startup-form">
        <label>Number of players</label>
        <select id="player-count" style="padding:0.45rem 0.7rem;border-radius:4px;border:1px solid #2a3a5e;background:#1a1a2e;color:#e0e0e0;font-size:0.9rem;">
          <option value="2">2 Players</option>
          <option value="3">3 Players</option>
          <option value="4" selected>4 Players</option>
        </select>
        <label>Player names</label>
        ${defaultNames
          .map(
            (name, i) => `
          <div class="player-row" id="player-row-${i}">
            <span class="player-dot" style="background:${colors[i]}"></span>
            <input type="text" id="player-name-${i}" placeholder="Player ${i + 1}" value="${name}" maxlength="20" />
          </div>`,
          )
          .join('')}
        <div id="start-error" class="error-msg"></div>
        <button class="btn-start" id="btn-start">Start Game</button>
      </div>
    </div>`;

  // Show/hide player rows based on count selection.
  const countSelect = document.getElementById('player-count') as HTMLSelectElement;
  updatePlayerRows(parseInt(countSelect.value, 10));
  countSelect.addEventListener('change', () => {
    updatePlayerRows(parseInt(countSelect.value, 10));
  });

  document.getElementById('btn-start')!.addEventListener('click', startGame);
}

function updatePlayerRows(count: number): void {
  for (let i = 0; i < 4; i++) {
    const row = document.getElementById(`player-row-${i}`);
    if (row) row.style.display = i < count ? 'flex' : 'none';
  }
}

function startGame(): void {
  const countSelect = document.getElementById('player-count') as HTMLSelectElement;
  const count = parseInt(countSelect.value, 10);
  const errorEl = document.getElementById('start-error')!;

  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const input = document.getElementById(`player-name-${i}`) as HTMLInputElement;
    const name = input.value.trim();
    if (!name) {
      errorEl.textContent = `Please enter a name for player ${i + 1}.`;
      return;
    }
    if (names.includes(name)) {
      errorEl.textContent = `Player names must be unique.`;
      return;
    }
    names.push(name);
  }

  errorEl.textContent = '';

  try {
    // Factory pattern: one call assembles the entire game.
    const game = GameFactory.create(names, locationsData, sceneCardsData);

    // Clear startup screen and render game UI.
    app.innerHTML = '';

    // Observer pattern: renderer subscribes to game events.
    const renderer = new GameRenderer(game, app);
    renderer.render();

    // Controller: wire up all button clicks.
    const handler = new ActionHandler(game, app);
    handler.attach();
  } catch (err) {
    errorEl.textContent = String(err);
  }
}
