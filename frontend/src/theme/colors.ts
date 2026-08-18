// Ported 1:1 from the web prototype's `--color-*` CSS variables (src/index.css).
// RN's color parser accepts 8-digit #RRGGBBAA hex, so alpha-suffixed literals
// used throughout the original screens (e.g. "#5db87a22") work unchanged.
export const colors = {
  bg: "#f5f1eb",
  surface: "#ffffff",
  surface2: "#ede8df",
  border: "#ddd4c5",
  gold: "#b8892a",
  goldLight: "#d4a840",
  goldMuted: "#c49840",
  // Named "cream" in the original CSS but actually used as the primary
  // (dark) text color throughout — kept as `text` here for clarity.
  text: "#1c1510",
  muted: "#8a7968",
  muted2: "#b5a898",
  green: "#2e9e56",
  blue: "#2e6fd4",
  red: "#c04040",
  // Text color used on top of solid gold buttons/badges.
  onGold: "#0b0b14",
};
