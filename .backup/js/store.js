// localStorage wrapper for user progress
const STORAGE_KEY = 'codex_progress';
const subscribers = [];

function getDefaultState() {
  return {
    version: 1,
    user: {
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    },
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null
    },
    languages: {
      latin: {
        lessonsCompleted: [],
        lessonsInProgress: {},
        vocabularyMastered: [],
        vocabularySeen: [],
        exerciseResults: {},
        totalXp: 0
      },
      greek: {
        lessonsCompleted: [],
        lessonsInProgress: {},
        vocabularyMastered: [],
        vocabularySeen: [],
        exerciseResults: {},
        totalXp: 0
      }
    }
  };
}

function _load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const state = JSON.parse(raw);
    // Ensure all expected keys exist (forward-compat)
    const defaults = getDefaultState();
    for (const lang of ['latin', 'greek']) {
      if (!state.languages[lang]) {
        state.languages[lang] = defaults.languages[lang];
      }
    }
    if (!state.streak) state.streak = defaults.streak;
    return state;
  } catch {
    return getDefaultState();
  }
}

function _save(state) {
  state.user.lastActiveAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  subscribers.forEach(cb => cb(state));
}

export function getState() {
  return _load();
}

export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const idx = subscribers.indexOf(callback);
    if (idx > -1) subscribers.splice(idx, 1);
  };
}

export function markLessonInProgress(lang, lessonId, section) {
  const state = _load();
  state.languages[lang].lessonsInProgress[lessonId] = {
    currentSection: section || 'vocabulary',
    startedAt: new Date().toISOString()
  };
  _save(state);
}

export function markLessonComplete(lang, lessonId) {
  const state = _load();
  if (!state.languages[lang].lessonsCompleted.includes(lessonId)) {
    state.languages[lang].lessonsCompleted.push(lessonId);
    state.languages[lang].totalXp += 100;
  }
  delete state.languages[lang].lessonsInProgress[lessonId];
  updateStreak(state);
  _save(state);
}

export function markVocabSeen(lang, vocabIds) {
  const state = _load();
  const seen = new Set(state.languages[lang].vocabularySeen);
  vocabIds.forEach(id => seen.add(id));
  state.languages[lang].vocabularySeen = [...seen];
  _save(state);
}

export function markVocabMastered(lang, vocabIds) {
  const state = _load();
  const mastered = new Set(state.languages[lang].vocabularyMastered);
  vocabIds.forEach(id => mastered.add(id));
  state.languages[lang].vocabularyMastered = [...mastered];
  state.languages[lang].totalXp += vocabIds.length * 10;
  _save(state);
}

export function recordExerciseResult(lang, lessonId, exerciseId, correct, attempts) {
  const state = _load();
  if (!state.languages[lang].exerciseResults[lessonId]) {
    state.languages[lang].exerciseResults[lessonId] = {};
  }
  state.languages[lang].exerciseResults[lessonId][exerciseId] = { correct, attempts };
  if (correct) {
    state.languages[lang].totalXp += Math.max(10, 30 - (attempts - 1) * 10);
  }
  _save(state);
}

export function updateLessonSection(lang, lessonId, section) {
  const state = _load();
  if (state.languages[lang].lessonsInProgress[lessonId]) {
    state.languages[lang].lessonsInProgress[lessonId].currentSection = section;
  }
  _save(state);
}

function updateStreak(state) {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = state.streak.lastActivityDate;

  if (lastDate === today) return; // Already counted today

  if (lastDate) {
    const last = new Date(lastDate);
    const now = new Date(today);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      state.streak.currentStreak += 1;
    } else if (diffDays > 1) {
      state.streak.currentStreak = 1;
    }
  } else {
    state.streak.currentStreak = 1;
  }

  state.streak.lastActivityDate = today;
  if (state.streak.currentStreak > state.streak.longestStreak) {
    state.streak.longestStreak = state.streak.currentStreak;
  }
}

export function getTotalStats() {
  const state = _load();
  let totalLessons = 0;
  let totalVocab = 0;
  let totalXp = 0;

  for (const lang of ['latin', 'greek']) {
    totalLessons += state.languages[lang].lessonsCompleted.length;
    totalVocab += state.languages[lang].vocabularyMastered.length;
    totalXp += state.languages[lang].totalXp;
  }

  return {
    totalLessons,
    totalVocab,
    totalXp,
    streak: state.streak.currentStreak,
    longestStreak: state.streak.longestStreak
  };
}
