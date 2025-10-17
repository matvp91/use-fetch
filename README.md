# useFetch

[![NPM Version](https://img.shields.io/npm/v/%40matvp91%2Fuse-fetch)](https://npmjs.org/package/@matvp91/use-fetch)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40matvp91%2Fuse-fetch)
![GitHub last commit](https://img.shields.io/github/last-commit/matvp91/use-fetch)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/matvp91/use-fetch/build.yaml)

A simple fetch hook for making API requests in React apps. Written in TS, with type inference done right.

## Installation

```sh
npm install @matvp91/use-fetch
```

## Usage

Fetch data from the client.

```ts
import { useFetch } from "@matvp91/use-fetch";

function Component({ id }) {
  const result = useFetch(async () => {
    // Assume we have an api client.
    // - On success, it'll provide us with a user of type User
    // - It can throw an error.
    return await api.fetchUser(id);
  }, [id]);

  const {
    // Of type User, or null
    data,
    // Whatever error is thrown by the api client
    error,
    isLoading,
  } = result;
}
```

### Initial data

You can provide `initialData` to ensure that `result.data` is never null. The initialData must match the type returned by the fetcher to maintain type safety.

```ts
const result = useFetch(async () => {
  // Assume we return a list of Note types
  return await api.fetchNotes();
}, [], {
  initialData: [],
});

const {
  // Data is always of type Note[], it is no longer null.
  data,
} = result;
```

#### RSC example

When using SSR / RSC, your notes may already be available on the server. This example demonstrates how to provide that initial server data and allow the client to continue paginating from it.

```ts
async function App() {
  const notes = await api.getNotes({
    page: 1,
  });

  return <Notes notes={notes} initialPage={1} />;
}

// And the client component:

"use client";

function Notes({ notes, initialPage }: { notes: Note[], initialPage: number ) {
  const [page, setPage] = useState(initialPage);
  
  const result = useFetch(async () => {
    return await api.fetchNotes({
      page,
    });
  }, [page], {
    // Pass our notes from the server as initialData. 
    initialData: notes,
  });

  // result.data will always be of type Note[]
  return <ListOfNotes notes={result.data} />;
}
```

### Refetch on an interval

Great for polling purposes.

```ts
const result = useFetch(async () => {
  return await api.fetchLatestNews();
}, [], {
  // In seconds.
  refetchInterval: 5
});
```

### Debounce

```ts
import { useFetchDebounced } from "@matvp91/use-fetch";

function Component() {
  const [text, setText] = useState("");

  const result = useFetchDebounced(async () => {
    return await api.fetchSearchResults({
      text,
    });
  }, [text], {
    // In seconds.
    debounceDelay: 3,
  });

  // You can call setText as many times as you like, it'll debounce until
  // the amount of seconds are elapsed.
}
```

## Interfaces

### Options

Defined in: [types.ts:15](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L15)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="fetchonmount"></a> `fetchOnMount?` | `boolean` | [types.ts:17](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L17) |
| <a id="initialdata"></a> `initialData?` | `T` | [types.ts:16](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L16) |
| <a id="refetchinterval"></a> `refetchInterval?` | `number` | [types.ts:18](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L18) |

#### Methods

##### onError()?

> `optional` **onError**(`error`): `void`

Defined in: [types.ts:19](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`void`

##### onLoading()?

> `optional` **onLoading**(): `void`

Defined in: [types.ts:21](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L21)

###### Returns

`void`

##### onSuccess()?

> `optional` **onSuccess**(`data`): `void`

Defined in: [types.ts:20](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `T` |

###### Returns

`void`

***

### RequestContext

Defined in: [types.ts:10](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L10)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="abortcontroller"></a> `abortController` | `AbortController` | [types.ts:11](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L11) |
| <a id="isaborted"></a> `isAborted` | `boolean` | [types.ts:12](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L12) |

***

### UseFetchReturn

Defined in: [types.ts:24](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L24)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="data"></a> `data` | `T` | [types.ts:25](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L25) |
| <a id="error"></a> `error` | `unknown` | [types.ts:26](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L26) |
| <a id="isloading"></a> `isLoading` | `boolean` | [types.ts:27](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L27) |

#### Methods

##### refetch()

> **refetch**(): `void`

Defined in: [types.ts:28](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L28)

###### Returns

`void`

## Type Aliases

### Fetcher()

> **Fetcher**\<`T`, `K`\> = (`ctx`) => `Promise`\<`T`\>

Defined in: [types.ts:6](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L6)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `K` *extends* [`Key`](#key-1) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`FetcherContext`](#fetchercontext)\<`K`\> |

#### Returns

`Promise`\<`T`\>

***

### FetcherContext

> **FetcherContext**\<`K`\> = `object`

Defined in: [types.ts:1](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L1)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `K` *extends* [`Key`](#key-1) | [`Key`](#key-1) |

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="key"></a> `key` | `K` | [types.ts:2](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L2) |
| <a id="signal"></a> `signal` | `AbortSignal` | [types.ts:3](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L3) |

***

### Key

> **Key** = `string` \| readonly \[`any`, `...unknown[]`\] \| `Record`\<`any`, `any`\>

Defined in: [types.ts:8](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/types.ts#L8)

## Functions

### useFetch()

Fetch data.

#### Param

#### Param

#### Param

#### Call Signature

> **useFetch**\<`T`, `K`\>(`fetcher`, `key`, `options`): [`UseFetchReturn`](#usefetchreturn)\<`T`\>

Defined in: [use-fetch.tsx:20](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/use-fetch.tsx#L20)

Fetch data, with initial data. This is particularly handy in an SSR situation,
where you can set the first value from elsewhere.
This'll also skip the first fetch with the assumption that the initialData matches
the provided key.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `K` *extends* [`Key`](#key-1) |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetcher` | [`Fetcher`](#fetcher)\<`T`, `K`\> |  |
| `key` | `K` |  |
| `options` | [`Options`](#options)\<`T`\> & `object` |  |

##### Returns

[`UseFetchReturn`](#usefetchreturn)\<`T`\>

#### Call Signature

> **useFetch**\<`T`, `K`\>(`fetcher`, `key`, `options?`): [`UseFetchReturn`](#usefetchreturn)\<`T` \| `null`\>

Defined in: [use-fetch.tsx:31](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/use-fetch.tsx#L31)

Fetch data, with no initial data.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `K` *extends* [`Key`](#key-1) |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetcher` | [`Fetcher`](#fetcher)\<`T`, `K`\> |  |
| `key` | `K` |  |
| `options?` | [`Options`](#options)\<`T`\> |  |

##### Returns

[`UseFetchReturn`](#usefetchreturn)\<`T` \| `null`\>

***

### useFetchDebounced()

> **useFetchDebounced**\<`T`, `K`\>(`fetcher`, `key`, `options`): [`UseFetchReturn`](#usefetchreturn)\<`T` \| `null`\>

Defined in: [use-fetch-debounced.ts:13](https://github.com/matvp91/use-fetch/blob/b78da1a9a98f4e9914c4e6a802321d56c486f39a/src/use-fetch-debounced.ts#L13)

Debounced fetch data.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `K` *extends* [`Key`](#key-1) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetcher` | [`Fetcher`](#fetcher)\<`T`, `K`\> |  |
| `key` | `K` |  |
| `options` | [`Options`](#options)\<`T`\> & `object` |  |

#### Returns

[`UseFetchReturn`](#usefetchreturn)\<`T` \| `null`\>
