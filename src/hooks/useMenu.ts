import { useCallback, useEffect, useRef, useState } from 'react';
import type { MenuResponse } from '../types/menu';
import { getMenu } from '../services/menuApi';

/**
 * Lightweight stale-while-revalidate hook (no react-query dependency —
 * keeps the bundle <100KB gzipped).
 *
 * - Renders bundled fallback instantly (first paint, offline-safe).
 * - Revalidates GET /api/v1/menu in background, swaps when fresh.
 * - Deduplicates concurrent mounts via module-level promise.
 */

let inflight: Promise<MenuResponse> | null = null;

interface State {
  data: MenuResponse | null;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
}

export function useMenu() {
  const [state, setState] = useState<State>({
    data: null,
    isLoading: true,
    isStale: false,
    error: null,
  });
  const mounted = useRef(true);

  const load = useCallback(async () => {
    if (!inflight) {
      inflight = getMenu().finally(() => {
        setTimeout(() => (inflight = null), 1000);
      });
    }
    try {
      const fresh = await inflight;
      if (!mounted.current) return;
      setState((prev) => ({
        data: fresh,
        // If we already had data, the update was a background revalidation.
        isLoading: false,
        isStale: prev.data !== null,
        error: null,
      }));
      // Mark non-stale after paint so "atualizado" badge can flash.
      setTimeout(() => {
        if (mounted.current) setState((p) => ({ ...p, isStale: false }));
      }, 1200);
    } catch (e) {
      if (mounted.current) {
        setState((p) => ({
          ...p,
          isLoading: false,
          error: e instanceof Error ? e.message : 'load error',
        }));
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void load();
    // Revalidate when tab regains focus (lunch menu changes daily).
    const onFocus = () => void load();
    window.addEventListener('focus', onFocus);
    return () => {
      mounted.current = false;
      window.removeEventListener('focus', onFocus);
    };
  }, [load]);

  return { ...state, retry: load };
}
