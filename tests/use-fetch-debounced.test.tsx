import { act, render, screen } from "@testing-library/react";
import { beforeEach, test, vi } from "vitest";
import { useFetchDebounced } from "../src";
import { createResponse, sleep } from "./utils";

beforeEach(() => {
  vi.useRealTimers();
});

test("should debounce", async () => {
  function App({ count }: { count: number }) {
    const { data } = useFetchDebounced(
      ({ key }) => createResponse(`${key[0]}`),
      [count],
      {
        debounceDelay: 0.5,
      },
    );
    return `data: ${data}`;
  }

  const { rerender } = render(<App count={1} />);
  await act(() => sleep(100));

  rerender(<App count={2} />);
  await act(() => sleep(100));

  rerender(<App count={3} />);
  await act(() => sleep(1000));
  await screen.findByText("data: 3");
});
