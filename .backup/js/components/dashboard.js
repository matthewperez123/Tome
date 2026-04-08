import * as store from '../store.js';

export default {
  render() {
    const state = store.getState();
    const stats = store.getTotalStats();

    const latinState = state.languages.latin;
    const greekState = state.languages.greek;

    // Generate last 28 days activity grid
    const activityCells = generateActivityGrid(state);

    return `
      <div class="page">
        <div class="dashboard-header">
          <h1>Your Progress</h1>
          <p style="color: var(--color-ink-light);">Track your journey through the classics.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat">
              <div class="stat-value">${stats.streak}</div>
              <div class="stat-label">Day Streak</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat">
              <div class="stat-value">${stats.totalLessons}</div>
              <div class="stat-label">Lessons Done</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat">
              <div class="stat-value">${stats.totalVocab}</div>
              <div class="stat-label">Words Mastered</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat">
              <div class="stat-value">${stats.totalXp}</div>
              <div class="stat-label">Total XP</div>
            </div>
          </div>
        </div>

        <!-- Latin Progress -->
        <div class="language-progress-card">
          <h3>&#x1F3DB; Latin</h3>
          <div class="progress-detail">
            <span>Lessons completed</span>
            <span>${latinState.lessonsCompleted.length} / 3</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill latin" style="width: ${(latinState.lessonsCompleted.length / 3) * 100}%"></div>
          </div>
          <div style="display: flex; gap: var(--space-xl); margin-top: var(--space-md);">
            <div>
              <span style="font-weight: 600;">${latinState.vocabularyMastered.length}</span>
              <span style="color: var(--color-shadow); font-size: var(--text-sm);"> words mastered</span>
            </div>
            <div>
              <span style="font-weight: 600;">${latinState.totalXp}</span>
              <span style="color: var(--color-shadow); font-size: var(--text-sm);"> XP earned</span>
            </div>
          </div>
          ${latinState.lessonsCompleted.length < 3 ? `
            <a href="#/lessons/latin" class="btn btn-latin" style="margin-top: var(--space-md); display: inline-flex;">Continue Latin</a>
          ` : `
            <p style="color: var(--color-success); font-weight: 600; margin-top: var(--space-md);">&#x2713; All lessons complete!</p>
          `}
        </div>

        <!-- Greek Progress -->
        <div class="language-progress-card">
          <h3>&#x1F3FA; Ancient Greek</h3>
          <div class="progress-detail">
            <span>Lessons completed</span>
            <span>${greekState.lessonsCompleted.length} / 3</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill greek" style="width: ${(greekState.lessonsCompleted.length / 3) * 100}%"></div>
          </div>
          <div style="display: flex; gap: var(--space-xl); margin-top: var(--space-md);">
            <div>
              <span style="font-weight: 600;">${greekState.vocabularyMastered.length}</span>
              <span style="color: var(--color-shadow); font-size: var(--text-sm);"> words mastered</span>
            </div>
            <div>
              <span style="font-weight: 600;">${greekState.totalXp}</span>
              <span style="color: var(--color-shadow); font-size: var(--text-sm);"> XP earned</span>
            </div>
          </div>
          ${greekState.lessonsCompleted.length < 3 ? `
            <a href="#/lessons/greek" class="btn btn-greek" style="margin-top: var(--space-md); display: inline-flex;">Continue Greek</a>
          ` : `
            <p style="color: var(--color-success); font-weight: 600; margin-top: var(--space-md);">&#x2713; All lessons complete!</p>
          `}
        </div>

        <!-- Activity -->
        <div class="language-progress-card">
          <h3>Activity (Last 28 Days)</h3>
          <div class="activity-grid">
            ${activityCells}
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: var(--space-sm); font-size: var(--text-xs); color: var(--color-shadow);">
            <span>4 weeks ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {}
};

function generateActivityGrid(state) {
  // Simple activity grid based on whether there's data
  const today = new Date();
  const cells = [];

  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    let level = 0;
    if (dateStr === state.streak.lastActivityDate) level = 3;
    else if (state.streak.currentStreak > 0 && i < state.streak.currentStreak) level = 2;

    cells.push(`<div class="activity-cell${level > 0 ? ` level-${level}` : ''}" title="${dateStr}"></div>`);
  }

  return cells.join('');
}
