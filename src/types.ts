export type FetcherContext<K> = {
  key: K;
  signal: AbortSignal;
};

export type Fetcher<T, K> = (ctx: FetcherContext<K>) => Promise<T>;

type ArgumentsTuple = readonly [IntendedAny, ...unknown[]];

export type Key = string | ArgumentsTuple | Record<IntendedAny, IntendedAny>;

export interface RequestContext {
  abortController: AbortController;
}

// biome-ignore lint/suspicious/noExplicitAny: Intended
export type IntendedAny = any;
