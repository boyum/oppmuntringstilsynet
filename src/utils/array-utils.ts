export const randomArrayValue = <T>(array: Array<T>): T => {
  if (array.length === 0) {
    throw new Error("Cannot get a random value from an empty array");
  }

  // biome-ignore lint/style/noNonNullAssertion: We've checked above that the array is not empty, so this is safe.
  return array[Math.floor(Math.random() * array.length)]!;
};
