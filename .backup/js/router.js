// Hash-based SPA router
const routes = [];
let rootElement = null;
let currentComponent = null;

function parseHash(hash) {
  const path = hash.replace(/^#/, '') || '/';
  return path;
}

function matchRoute(path) {
  for (const route of routes) {
    const params = {};
    const routeParts = route.pattern.split('/');
    const pathParts = path.split('/');

    if (routeParts.length !== pathParts.length) continue;

    let match = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) return { handler: route.handler, params };
  }
  return null;
}

async function render() {
  const path = parseHash(window.location.hash);
  const matched = matchRoute(path);

  if (!matched) {
    rootElement.innerHTML = `
      <div class="empty-state page">
        <div class="empty-state-icon">&#x1F4DC;</div>
        <h2>Page Not Found</h2>
        <p>The scroll you seek does not exist.</p>
        <a href="#/" class="btn btn-primary" style="margin-top: var(--space-md); display: inline-block;">Return Home</a>
      </div>
    `;
    return;
  }

  const component = matched.handler;
  const params = matched.params;

  rootElement.innerHTML = await component.render(params);
  if (component.afterRender) {
    component.afterRender(params);
  }
  currentComponent = component;

  // Scroll to top on navigation
  window.scrollTo(0, 0);
}

export function addRoute(pattern, handler) {
  routes.push({ pattern, handler });
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function currentRoute() {
  const path = parseHash(window.location.hash);
  const matched = matchRoute(path);
  return matched ? { path, params: matched.params } : { path, params: {} };
}

export function init(element) {
  rootElement = element;
  window.addEventListener('hashchange', render);
  render();
}
