import { useFetch } from "../../src";

export function App() {
  const data = useFetch();
  console.log(data);

  return <div>Playground</div>;
}
