import { addRoute, init } from './router.js';
import header from './components/header.js';
import footer from './components/footer.js';
import home from './components/home.js';
import lessonBrowser from './components/lessonBrowser.js';
import lessonView from './components/lessonView.js';
import dashboard from './components/dashboard.js';

// Register routes
addRoute('/', home);
addRoute('/lessons/:lang', lessonBrowser);
addRoute('/lesson/:lang/:lessonId', lessonView);
addRoute('/dashboard', dashboard);

// Render header and footer
document.getElementById('app-header').innerHTML = header.render();
document.getElementById('app-footer').innerHTML = footer.render();

// Update header active states on navigation
window.addEventListener('hashchange', () => {
  document.getElementById('app-header').innerHTML = header.render();
});

// Initialize router
init(document.getElementById('app-root'));
