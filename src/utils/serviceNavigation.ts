import type { MouseEvent } from 'react';
import { SERVICE_NAVIGATION_EVENT } from '../constants';

export function emitServiceNavigation(target: string | null | undefined) {
  if (typeof window === 'undefined' || !target) {
    return;
  }

  const targetId = target.replace(/^#/, '');

  window.dispatchEvent(
    new CustomEvent(SERVICE_NAVIGATION_EVENT, {
      detail: targetId,
    })
  );
}

export function handleServiceLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  targetHref: string | null | undefined
) {
  if (!targetHref || !targetHref.startsWith('#')) {
    return;
  }

  event.preventDefault();
  emitServiceNavigation(targetHref);
}
