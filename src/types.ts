export type FetcherContext<K extends Key = Key> = {
  key: K;
  signal: AbortSignal;
};

export type Fetcher<T, K extends Key> = (ctx: FetcherContext<K>) => Promise<T>;

export type Key = string | readonly [any, ...unknown[]] | Record<any, any>;

export interface RequestContext {
  abortController: AbortController;
  isAborted: boolean;
}

export interface Options<T> {
  initialData?: T;
  refetchInterval?: number;
  onError?(error: unknown): void;
  onSuccess?(data: T): void;
  onLoading?(): void;
}

export interface UseFetchReturn<T> {
  data: T;
  error: unknown;
  isLoading: boolean;
  refetch(): void;
}
