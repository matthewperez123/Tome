import * as api from '../api.js';
import * as store from '../store.js';
import { renderVocab, bindVocab } from './vocabSection.js';
import { renderGrammar, bindGrammar } from './grammarSection.js';
import { renderReading, bindReading } from './readingSection.js';
import { renderPractice, bindPractice } from './practiceSection.js';

const langNames = { latin: 'Latin', greek: 'Ancient Greek' };
const sections = ['vocabulary', 'grammar', 'reading', 'practice'];
let currentSection = 'vocabulary';
let currentLesson = null;

export default {
  async render(params) {
    const { lang, lessonId } = params;

    try {
      const lesson = await api.getLesson(lang, lessonId);
      currentLesson = lesson;

      // Mark as in progress
      store.markLessonInProgress(lang, lessonId, 'vocabulary');

      const vocabHtml = renderVocab(lesson);
      const grammarHtml = renderGrammar(lesson);
      const readingHtml = renderReading(lesson);
      const practiceHtml = renderPractice(lesson);

      return `
        <div class="page">
          <div class="lesson-header">
            <div class="breadcrumb">
              <a href="#/">Home</a> &rsaquo; <a href="#/lessons/${lang}">${langNames[lang]}</a> &rsaquo; ${lesson.title}
            </div>
            <h1>${lesson.title}</h1>
            <p class="lesson-source">${lesson.author} &mdash; ${lesson.workTitle}${lesson.workSection ? ', ' + lesson.workSection : ''}</p>
          </div>

          <div class="section-tabs">
            <button class="section-tab active" data-section="vocabulary">Vocabulary</button>
            <button class="section-tab" data-section="grammar">Grammar</button>
            <button class="section-tab" data-section="reading">Reading</button>
            <button class="section-tab" data-section="practice">Practice</button>
          </div>

          <div id="lesson-sections">
            ${vocabHtml}
            ${grammarHtml}
            ${readingHtml}
            ${practiceHtml}
          </div>
        </div>
      `;
    } catch (err) {
      return `
        <div class="page empty-state">
          <div class="empty-state-icon">&#x1F4DC;</div>
          <h2>Lesson Not Found</h2>
          <p>Could not load this lesson. Please try again.</p>
          <a href="#/lessons/${lang}" class="btn btn-primary" style="margin-top: var(--space-md); display: inline-block;">Back to Lessons</a>
        </div>
      `;
    }
  },

  afterRender(params) {
    if (!currentLesson) return;

    // Show first section
    currentSection = 'vocabulary';
    showSection('vocabulary');

    // Bind section tabs
    document.querySelectorAll('.section-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const section = tab.dataset.section;
        switchSection(section);
      });
    });

    // Bind sub-sections
    bindVocab(currentLesson);
    bindGrammar();
    bindReading(currentLesson);
    bindPractice(currentLesson);
  }
};

function switchSection(section) {
  currentSection = section;
  showSection(section);

  // Update tabs
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.section === section);
  });

  // Update store
  if (currentLesson) {
    store.updateLessonSection(currentLesson.languageId, currentLesson.id, section);
  }
}

function showSection(section) {
  document.querySelectorAll('.lesson-section').forEach(el => {
    el.classList.remove('active');
  });
  const target = document.getElementById(`section-${section}`);
  if (target) target.classList.add('active');
}
