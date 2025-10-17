/**
 * Fetcher, an async function that resolves or rejects into data.
 */
export type Fetcher<T, K extends Key> = (ctx: FetcherContext<K>) => Promise<T>;

/**
 * Context given to each fetcher call.
 */
export type FetcherContext<K extends Key = Key> = {
  key: K;
  signal: AbortSignal;
};

/**
 * Key identifier.
 */
export type Key = string | readonly [any, ...unknown[]] | Record<any, any>;

/**
 * Options.
 */
export interface Options<T> {
  initialData?: T;
  fetchOnMount?: boolean;
  refetchInterval?: number;
  onError?(error: unknown): void;
  onSuccess?(data: T): void;
  onLoading?(): void;
}

/**
 * Options, with initial data defined.
 */
export type OptionsWithInitialData<T> = Options<T> & { initialData: T };

/**
 * Options, for debounce purposes.
 */
export type OptionsWithDebounce<T> = Options<T> & { debounceDelay: number };

/**
 * Return value for useFetch.
 */
export interface UseFetchReturn<T> {
  data: T;
  error: unknown;
  isLoading: boolean;
  refetch(): void;
}
