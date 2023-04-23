import { randomArrayValue } from "./array-utils";

describe("array-utils", () => {
  describe(randomArrayValue.name, () => {
    it("should return a random value from the array", () => {
      const array = [1, 2, 3, 4, 5];
      const randomValue = randomArrayValue(array);
      expect(array).toContain(randomValue);
    });

    it("should throw if the array is empty", () => {
      const emptyArray: Array<unknown> = [];
      expect(() => randomArrayValue(emptyArray)).toThrow();
    });
  });
});
