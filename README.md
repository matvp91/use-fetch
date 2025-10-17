# useFetch

[![NPM Version](https://img.shields.io/npm/v/%40matvp91%2Fuse-fetch)](https://npmjs.org/package/@matvp91/use-fetch)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40matvp91%2Fuse-fetch)
![GitHub last commit](https://img.shields.io/github/last-commit/matvp91/use-fetch)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/matvp91/use-fetch/build.yaml)

A simple fetch hook for making API requests in React apps. Written in TS, with type inference done right.

Visit the [API reference](https://github.com/matvp91/use-fetch/wiki) for more info.

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