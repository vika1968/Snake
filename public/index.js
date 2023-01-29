"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
let snakeBody;
let direction = `right`;
let food;
// Set size of each square on the canvas
const squareSizeXandY = 50;
let timer;
let score = document.querySelector('.score');
let pointsCount = 0;
score.textContent = 'Your score: ' + pointsCount.toString();
const btnStart = document.querySelector('button');
const generateRandomNumber = (minValue, maxValue) => {
    let randomNumber = Math.floor(Math.random() * (maxValue - minValue) + minValue);
    return Math.round(randomNumber / squareSizeXandY) * squareSizeXandY;
};
// Draw a grid (canvas)
const drawGrid = () => {
    const scaleX = 50;
    const scaleY = 50;
    ctx.beginPath();
    ctx.strokeStyle = `rgb(245 240 235)`;
    // Draw vertical lines
    for (let i = 0; i <= canvas.width; i += scaleX) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    // Draw horizontile lines
    for (let i = 0; i <= canvas.height; i += scaleY) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();
    ctx.closePath();
};
const newSnake = () => {
    snakeBody = [{ x: generateRandomNumber(canvas.width / 3, canvas.width / 2), y: generateRandomNumber(canvas.height / 3, canvas.height / 2) }];
};
const newFood = () => {
    food = [generateRandomNumber(canvas.width / 5, canvas.width / 2), generateRandomNumber(canvas.height / 5, canvas.height / 2)];
};
drawGrid();
newSnake();
newFood();
const manageGame = () => {
    if (food[0] + squareSizeXandY >= canvas.width || food[1] + squareSizeXandY >= canvas.height) {
        newFood();
    }
    // Clean the old
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    // Paint food in red  
    ctx.fillStyle = `red`;
    // Drawing food  
    ctx.fillRect(food[0], food[1], squareSizeXandY, squareSizeXandY);
    // Paint snake in green 
    ctx.fillStyle = `rgb(140,203,1)`;
    let snakeHeadCoordinates = { x: snakeBody[0].x, y: snakeBody[0].y };
    let snakeTailCoordinates = snakeBody[snakeBody.length - 1];
    // If the direction is right, then keep Y, but change X to + square
    if (direction == `right`) {
        snakeHeadCoordinates.x = snakeTailCoordinates.x + squareSizeXandY;
        snakeHeadCoordinates.y = snakeTailCoordinates.y;
    }
    // If the direction is down, then keep X, but change Y to + square
    if (direction == `down`) {
        snakeHeadCoordinates.y = snakeTailCoordinates.y + squareSizeXandY;
        snakeHeadCoordinates.x = snakeTailCoordinates.x;
    }
    // If the direction is left, then keep Y, but change X to -square
    if (direction == `left`) {
        snakeHeadCoordinates.x = snakeTailCoordinates.x - squareSizeXandY;
        snakeHeadCoordinates.y = snakeTailCoordinates.y;
    }
    // If direction is up then keep X but change Y to -square
    if (direction == `up`) {
        snakeHeadCoordinates.y = snakeTailCoordinates.y - squareSizeXandY;
        snakeHeadCoordinates.x = snakeTailCoordinates.x;
    }
    // add the tail to the end of an array
    snakeBody.push(snakeHeadCoordinates);
    // remove head (first element)
    snakeBody.splice(0, 1);
    score.textContent = `Your score: ${snakeBody.length - 1}`;
    pointsCount = snakeBody.length - 1;
    // Check if the snake has gone beyond the canvas
    snakeBody.forEach((snakeElement, i) => {
        if ((direction == `right` && snakeElement.x > (Math.round(canvas.width / squareSizeXandY) * squareSizeXandY) || //moving to the right and the snake's X position is greater than the canvas width
            (direction == `down` && snakeElement.y > Math.round(canvas.height / squareSizeXandY) * squareSizeXandY) || //moving down and the element's X position is greater than the screen height
            (direction == `left` && snakeElement.x < 0) ||
            (direction == `up` && snakeElement.y < 0))) {
            clearInterval(timer);
            score.textContent = `You lost! Your score : ${pointsCount}. Click the 'New game' button to start a new game!`;
            setInterval(reloadWindow, 500);
        }
        // if the snake caught food, add a square to the beginning of an array
        if (snakeElement.x === food[0] && snakeElement.y === food[1]) {
            newFood();
            snakeBody.unshift({ x: snakeHeadCoordinates.x - squareSizeXandY, y: snakeTailCoordinates.y });
        }
        ctx.fillRect(snakeElement.x, snakeElement.y, squareSizeXandY - 1, squareSizeXandY - 1);
    });
};
// Move the snake with the keyboard
document.addEventListener(`keydown`, snakeManualControl);
function snakeManualControl(event) {
    if ([37, 38, 39, 40].indexOf(event.keyCode) >= 0) {
        event.preventDefault();
        if (event.keyCode == 37 && direction != `right`)
            direction = `left`;
        else if (event.keyCode == 38 && direction != `down`)
            direction = `up`;
        else if (event.keyCode == 39 && direction != `left`)
            direction = `right`;
        else if (event.keyCode == 40 && direction != `up`)
            direction = `down`;
    }
}
// Start the game
const newGame = () => {
    pointsCount = 0;
    score.textContent = `Your score: ${pointsCount}`;
    setInterval(manageGame, 300);
};
btnStart.addEventListener(`click`, newGame);
function reloadWindow() {
    window.location.reload();
}
