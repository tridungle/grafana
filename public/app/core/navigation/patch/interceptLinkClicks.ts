import { locationUtil } from '@grafana/data';
import { locationService, navigationLogger } from '@grafana/runtime';

export function interceptLinkClicks(e: MouseEvent) {
  const anchor = getParentAnchor(e.target as HTMLElement);

  // Ignore if opening new tab
  if (e.ctrlKey || e.metaKey) {
    return;
  }

  if (anchor) {
    let href = anchor.getAttribute('href');
    const target = anchor.getAttribute('target');

    if (href && !target) {
      navigationLogger('utils', false, 'intercepting link click', e);
      e.preventDefault();

      href = locationUtil.stripBaseFromUrl(href);

      // Ensure old angular urls with no starting '/' are handled the same as before
      // That is they where seen as being absolute from app root
      if (href[0] !== '/') {
        href = `/${href}`;
      }

      locationService.push(href);
    }
  }
}

function getParentAnchor(element: HTMLElement | null): HTMLElement | null {
  while (element !== null && element.tagName) {
    if (element.tagName.toUpperCase() === 'A') {
      return element;
    }
    element = element.parentNode as HTMLElement;
  }

  return null;
}