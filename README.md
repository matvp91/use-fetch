# useFetch

[![NPM Version](https://img.shields.io/npm/v/%40matvp91%2Fuse-fetch)](https://npmjs.org/package/@matvp91/use-fetch)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40matvp91%2Fuse-fetch)
![GitHub last commit](https://img.shields.io/github/last-commit/matvp91/use-fetch)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/matvp91/use-fetch/build.yaml)

A simple fetch hook for making API requests in React apps. Written in TS, with type inference done right.

Why not just use something like swr, you ask?

- No stale-while-revalidate principle.
- Fully component-scoped; no shared context.
- Muc smaller bundle size (265 kB vs. roughly 6 kB)
- Provides finer-grained control over what and when to fetch.
- Debounce functionality out of the box.

Visit the [API reference](https://github.com/matvp91/use-fetch/wiki/API) for more info.

## Installation

```sh
npm install @matvp91/use-fetch
```

## Usage

### Fetch data remotely

At its simplest, you supply an asynchronous fetcher function as the first argument, and whenever the key (the second argument) changes, the fetcher automatically runs to retrieve the updated data.

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

With SSR or RSC, your notes might already be available on the server. This example shows how to supply that initial server data and enable the client to continue paginating from it.

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

You can configure the hook to rerun the fetcher at regular intervals, which is useful for polling.
 
```ts
const result = useFetch(async () => {
  return await api.fetchLatestNews();
}, [], {
  // In seconds.
  refetchInterval: 5
});
```

### Debounce

You can debounce the fetcher call - for instance, when a rapidly changing value is driven by an input field. The `useFetchDebounced` hook variant makes this easy.

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

### Abort pending fetches

Each time the fetcher is invoked, it receives a signal that can be used to cancel the ongoing operation. If this logic is not implemented, the result will simply be discarded internally once the fetch either completes or fails.

```ts
function Component() {
  const result = useFetch(async ({ signal }) => {
    const response = await fetch(`https://example.com/notes/${id}`, {
      // Pass the signal to the fetch call.
      signal,
    });
  }, [id]);

  // When the id changes, and a fetch call is still pending, it'll be aborted.
}
```
