import Matter from "matter-js";
import { getOpponentName, config, COLLISION_CATEGORY } from "../helpers/constants";

export class Field {
  constructor(world, sideLength, squareSizePx) {
    this.world = world;
    this.bodiesToSquares = new Map();

    for (let y = 0; y < sideLength; y++) {
      for (let x = 0; x < sideLength; x++) {
        const owner = x < sideLength / 2 ? "left" : "right";
        const position = Matter.Vector.create(
          x * squareSizePx + squareSizePx / 2,
          y * squareSizePx + squareSizePx / 2
        );
        const square = new FieldSquare(
          this.world,
          position,
          owner,
          squareSizePx
        );
        this.bodiesToSquares.set(square.body, square);
      }
    }
  }
}

export class FieldSquare {
  constructor(world, position, owner, sizePx) {
    this.world = world;
    this._owner = owner;

    this.body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      sizePx + 1,
      sizePx + 1,
      {
        isStatic: true,
        collisionFilter: { category: COLLISION_CATEGORY[this._owner] },
        render: {
          fillStyle: config.colors[getOpponentName(this._owner)],
        },
      }
    );

    Matter.World.add(this.world, this.body);
  }

  get owner() {
    return this._owner;
  }

  capture(newOwner) {
    this._owner = newOwner;
    this.body.render.fillStyle = config.colors[getOpponentName(newOwner)];
    this.body.collisionFilter.category = COLLISION_CATEGORY[newOwner];
  }
}
