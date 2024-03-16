export const config = {
  field: {
    sideLength: 16,
  },
  colors: {
    left: "#F8AB2B",
    right: "#4D428B",
  },
};

export const playerNames = ["left", "right"];

export function getOpponentName(name) {
  return name === "left" ? "right" : "left";
}

export const COLLISION_CATEGORY = { wall: 0x0001, left: 0x0002, right: 0x0004 };
