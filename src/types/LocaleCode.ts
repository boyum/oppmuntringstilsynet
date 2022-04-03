import type { languages } from "../models/languages";

export type LocaleCode =
  typeof languages[keyof typeof languages]["codes"][number];
