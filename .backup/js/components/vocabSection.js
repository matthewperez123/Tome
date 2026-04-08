import * as store from '../store.js';

export function renderVocab(lesson) {
  const vocab = lesson.vocabulary || [];
  const cards = vocab.map(v => `
    <div class="vocab-card" data-vocab-id="${v.id}">
      <div class="vocab-card-inner">
        <div class="vocab-front">
          <div class="vocab-word">${v.word}</div>
          <div class="vocab-pos">${v.partOfSpeech}${v.gender ? ' &middot; ' + v.gender : ''}${v.declension ? ' &middot; ' + v.declension : ''}</div>
          <div class="vocab-pronunciation">${v.pronunciation?.classical || ''}</div>
          <p style="font-size: var(--text-xs); color: var(--color-shadow); margin-top: var(--space-sm);">Click to reveal definition</p>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="lesson-section" id="section-vocabulary">
      <h2 style="margin-bottom: var(--space-md);">Vocabulary</h2>
      <p style="color: var(--color-ink-light); margin-bottom: var(--space-lg);">Learn these ${vocab.length} words before reading the passage. Click a card to reveal its definition.</p>
      <div class="vocab-grid">${cards}</div>
    </div>
  `;
}

export function bindVocab(lesson) {
  const lang = lesson.languageId;
  const vocabIds = lesson.vocabulary.map(v => v.id);
  store.markVocabSeen(lang, vocabIds);

  document.querySelectorAll('.vocab-card').forEach(card => {
    card.addEventListener('click', () => {
      const vocabId = card.dataset.vocabId;
      const v = lesson.vocabulary.find(item => item.id === vocabId);
      if (!v) return;

      // Toggle between showing word and definition
      if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        card.querySelector('.vocab-card-inner').innerHTML = `
          <div class="vocab-front">
            <div class="vocab-word">${v.word}</div>
            <div class="vocab-pos">${v.partOfSpeech}${v.gender ? ' &middot; ' + v.gender : ''}${v.declension ? ' &middot; ' + v.declension : ''}</div>
            <div class="vocab-pronunciation">${v.pronunciation?.classical || ''}</div>
            <p style="font-size: var(--text-xs); color: var(--color-shadow); margin-top: var(--space-sm);">Click to reveal definition</p>
          </div>
        `;
      } else {
        card.classList.add('flipped');
        card.querySelector('.vocab-card-inner').innerHTML = `
          <div>
            <div class="vocab-word">${v.word}</div>
            <div class="vocab-definition">${v.definition}</div>
            ${v.notes ? `<p style="font-size: var(--text-sm); color: var(--color-ink-light); margin-bottom: var(--space-sm);">${v.notes}</p>` : ''}
            <div class="vocab-example">${v.exampleSentence}</div>
            <div class="vocab-example-translation">${v.exampleTranslation}</div>
          </div>
        `;
        store.markVocabMastered(lang, [vocabId]);
      }
    });
  });
}
