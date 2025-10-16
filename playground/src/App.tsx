import { useState } from "react";
import { useFetch } from "../../src";

interface User {
  id: string;
}

export function App() {
  const [page, setPage] = useState(1);
  const [foo, setFoo] = useState(0);

  const { data, error, isLoading } = useFetch(
    async ({ signal }) => {
      let url = `https://677bbba020824100c07a9cc2.mockapi.io/users?page=${page}&limit=3`;
      if (page > 5) {
        // Add an unknown param so we can error the mock api.
        url += "&unknownParam=1";
      }
      const response = await fetch(url, {
        signal,
      });
      if (!response.ok) {
        throw new Error("This is an error");
      }
      return (await response.json()) as User[];
    },
    [page],
    {
      // refetchInterval: 3,
      onError: (error) => console.error(error),
      onSuccess: (data) => console.log(data),
      // initialData: [],
    },
  );

  return (
    <div>
      <div>
        foo:{" "}
        <button type="button" onClick={() => setFoo((v) => v + 1)}>
          {foo}
        </button>
      </div>
      <div>
        page {page}{" "}
        <button type="button" onClick={() => setPage((v) => v + 1)}>
          +
        </button>
        <button type="button" onClick={() => setPage((v) => v - 1)}>
          -
        </button>
      </div>
      <div>isLoading: {isLoading ? "yes" : "no"}</div>
      <div>
        Data: <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      {error ? (
        <div>Error: {error instanceof Error ? error.message : "Unknown"}</div>
      ) : null}
    </div>
  );
}
