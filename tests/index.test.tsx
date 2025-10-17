import { act, render, screen } from "@testing-library/react";
import { test } from "vitest";
import { useFetch } from "../src";
import { createResponse, sleep } from "./utils";

test("should resolve fetcher", async () => {
  function App() {
    const { data } = useFetch(() => createResponse("I am a response"), []);
    return `data: ${data}`;
  }

  render(<App />);

  await screen.findByText("data: null");
  await act(() => sleep(100));
  await screen.findByText("data: I am a response");
});

test("should reject fetcher", async () => {
  function App() {
    const { error } = useFetch(
      () => createResponse(new Error("Failed to fetch")),
      [],
    );
    const message = error
      ? error instanceof Error
        ? error.message
        : "Unknown"
      : null;
    return `error: ${message}`;
  }

  render(<App />);

  await screen.findByText("error: null");
  await act(() => sleep(100));
  await screen.findByText("error: Failed to fetch");
});

test("should be loading when fetcher is busy", async () => {
  function App() {
    const { isLoading } = useFetch(() => createResponse(""), []);
    return `isLoading: ${isLoading ? "yes" : "no"}`;
  }

  render(<App />);

  await screen.findByText("isLoading: yes");
  await act(() => sleep(100));
  await screen.findByText("isLoading: no");
});
