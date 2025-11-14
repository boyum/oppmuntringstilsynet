import type { Config } from "@jest/types";
import { defaults } from "jest-config";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customConfig: Config.InitialOptions = {
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, "e2e"],
  testEnvironment: "./fix-js-dom-environment.ts",
};

export default createJestConfig(customConfig);
