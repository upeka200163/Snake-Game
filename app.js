let g_start, g_restart, g_speed, canvas, ctx;
let width = 400, height = 500, cell = 20;
let snake, food, direction, score, highScore = 0;
let timer, speed, paused = false;

function init() {
    g_start = document.getElementById("g_start");
    g_restart = document.getElementById("g_restart");
    g_speed = document.getElementById("g_speed");
    canvas = document.getElementById("g_area");
    ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    g_start.onclick = startGame;
    g_restart.onclick = startGame;

    document.addEventListener("keydown", control);
}

function startGame() {
    clearInterval(timer);
    score = 0;
    paused = false;
    direction = "right";
    speed = parseInt(g_speed.value);

    snake = [{ x: 5, y: 5 }];
    createFood();

    timer = setInterval(gameLoop, 500 / speed);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (width / cell)),
        y: Math.floor(Math.random() * (height / cell))
    };
}

function gameLoop() {
    if (paused) return;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "right") headX++;
    if (direction === "left") headX--;
    if (direction === "up") headY--;
    if (direction === "down") headY++;

    if (
        headX < 0 || headY < 0 ||
        headX >= width / cell || headY >= height / cell ||
        collision(headX, headY)
    ) {
        gameOver();
        return;
    }

    if (headX === food.x && headY === food.y) {
        score += speed;
        createFood();
    } else {
        snake.pop();
    }

    snake.unshift({ x: headX, y: headY });
    draw();
}

function collision(x, y) {
    return snake.some(s => s.x === x && s.y === y);
}

function draw() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    // Snake
    ctx.fillStyle = "#2b2b2b";
    snake.forEach(s =>
        ctx.fillRect(s.x * cell, s.y * cell, cell, cell)
    );

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * cell, food.y * cell, cell, cell);

    document.getElementById("score").innerText = score;
}

function gameOver() {
    clearInterval(timer);
    highScore = Math.max(score, highScore);
    document.getElementById("highscore").innerText = highScore;

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#fff";
    ctx.font = "30px Poppins";
    ctx.fillText("Game Over", 120, 220);
    ctx.fillText("Score: " + score, 135, 260);
}

function control(e) {
    if (e.code === "Space") paused = !paused;

    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
}

window.onload = init;
