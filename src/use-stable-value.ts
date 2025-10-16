import { useRef } from "react";

export function useStableValue<T>(key: T) {
  const keyRef = useRef(key);
  if (JSON.stringify(key) !== JSON.stringify(keyRef.current)) {
    keyRef.current = key;
  }
  return keyRef.current;
}
