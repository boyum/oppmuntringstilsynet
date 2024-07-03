import type { Config } from "@jest/types";
import { defaults } from "jest-config";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customConfig: Config.InitialOptions = {
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, "e2e"],
  testEnvironment: "jsdom",
};

export default createJestConfig(customConfig);
