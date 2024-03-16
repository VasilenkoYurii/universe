import {
  getOpponentName,
  config,
  COLLISION_CATEGORY,
} from "../helpers/constants";
import Matter from "matter-js";

class Player {
  constructor(world, position, velocity, size, name) {
    this.world = world;
    this.name = name;

    this.body = Matter.Bodies.rectangle(
      position.x + size / 2,
      position.y + size / 2,
      size,
      size,
      {
        frictionAir: 0,
        frictionStatic: 0,
        friction: 0,
        inertia: Infinity,
        restitution: 1,
        collisionFilter: {
          mask:
            COLLISION_CATEGORY[getOpponentName(this.name)] |
            COLLISION_CATEGORY.wall,
        },
        render: {
          fillStyle: config.colors[this.name],
        },
      }
    );

    Matter.Body.setVelocity(this.body, velocity);
    Matter.World.add(this.world, this.body);
  }
}

export default Player;
