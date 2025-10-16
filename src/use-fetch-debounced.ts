import { useEffect, useState } from "react";
import type { Fetcher, Key, Options } from "./types";
import { useStableValue } from "./use-stable-value";
import { useFetch } from "./use-fetch";

export function useFetchDebounced<T, K extends Key>(
  fetcher: Fetcher<T, K>,
  key: K,
  options: Options<T> & {
    debounceDelay: number;
  } = {
    debounceDelay: 1,
  },
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
