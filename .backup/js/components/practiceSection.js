import * as store from '../store.js';

let currentExerciseIndex = 0;
let exercises = [];
let lessonData = null;
let answered = false;
let attempts = 0;
let matchingState = { leftSelected: null, matched: [] };

export function renderPractice(lesson) {
  lessonData = lesson;
  exercises = lesson.exercises || [];
  currentExerciseIndex = 0;
  answered = false;
  attempts = 0;

  return `
    <div class="lesson-section" id="section-practice">
      <h2 style="margin-bottom: var(--space-md);">Practice</h2>
      <p style="color: var(--color-ink-light); margin-bottom: var(--space-lg);">Test your knowledge with these exercises.</p>
      <div class="exercise-container">
        <div class="exercise-progress">
          <div class="progress-bar"><div class="progress-bar-fill" id="exercise-progress-fill" style="width: 0%"></div></div>
          <span class="progress-text" id="exercise-progress-text">1 / ${exercises.length}</span>
        </div>
        <div id="exercise-content"></div>
      </div>
    </div>
  `;
}

export function bindPractice(lesson) {
  lessonData = lesson;
  exercises = lesson.exercises || [];
  if (exercises.length > 0) {
    renderExercise();
  }
}

function renderExercise() {
  if (currentExerciseIndex >= exercises.length) {
    renderComplete();
    return;
  }

  answered = false;
  attempts = 0;
  const ex = exercises[currentExerciseIndex];
  const container = document.getElementById('exercise-content');
  if (!container) return;

  // Update progress
  const fill = document.getElementById('exercise-progress-fill');
  const text = document.getElementById('exercise-progress-text');
  if (fill) fill.style.width = `${(currentExerciseIndex / exercises.length) * 100}%`;
  if (text) text.textContent = `${currentExerciseIndex + 1} / ${exercises.length}`;

  switch (ex.type) {
    case 'multiple-choice':
      renderMultipleChoice(container, ex);
      break;
    case 'matching':
      renderMatching(container, ex);
      break;
    case 'fill-in-the-blank':
      renderFillBlank(container, ex);
      break;
    default:
      container.innerHTML = '<p>Unknown exercise type.</p>';
  }
}

