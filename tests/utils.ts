export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function createResponse<T>(response: T): Promise<T> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (response instanceof Error) {
        reject(response);
      } else {
        resolve(response);
      }
    }, 10),
  );
}
