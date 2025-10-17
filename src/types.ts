/**
 * Fetcher, an async function that resolves or rejects into data.
 */
export type Fetcher<T, K extends Key> = (ctx: FetcherContext<K>) => Promise<T>;

/**
 * Context given to each fetcher call.
 */
export type FetcherContext<K extends Key = Key> = {
  /**
   * The currently active key.
   */
  key: K;
  /**
   * You can use the signal to implement abort logic in your fetcher.
   * A pending fetcher call will be aborted when new data is about to be fetched.
   */
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
  /**
   * Initial data. When provided, the data will no longer be nullable and will
   * use this value instead. This is especially useful when passing data from the
   * server to the client (eg; with RSC or SSR) to prepopulate the hook.
   */
  initialData?: T;
  /**
   * When initialData is defined, the first render is skipped since the data is
   * already available. If you prefer not to skip the initial render, enable this option.
   * When initialData is undefined, this setting has no effect.
   */
  fetchOnMount?: boolean;
  /**
   * Refetches the data periodically, using the given interval in seconds.
   */
  refetchInterval?: number;
  /**
   * Callback when an error occurs.
   * @param error
   */
  onError?(error: unknown): void;
  /**
   * Callback triggered when the fetcher completes successfully.
   * @param data
   */
  onSuccess?(data: T): void;
  /**
   * Called when the fetcher starts loading data.
   */
  onLoading?(): void;
}

/**
 * Options, with initial data defined.
 */
export type OptionsWithInitialData<T> = Options<T> & {
  /**
   * Mandatory initial data.
   */
  initialData: T;
};

/**
 * Options, for debounce purposes.
 */
export type OptionsWithDebounce<T> = Options<T> & {
  /**
   * The debounce delay, in seconds.
   */
  debounceDelay: number;
};

/**
 * Return value for useFetch.
 */
export interface UseFetchReturn<T> {
  /**
   * The last result of the fetcher.
   */
  data: T;
  /**
   * An error occured, will be cleared when the fetcher
   * runs a second time.
   */
  error: unknown;
  /**
   * Whether the fetcher is executing.
   */
  isLoading: boolean;
  /**
   * In case you'd like to manually refetch the data.
   */
  refetch(): void;
}
