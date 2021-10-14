import type { Config } from "@jest/types";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defaults } from "jest-config";

const config: Config.InitialOptions = {
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, "e2e"],
  testEnvironment: "jsdom",
};

export default config;
