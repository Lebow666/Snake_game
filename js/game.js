const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/snake_pole.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

let box = 32;

let score = 0;

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

let snakeX = snake[0].x;
let snakeY = snake[0].y;

document.addEventListener("keydown", startGame);

let dir;
let gameStarted = false;
let gameTime = 60; // начальное значение времени в секундах
let gameDuration = 60; // 1 минута
let remainingTime = gameTime; // оставшееся время
let timerStarted = false; // флаг для отслеживания запуска таймера

let game;

function startGame(event) {
  if (!gameStarted) {
    startTime = Date.now();
    gameStarted = true;
    game = setInterval(drawGame, 100);
    // Добавляем проверку победы только после начала движения змейки
    setInterval(checkWin, 1000);
  }
  direction(event);
  timerStarted = true; // Устанавливаем флаг в true после начала движения
}

function direction(event) {
  if (event.keyCode == 37 && dir != "right") dir = "left";
  else if (event.keyCode == 38 && dir != "down") dir = "up";
  else if (event.keyCode == 39 && dir != "left") dir = "right";
  else if (event.keyCode == 40 && dir != "up") dir = "down";
}

function eatTail(head, arr) {
  for (let i = 1; i < arr.length; i++) {
    if (head.x == arr[i].x && head.y == arr[i].y) clearInterval(game);
  }
}

function drawGame() {
  ctx.drawImage(ground, 0, 0);
  ctx.drawImage(foodImg, food.x, food.y);
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "green" : "red";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7);
  ctx.fillText(remainingTime, box * 15, box * 1.7);

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    snake.pop();
  }

  if (
    snakeX < box ||
    snakeX > box * 17 ||
    snakeY < 3 * box ||
    snakeY > box * 17
  ) {
    clearInterval(game);
    gameOver();
  }

  if (dir == "left") snakeX -= box;
  if (dir == "right") snakeX += box;
  if (dir == "up") snakeY -= box;
  if (dir == "down") snakeY += box;

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  eatTail(newHead, snake);

  snake.unshift(newHead);
}

function checkWin() {
  if (gameStarted && timerStarted && remainingTime > 0) {
    remainingTime--;
  } else if (remainingTime <= 0) {
    clearInterval(game);
    gameWin();
  }
}

function gameOver() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.fillText("Вы проиграли", box * 6, box * 10);
  ctx.font = "20px Arial";
  ctx.fillText("Нажмите Enter, чтобы перезапустить игру", box * 4, box * 12);
  document.removeEventListener("keydown", direction);
  document.addEventListener("keydown", restartGame);
}

function gameWin() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  ctx.font = "40px Arial";
  ctx.fillText("Вы выиграли!", box * 6, box * 10);
  ctx.font = "20px Arial";
  ctx.fillText("Нажмите Enter, чтобы перезапустить игру", box * 4, box * 12);
  document.removeEventListener("keydown", direction);
  document.addEventListener("keydown", restartGame);
}

function restartGame(event) {
  if (event.keyCode == 13) {
    location.reload();
  }
}

// Начать игру
startGame();