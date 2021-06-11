import { Theme } from "./Theme";

export const themes: readonly Theme[] = [
  {
    name: "pride",
    label: "Pride",
  },
  {
    name: "original",
    label: "Original",
  },
  {
    name: "moo-moo-farm",
    label: "Moo Moo Farm",
  },
  {
    name: "winter",
    label: "Winter",
  },
] as const;
