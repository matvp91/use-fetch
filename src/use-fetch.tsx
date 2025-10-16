import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Fetcher,
  Key,
  Options,
  RequestContext,
  UseFetchReturn,
} from "./types";
import { useStableValue } from "./use-stable-value";

export function useFetch<T, K extends Key>(
  fetcher: Fetcher<T, K>,
  key: K,
  options: Options<T> & { initialData: T },
): UseFetchReturn<T>;
export function useFetch<T, K extends Key>(
  fetcher: Fetcher<T, K>,
  key: K,
  options?: Options<T>,
): UseFetchReturn<T | null>;
export function useFetch<T, K extends Key>(
  fetcher: Fetcher<T, K>,
  key: K,
  options: Options<T> = {},
): UseFetchReturn<T | null> {
  const fetcherRef = useRef(fetcher);
  // On each render, we're going to update the fetcher, this'll allow us to
  // call it anywhere without adding it to a dependency list.
  fetcherRef.current = fetcher;

  const stableEventsRef = useRef({
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  const stableKey = useStableValue(key);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const ctxRef = useRef<RequestContext>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState(() => {
    return options.initialData ?? null;
  });

  const fetchData = useCallback(
    async (key: K) => {
      // We might be on an active timer, clear it as we're explicitly
      // fetching new data.
      clearTimeout(timerRef.current);

      // Abort a pending request.
      ctxRef.current?.abortController.abort();

      const ctx: RequestContext = {
        abortController: new AbortController(),
      };
      ctxRef.current = ctx;

      // Reset state.
      setIsLoading(true);
      setError(null);

      const events = stableEventsRef.current;

      try {
        const data = await fetcherRef.current({
          key,
          signal: ctx.abortController.signal,
        });
        if (ctx !== ctxRef.current) {
          // Sanity check, our context changed mid fetch. This can happen when the
          // fetcher does not contain abort logic.
          return;
        }
        setData(data ?? null);
        events.onSuccess?.(data);
      } catch (error) {
        if (ctx.abortController.signal.aborted) {
          // An abort error is expected, we shall not set it as error.
          return;
        }
        setError(error);
        events.onError?.(error);
      } finally {
        setIsLoading(false);
      }

      if (options.refetchInterval) {
        timerRef.current = setTimeout(() => {
          // When we have a refetchInterval, we can fetch the data again.
          fetchData(key);
        }, options.refetchInterval * 1000);
      }
    },
    [options.refetchInterval],
  );

  // fetchData has a different reference for a new key.
  // We can refetch here.
  useEffect(() => {
    fetchData(stableKey);
  }, [stableKey, fetchData]);

  useEffect(() => {
    // Cleanup of side effects.
    return () => {
      clearTimeout(timerRef.current);
      // Abort a pending request.
      ctxRef.current?.abortController.abort();
    };
  }, []);

  return { data, error, isLoading };
}
