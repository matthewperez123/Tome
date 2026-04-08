import { currentRoute } from '../router.js';

function isActive(path) {
  const route = currentRoute();
  if (path === '/' && (route.path === '/' || route.path === '')) return 'active';
  if (path !== '/' && route.path.startsWith(path)) return 'active';
  return '';
}

export default {
  render() {
    return `
      <div class="header-inner">
        <a href="#/" class="header-logo">
          <span class="logo-icon">&#x1F4DC;</span>
          <span>Codex</span>
        </a>
        <nav class="header-nav">
          <a href="#/" class="${isActive('/')}">Home</a>
          <a href="#/lessons/latin" class="${isActive('/lessons')}">Lessons</a>
          <a href="#/dashboard" class="${isActive('/dashboard')}">Dashboard</a>
        </nav>
      </div>
    `;
  }
};