function renderMultipleChoice(container, ex) {
  const options = ex.options.map((opt, i) => `
    <div class="mc-option" data-index="${i}">
      <div class="option-marker">${String.fromCharCode(65 + i)}</div>
      <span>${opt}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="exercise-card">
      <div class="exercise-type">Multiple Choice</div>
      <div class="exercise-prompt">${ex.prompt}</div>
      <div class="mc-options">${options}</div>
      <div class="exercise-feedback" id="exercise-feedback"></div>
      <div class="exercise-actions">
        <button class="btn btn-primary" id="exercise-next" style="display: none;">Next &#x2192;</button>
      </div>
    </div>
  `;

  container.querySelectorAll('.mc-option').forEach(opt => {
    opt.addEventListener('click', () => {
      if (answered) return;
      attempts++;

      const idx = parseInt(opt.dataset.index);
      const correct = idx === ex.correctIndex;

      // Clear previous selections
      container.querySelectorAll('.mc-option').forEach(o => o.classList.remove('selected', 'incorrect'));
      opt.classList.add('selected');

      if (correct) {
        answered = true;
        opt.classList.add('correct');
        showFeedback(true, ex.explanation);
        store.recordExerciseResult(lessonData.languageId, lessonData.id, ex.id, true, attempts);
        document.getElementById('exercise-next').style.display = 'inline-flex';
      } else {
        opt.classList.add('incorrect');
        showFeedback(false, 'Try again!');
      }
    });
  });

  document.getElementById('exercise-next').addEventListener('click', nextExercise);
}

function renderMatching(container, ex) {
  matchingState = { leftSelected: null, matched: [] };
  const shuffledRight = [...ex.pairs].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="exercise-card">
      <div class="exercise-type">Matching</div>
      <div class="exercise-prompt">${ex.prompt}</div>
      <div class="matching-container">
        <div class="matching-column" id="matching-left">
          ${ex.pairs.map((p, i) => `<div class="matching-item left" data-index="${i}" data-value="${p.left}">${p.left}</div>`).join('')}
        </div>
        <div class="matching-column" id="matching-right">
          ${shuffledRight.map((p, i) => `<div class="matching-item right" data-index="${i}" data-value="${p.right}">${p.right}</div>`).join('')}
        </div>
      </div>
      <div class="exercise-feedback" id="exercise-feedback"></div>
      <div class="exercise-actions">
        <button class="btn btn-primary" id="exercise-next" style="display: none;">Next &#x2192;</button>
      </div>
    </div>
  `;

  const leftItems = container.querySelectorAll('.matching-item.left');
  const rightItems = container.querySelectorAll('.matching-item.right');

  leftItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('matched')) return;
      leftItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      matchingState.leftSelected = item.dataset.value;
    });
  });

  rightItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('matched') || !matchingState.leftSelected) return;

      const leftValue = matchingState.leftSelected;
      const rightValue = item.dataset.value;
      const pair = ex.pairs.find(p => p.left === leftValue);

      if (pair && pair.right === rightValue) {
        // Correct match
        item.classList.add('matched');
        const leftEl = container.querySelector(`.matching-item.left[data-value="${leftValue}"]`);
        if (leftEl) {
          leftEl.classList.add('matched');
          leftEl.classList.remove('selected');
        }
        matchingState.matched.push(leftValue);
        matchingState.leftSelected = null;

        if (matchingState.matched.length === ex.pairs.length) {
          answered = true;
          showFeedback(true, 'All pairs matched correctly!');
          store.recordExerciseResult(lessonData.languageId, lessonData.id, ex.id, true, 1);
          document.getElementById('exercise-next').style.display = 'inline-flex';
        }
      } else {
        // Incorrect
        item.classList.add('incorrect');
        setTimeout(() => item.classList.remove('incorrect'), 600);
      }
    });
  });

  const nextBtn = document.getElementById('exercise-next');
  if (nextBtn) nextBtn.addEventListener('click', nextExercise);
}

function renderFillBlank(container, ex) {
  const parts = ex.prompt.split('____');

  container.innerHTML = `
    <div class="exercise-card">
      <div class="exercise-type">Fill in the Blank</div>
      <div class="fill-blank-sentence">
        ${parts[0]}<input type="text" class="fill-blank-input" id="fill-input" autocomplete="off" autocapitalize="none" spellcheck="false">${parts[1] || ''}
      </div>
      ${ex.hint ? `<div class="exercise-hint">Hint: ${ex.hint}</div>` : ''}
      <div style="margin-top: var(--space-lg);">
        <button class="btn btn-primary" id="fill-check">Check Answer</button>
      </div>
      <div class="exercise-feedback" id="exercise-feedback"></div>
      <div class="exercise-actions">
        <button class="btn btn-primary" id="exercise-next" style="display: none;">Next &#x2192;</button>
      </div>
    </div>
  `;

  const input = document.getElementById('fill-input');
  const checkBtn = document.getElementById('fill-check');

  function checkAnswer() {
    if (answered) return;
    attempts++;

    const userAnswer = input.value.trim().toLowerCase();
    const acceptable = (ex.acceptableAnswers || [ex.answer]).map(a => a.toLowerCase());
    const correct = acceptable.includes(userAnswer);

    if (correct) {
      answered = true;
      input.classList.add('correct');
      input.disabled = true;
      checkBtn.style.display = 'none';
      showFeedback(true, ex.explanation || 'Correct!');
      store.recordExerciseResult(lessonData.languageId, lessonData.id, ex.id, true, attempts);
      document.getElementById('exercise-next').style.display = 'inline-flex';
    } else {
      input.classList.add('incorrect');
      showFeedback(false, `Not quite. Try again!`);
      setTimeout(() => input.classList.remove('incorrect'), 600);
    }
  }

  checkBtn.addEventListener('click', checkAnswer);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });

  const nextBtn = document.getElementById('exercise-next');
  if (nextBtn) nextBtn.addEventListener('click', nextExercise);
}

function showFeedback(correct, message) {
  const fb = document.getElementById('exercise-feedback');
  if (!fb) return;
  fb.className = `exercise-feedback show ${correct ? 'correct' : 'incorrect'}`;
  fb.innerHTML = `${correct ? '&#x2713;' : '&#x2717;'} ${message}`;
}

function nextExercise() {
  currentExerciseIndex++;
  renderExercise();
}

function renderComplete() {
  const container = document.getElementById('exercise-content');
  if (!container) return;

  const fill = document.getElementById('exercise-progress-fill');
  if (fill) fill.style.width = '100%';
  const text = document.getElementById('exercise-progress-text');
  if (text) text.textContent = 'Complete!';

  // Mark lesson complete
  store.markLessonComplete(lessonData.languageId, lessonData.id);

  container.innerHTML = `
    <div class="exercise-card" style="text-align: center; padding: var(--space-2xl);">
      <div style="font-size: 3rem; margin-bottom: var(--space-md);">&#x1F389;</div>
      <h2>Lesson Complete!</h2>
      <p style="color: var(--color-ink-light); margin: var(--space-md) 0;">You've finished all exercises for this lesson. Great work!</p>
      <div style="display: flex; gap: var(--space-md); justify-content: center; margin-top: var(--space-lg);">
        <a href="#/lessons/${lessonData.languageId}" class="btn btn-secondary">Back to Lessons</a>
        <a href="#/dashboard" class="btn btn-primary">View Progress</a>
      </div>
    </div>
  `;
}
