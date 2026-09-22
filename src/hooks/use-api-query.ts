import { useEffect, useState } from 'react';
import { kyInstance } from '@/providers/data';

export const useApiQuery = <T,>(path: string, options?: { enabled?: boolean; searchParams?: Record<string, string> }) => {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setIsLoading(true);
    kyInstance
      .get(path, options?.searchParams ? { searchParams: options.searchParams } : undefined)
      .json<{ data: T }>()
      .then((payload) => {
        if (!cancelled) setData(payload.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, enabled, JSON.stringify(options?.searchParams)]);

  return { data, isLoading, error };
};
