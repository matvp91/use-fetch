export type FetcherContext<K> = {
  key: K;
  signal: AbortSignal;
};

export type Fetcher<T, K> = (ctx: FetcherContext<K>) => Promise<T>;

export type Key = string | readonly [any, ...unknown[]] | Record<any, any>;

export interface RequestContext {
  abortController: AbortController;
}

export interface Options<T> {
  refetchInterval?: number;
  onError?(error: unknown): void;
  onSuccess?(data: T): void;
}
