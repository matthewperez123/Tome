import * as api from '../api.js';
import * as store from '../store.js';

const langNames = { latin: 'Latin', greek: 'Ancient Greek' };
const langIcons = { latin: '&#x1F3DB;', greek: '&#x1F3FA;' };

export default {
  async render(params) {
    const { lang } = params;
    const langName = langNames[lang] || lang;

    try {
      const manifest = await api.getManifest(lang);
      const state = store.getState();
      const langState = state.languages[lang] || { lessonsCompleted: [], lessonsInProgress: {} };

      const lessonCards = manifest.lessons.map((lesson, i) => {
        const isCompleted = langState.lessonsCompleted.includes(lesson.id);
        const isInProgress = !!langState.lessonsInProgress[lesson.id];

        return `
          <div class="card card-clickable lesson-card ${isCompleted ? 'completed' : ''}" data-lesson="${lesson.id}" data-lang="${lang}">
            <div class="lesson-number">${isCompleted ? '&#x2713;' : i + 1}</div>
            <div class="lesson-info">
              <h3>${lesson.title}</h3>
              <p style="font-family: var(--font-serif); font-style: italic; color: var(--color-ink-light); margin-bottom: var(--space-sm); font-size: var(--text-sm);">${lesson.subtitle}</p>
              <div class="lesson-meta">
                <span class="badge badge-${lesson.difficulty}">${lesson.difficulty}</span>
                <span>~${lesson.estimatedMinutes} min</span>
                ${isInProgress ? '<span style="color: var(--color-gold); font-weight: 600;">In Progress</span>' : ''}
                ${isCompleted ? '<span style="color: var(--color-success); font-weight: 600;">Completed</span>' : ''}
              </div>
            </div>
            <div class="lesson-arrow">&#x2192;</div>
          </div>
        `;
      }).join('');

      return `
        <div class="page">
          <div class="lesson-browser-header">
            <a href="#/" class="back-link">&#x2190; All Languages</a>
            <h1>${langIcons[lang]} ${langName}</h1>
            <p style="color: var(--color-ink-light); margin-top: var(--space-sm);">${manifest.description}</p>
          </div>
          <div class="lesson-list">
            ${lessonCards}
          </div>
        </div>
      `;
    } catch (err) {
      return `
        <div class="page empty-state">
          <div class="empty-state-icon">&#x1F4DC;</div>
          <h2>No Lessons Found</h2>
          <p>Could not load ${langName} lessons. Please try again.</p>
          <a href="#/" class="btn btn-primary" style="margin-top: var(--space-md); display: inline-block;">Return Home</a>
        </div>
      `;
    }
  },

  afterRender(params) {
    document.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.dataset.lang;
        const lessonId = card.dataset.lesson;
        window.location.hash = `#/lesson/${lang}/${lessonId}`;
      });
    });
  }
};
