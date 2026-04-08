export function renderGrammar(lesson) {
  const blocks = (lesson.grammar || []).map(g => {
    const examples = (g.examples || []).map(ex => `
      <div class="grammar-example">
        <div class="original">${ex[lesson.languageId === 'greek' ? 'greek' : 'latin'] || ex.latin || ex.greek || ''}</div>
        <div class="translation">${ex.english}</div>
      </div>
    `).join('');

    return `
      <div class="grammar-block">
        <h3>${g.title}</h3>
        <div class="grammar-explanation">${g.explanation}</div>
        ${examples}
        ${g.tip ? `<div class="grammar-tip">${g.tip}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="lesson-section" id="section-grammar">
      <h2 style="margin-bottom: var(--space-md);">Grammar</h2>
      <p style="color: var(--color-ink-light); margin-bottom: var(--space-lg);">Key grammar concepts you'll encounter in this passage.</p>
      ${blocks}
    </div>
  `;
}

export function bindGrammar() {
  // Grammar section is mostly static, no special bindings needed
}
