(function () {
  const game = document.querySelector("#snakeGame");
  const pointsView = document.querySelector("#score");
  const labelDown = document.querySelector("#labelDown");
  pointsView.innerHTML = 0;
  const ctx = game.getContext("2d");

  const DIRECTIONS = {
    up: 1,
    down: 2,
    left: 3,
    right: 4,
  };

  const FPS = 1000 / 15;

  let direction = DIRECTIONS.right;
  let headPosX = 10,
    headPosY = 10;

  let snake = [{ posX: 10, posY: 10 }];

  let positionSnake = new Set();

  let food = createFood();

  let points = 0;

  function drawSnake() {
    for (let unitSnake of snake) {
      ctx.beginPath();
      ctx.fillRect(unitSnake.posX, unitSnake.posY, 10, 10);
      ctx.stroke();
    }
  }

  function drawFood() {
    ctx.beginPath();
    ctx.fillRect(food.posX, food.posY, 10, 10);
    ctx.stroke();
  }

  function setPosition() {
    if (direction === DIRECTIONS.right) headPosX += 10;
    else if (direction === DIRECTIONS.left) headPosX -= 10;
    else if (direction === DIRECTIONS.down) headPosY += 10;
    else if (direction === DIRECTIONS.up) headPosY -= 10;

    snake.unshift({ posX: headPosX, posY: headPosY });
    snake.pop();
  }

  function addUnitSnake() {
    let directionLastUnit;
    let lastUnit;

    if (snake.length === 1) {
      directionLastUnit = direction;
      lastUnit = snake[0];
    } else {
      lastUnit = snake[snake.length - 1];
      let penultimateUnit = snake[snake.length - 2];

      let diffX = penultimateUnit.posX - lastUnit.posX;
      let diffY = penultimateUnit.posY - lastUnit.posY;

      if (diffX > 0) {
        directionLastUnit = DIRECTIONS.right;
      } else if (diffX < 0) {
        directionLastUnit = DIRECTIONS.left;
      } else if (diffY > 0) {
        directionLastUnit = DIRECTIONS.down;
      } else if (diffY < 0) {
        directionLastUnit = DIRECTIONS.up;
      }
    }

    switch (directionLastUnit) {
      case DIRECTIONS.up:
        newUnit = { posX: lastUnit.posX, posY: lastUnit.posY + 10 };
        break;
      case DIRECTIONS.down:
        newUnit = { posX: lastUnit.posX, posY: lastUnit.posY - 10 };
        break;
      case DIRECTIONS.right:
        newUnit = { posX: lastUnit.posX + 10, posY: lastUnit.posY };
        break;
      case DIRECTIONS.left:
        newUnit = { posX: lastUnit.posX - 10, posY: lastUnit.posY };
        break;
    }

    snake.push(newUnit);
  }

  function incrementScore() {
    points++;
    pointsView.innerHTML = points;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, game.width, game.height);
  }

  function watchColisions() {
    if (headPosX <= 0 || headPosY <= 0 || headPosX >= 300 || headPosY >= 300) {
      gameOver();
    }

    if (positionSnake.size != snake.length) {
      gameOver();
    }

    if (positionSnake.has(`${food.posX}${food.posY}`)) {
      food = createFood();
      addUnitSnake();
      incrementScore();
    }
  }

  document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowUp" && direction !== DIRECTIONS.down) {
      direction = DIRECTIONS.up;
    } else if (e.code === "ArrowDown" && direction !== DIRECTIONS.up) {
      direction = DIRECTIONS.down;
    } else if (e.code === "ArrowLeft" && direction !== DIRECTIONS.right) {
      direction = DIRECTIONS.left;
    } else if (e.code === "ArrowRight" && direction !== DIRECTIONS.left) {
      direction = DIRECTIONS.right;
    }
  });

  function createFood() {
    let min = Math.ceil(0);
    let max = Math.floor(30);
    let posX = (Math.floor(Math.random() * (max - min)) + min) * 10;
    let posY = (Math.floor(Math.random() * (max - min)) + min) * 10;

    if (positionSnake.has(`${posX}${posY}`)) {
      return createFood();
    }

    return { posX, posY };
  }

  function updatePositionSnake() {
    positionSnake = new Set();
    snake.forEach((unitSnake) =>
      positionSnake.add(`${unitSnake.posX}${unitSnake.posY}`)
    );
  }

  function gameLoop() {
    clearCanvas();
    setPosition();
    updatePositionSnake();
    drawSnake();
    drawFood();
    watchColisions();
  }

  function gameOver() {
    clearInterval(gameInterval);
    ctx.font = "16px Arial";
    labelDown.innerHTML = "Game Over! Your Score: " + points;
  }

  let gameInterval = setInterval(gameLoop, FPS);
})();
