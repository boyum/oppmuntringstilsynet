export const randomArrayValue = <T>(array: Array<T>): T => {
  if (array.length === 0) {
    throw new Error("Cannot get a random value from an empty array");
  }

  return array[Math.floor(Math.random() * array.length)]!;
};
