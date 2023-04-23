export const randomArrayValue = <T>(array: Array<T>): T => {
  if (array.length === 0) {
    throw new Error("Cannot get a random value from an empty array");
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return array[Math.floor(Math.random() * array.length)]!;
};
