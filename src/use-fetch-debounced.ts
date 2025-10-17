import { useEffect, useState } from "react";
import type { Fetcher, Key, OptionsWithDebounce } from "./types";
import { useFetch } from "./use-fetch";
import { useStableValue } from "./use-stable-value";

/**
 * Debounced fetch data.
 * @param fetcher
 * @param key
 * @param {OptionsWithDebounce} options
 * @returns
 */
export function useFetchDebounced<T, K extends Key>(
  fetcher: Fetcher<T, K>,
  key: K,
  options: OptionsWithDebounce<T>,
) {
  const { debounceDelay, ...fetchOptions } = options;

  const stableKey = useStableValue(key);
  const [key_, setKey_] = useState(stableKey);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setKey_(stableKey);
    }, debounceDelay * 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [stableKey, debounceDelay]);

  return useFetch(fetcher, key_, fetchOptions);
}
