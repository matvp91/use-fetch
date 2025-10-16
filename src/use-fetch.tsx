import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Fetcher,
  Key,
  Options,
  RequestContext,
  UseFetchReturn,
} from "./types";
import { useStableValue } from "./use-stable-value";

/**
 * Fetch data, with initial data. This is particularly handy in an SSR situation,
 * where you can set the first value from elsewhere.
 * This'll also skip the first fetch with the assumption that the initialData matches
 * the provided key.
 * @param fetcher
 * @param key
 * @param options
 */
export function useFetch<T, K extends Key>(
  fetcher: Fetcher<T, K>,
  key: K,
  options: Options<T> & { initialData: T },
): UseFetchReturn<T>;
/**
 * Fetch data, with no initial data.
 * @param fetcher
 * @param key
 * @param options
 */
export function useFetch<T, K extends Key>(
  fetcher: Fetcher<T, K>,
  key: K,
  options?: Options<T>,
): UseFetchReturn<T | null>;
/**
 * Fetch data.
 * @param fetcher
 * @param key
 * @param options
 * @returns
 */
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

  // Skip the first render when we have initialData, this can happen when
  // we set the first value manually (eg; in an SSR situation).
  // BEWARE! This is under the assumption that the key matches the initialData.
  const skipFirstFetchRef = useRef(options.initialData !== undefined);

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
    if (skipFirstFetchRef.current) {
      skipFirstFetchRef.current = false;
      return;
    }
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
