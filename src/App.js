import React, { useRef, useEffect, useState } from "react";
import {
  Engine,
  Render,
  Runner,
  Events,
  Composite,
  Bodies,
  Vector,
  Resolver,
} from "matter-js";
import { Field } from "./components/Field";
import Player from "./components/Player";
import { random } from "./helpers/random";
import { config, playerNames } from "./helpers/constants";

function App() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState({
    left: config.field.sideLength ** 2 / 2,
    right: config.field.sideLength ** 2 / 2,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const height = canvas.offsetHeight;
    const width = canvas.offsetWidth;

    // Создание движка и его настройка
    const engine = Engine.create();
    engine.gravity.y = 0;
    const world = engine.world;
    const render = Render.create({
      engine,
      canvas,
      options: { width, height, wireframes: false },
    });
    Render.run(render);
    const runner = Runner.create({ isFixed: true });
    Runner.run(runner, engine);
    Resolver._restingThresh = 1;

    // Создание поля и обработчика коллизий
    const field = new Field(
      world,
      config.field.sideLength,
      width / config.field.sideLength
    );
    Events.on(engine, "collisionEnd", (event) =>
      handleCollisionCaptures(event, field, setScore)
    );

    // Добавление границ и игроков
    Composite.add(world, [
      Bodies.rectangle(-2.5, height / 2, 5, height, { isStatic: true }),
      Bodies.rectangle(width + 2.5, height / 2, 5, height, { isStatic: true }),
      Bodies.rectangle(width / 2, -2.5, width, 5, { isStatic: true }),
      Bodies.rectangle(width / 2, height + 2.5, width, 5, { isStatic: true }),
    ]);
    const squareSizePx = width / config.field.sideLength;
    const maxSpeed = Math.floor(squareSizePx / 2);
    const playerLeft = new Player(
      world,
      Vector.create(
        squareSizePx,
        random(squareSizePx, height - squareSizePx * 3)
      ),
      Vector.create(
        random(maxSpeed / 4, maxSpeed / 3),
        random(maxSpeed / 4, maxSpeed / 3)
      ),
      squareSizePx,
      "left"
    );
    const playerRight = new Player(
      world,
      Vector.create(
        width - squareSizePx * 3,
        random(squareSizePx, height - squareSizePx * 3)
      ),
      Vector.create(
        random(maxSpeed / 4, maxSpeed / 3),
        random(maxSpeed / 4, maxSpeed / 3)
      ),
      squareSizePx,
      "right"
    );
    const bodyToPlayer = new Map([
      [playerLeft.body, playerLeft],
      [playerRight.body, playerRight],
    ]);

    // Функция обработки коллизий
    function handleCollisionCaptures(event, field, setScore) {
      playerNames.forEach((playerName) => {
        const playerFieldPairs = getPlayerSquarePairs(
          event.pairs,
          playerName,
          bodyToPlayer,
          field
        );
        if (playerFieldPairs.length === 0) {
          return;
        }
        const { player, square } = playerFieldPairs[0];
        if (player.name === "left") {
          setScore((prevScore) => ({
            ...prevScore,
            left: prevScore.left + 1,
            right: prevScore.right - 1,
          }));
        } else {
          setScore((prevScore) => ({
            ...prevScore,
            left: prevScore.left - 1,
            right: prevScore.right + 1,
          }));
        }
        square.capture(player.name);
      });
    }

    // Функция для получения пар игрок-квадрат
    function getPlayerSquarePairs(pairs, name, bodyToPlayer, field) {
      const playerFieldPairs = [];
      pairs.forEach(({ bodyA, bodyB }) => {
        let player = undefined;
        let square = undefined;
        for (const body of [bodyA, bodyB]) {
          if (bodyToPlayer.has(body)) {
            player = bodyToPlayer.get(body);
          } else if (field.bodiesToSquares.has(body)) {
            square = field.bodiesToSquares.get(body);
          }
        }
        if (square && player?.name === name) {
          playerFieldPairs.push({ player, square });
        }
      });
      return playerFieldPairs;
    }
  }, []);

  return (
    <div className="wrapper">
      <canvas ref={canvasRef} id="canvas" className="canvas"></canvas>
      <div className="score-wrapper">
        <span className="score color-right">{score.left}</span>✕
        <span className="score color-left">{score.right}</span>
      </div>
    </div>
  );
}

export default App;
