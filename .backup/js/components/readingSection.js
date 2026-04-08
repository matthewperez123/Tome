export function renderReading(lesson) {
  const reading = lesson.reading;
  if (!reading) return '<div class="lesson-section" id="section-reading"><p>No reading passage available.</p></div>';

  const sentences = (reading.sentences || []).map((s, i) => {
    const words = (s.words || []).map((w, wi) =>
      `<span class="word" data-sentence="${i}" data-word="${wi}">${w.surface}</span>`
    ).join(' ');

    return `
      <div class="reading-sentence" data-sentence-index="${i}">
        <div class="sentence-text">${words}</div>
        <div class="sentence-translation hidden" data-sentence="${i}">
          ${s.translation}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="lesson-section" id="section-reading">
      <h2 style="margin-bottom: var(--space-md);">Reading</h2>
      <p class="reading-instructions">Click any word for its definition and grammatical info. Click the grey bar below each sentence to reveal the translation.</p>
      <div class="reading-passage">
        <div class="passage-title">${reading.title}</div>
        ${sentences}
      </div>
      <div id="word-tooltip" class="tooltip" style="display: none;"></div>
    </div>
  `;
}

export function bindReading(lesson) {
  const reading = lesson.reading;
  if (!reading) return;

  const tooltip = document.getElementById('word-tooltip');
  let activeWord = null;

  // Event delegation for word clicks
  document.querySelectorAll('.sentence-text').forEach(sentenceEl => {
    sentenceEl.addEventListener('click', (e) => {
      const wordEl = e.target.closest('.word');
      if (!wordEl) {
        hideTooltip();
        return;
      }

      const si = parseInt(wordEl.dataset.sentence);
      const wi = parseInt(wordEl.dataset.word);
      const sentence = reading.sentences[si];
      if (!sentence) return;
      const wordData = sentence.words[wi];
      if (!wordData) return;

      // Toggle if clicking same word
      if (activeWord === wordEl) {
        hideTooltip();
        return;
      }

      // Remove previous active
      if (activeWord) activeWord.classList.remove('active');
      activeWord = wordEl;
      wordEl.classList.add('active');

      // Position and show tooltip
      const rect = wordEl.getBoundingClientRect();
      const scrollTop = window.scrollY;

      tooltip.innerHTML = `
        <div class="tooltip-label">${wordData.partOfSpeech}</div>
        <div class="tooltip-word">${wordData.surface}</div>
        ${wordData.lemma !== wordData.surface ? `<div style="font-size: var(--text-sm); color: var(--color-gold-light); margin-bottom: 4px;">lemma: ${wordData.lemma}</div>` : ''}
        <div class="tooltip-morph">${wordData.morphology || ''}</div>
        <div style="font-weight: 600;">${wordData.definition}</div>
      `;

      tooltip.style.display = 'block';
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.bottom + scrollTop + 8}px`;

      // Keep tooltip in viewport
      const tooltipRect = tooltip.getBoundingClientRect();
      if (tooltipRect.right > window.innerWidth - 16) {
        tooltip.style.left = `${window.innerWidth - tooltipRect.width - 16}px`;
      }
      if (tooltipRect.left < 16) {
        tooltip.style.left = '16px';
      }
    });
  });

  // Translation toggle
  document.querySelectorAll('.sentence-translation').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('hidden');
    });
  });

  // Close tooltip on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.word') && !e.target.closest('.tooltip')) {
      hideTooltip();
    }
  });

  function hideTooltip() {
    tooltip.style.display = 'none';
    if (activeWord) {
      activeWord.classList.remove('active');
      activeWord = null;
    }
  }
}
