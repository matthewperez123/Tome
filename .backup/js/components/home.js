import * as store from '../store.js';

export default {
  render() {
    const state = store.getState();
    const latinCompleted = state.languages.latin.lessonsCompleted.length;
    const greekCompleted = state.languages.greek.lessonsCompleted.length;

    return `
      <div class="page">
        <div class="home-hero">
          <h1>Learn the Classics</h1>
          <p class="subtitle">Master Latin and Ancient Greek by reading the great works that shaped civilization — from Homer to Virgil, Plato to Caesar.</p>
        </div>

        <div class="language-cards">
          <div class="card card-clickable language-card latin" data-lang="latin">
            <div class="lang-icon">&#x1F3DB;</div>
            <h3>Latin</h3>
            <p class="lang-native">Lingua Latina</p>
            <p class="lang-desc">The language of the Roman Empire, Western scholarship, law, and the Catholic Church.</p>
            <button class="btn btn-latin btn-lg">Begin Latin</button>
            ${latinCompleted > 0 ? `<p class="lang-progress">${latinCompleted} lesson${latinCompleted !== 1 ? 's' : ''} completed</p>` : ''}
          </div>

          <div class="card card-clickable language-card greek" data-lang="greek">
            <div class="lang-icon">&#x1F3FA;</div>
            <h3>Ancient Greek</h3>
            <p class="lang-native">\u1F19\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AE</p>
            <p class="lang-desc">The language of Homer, Plato, and Sophocles — the foundation of Western philosophy and literature.</p>
            <button class="btn btn-greek btn-lg">Begin Greek</button>
            ${greekCompleted > 0 ? `<p class="lang-progress">${greekCompleted} lesson${greekCompleted !== 1 ? 's' : ''} completed</p>` : ''}
          </div>
        </div>

        <div class="features">
          <h2>How Codex Works</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">&#x1F4D6;</div>
              <h4>Read Real Texts</h4>
              <p>Learn through authentic passages from the greatest works of antiquity, not textbook sentences.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">&#x1F50D;</div>
              <h4>Word-by-Word</h4>
              <p>Click any word for instant definitions, grammar info, and morphological analysis.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">&#x1F3AF;</div>
              <h4>Practice & Master</h4>
              <p>Reinforce learning with targeted exercises — matching, multiple choice, and fill-in-the-blank.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">&#x1F4CA;</div>
              <h4>Track Progress</h4>
              <p>Watch your vocabulary grow and your streak build as you journey through the classics.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {
    document.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.dataset.lang;
        window.location.hash = `#/lessons/${lang}`;
      });
    });
  }
};
