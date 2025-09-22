import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SERVICE_NAVIGATION_EVENT } from '../constants';

export function useServiceAccordionNavigation(serviceIds: string[]) {
  const idToIndex = useMemo(() => {
    const mapping: Record<string, number> = {};
    serviceIds.forEach((id, index) => {
      mapping[id] = index;
    });
    return mapping;
  }, [serviceIds]);

  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const pendingScrollIdRef = useRef<string | null>(null);

  const scrollToService = useCallback((id: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      window.requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  const openServiceById = useCallback(
    (targetId: string) => {
      if (!targetId || !(targetId in idToIndex)) {
        return;
      }

      const index = idToIndex[targetId];
      pendingScrollIdRef.current = targetId;
      setExpandedIndices([index]);
    },
    [idToIndex]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      openServiceById(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [openServiceById]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleNavigation: EventListener = (event) => {
      const detail = (event as CustomEvent<string>).detail;
      const targetId = typeof detail === 'string' ? detail : '';
      if (!targetId) {
        return;
      }

      openServiceById(targetId);

      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== targetId) {
        window.history?.pushState?.(null, '', `#${targetId}`);
      }
    };

    window.addEventListener(SERVICE_NAVIGATION_EVENT, handleNavigation);
    return () => window.removeEventListener(SERVICE_NAVIGATION_EVENT, handleNavigation);
  }, [openServiceById]);

  useEffect(() => {
    if (!pendingScrollIdRef.current) {
      return;
    }

    const targetId = pendingScrollIdRef.current;
    pendingScrollIdRef.current = null;
    scrollToService(targetId);
  }, [expandedIndices, scrollToService]);

  const handleAccordionChange = useCallback((value: number | number[]) => {
    if (Array.isArray(value)) {
      setExpandedIndices(value);
    } else if (typeof value === 'number') {
      setExpandedIndices([value]);
    } else {
      setExpandedIndices([]);
    }
  }, []);

  return {
    expandedIndices,
    handleAccordionChange,
  };
}
