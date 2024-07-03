import type { Config } from "@jest/types";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customConfig: Config.InitialOptions = {
  preset: "jest-puppeteer",
  roots: ["src/e2e"],
};

export default createJestConfig(customConfig);
