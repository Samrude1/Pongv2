var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 10;
var frames = 0;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function hitSound() {
  const hitSound = new Audio("sounds/sound.ogg");
  hitSound.play();
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    ballSpeedX = 10;
    ballSpeedY = 10;
    frames = 0;
    showingWinScreen = false;
  }
}

function counter() {
  if (showingWinScreen) {
    return;
  }
  frames++;
  if (frames % 900 === 0) {
    ballSpeedX *= 1.5;
    ballSpeedY *= 1.5;
    console.log("NEW SPEED: " + ballSpeedX);
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(function () {
    counter();
    moveEverything();
    drawEverything();
    console.log(ballSpeedX);
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 10;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 10;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
      hitSound();
    } else {
      player2Score++;
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
      hitSound();
    } else {
      player1Score++;
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
    hitSound();
  }
  if (ballY > canvas.height) {
    hitSound();
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "#00ff00");
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "black");

  canvasContext.font = "bold 56px 'Courier New'";
  canvasContext.fillStyle = "#00ff00"; //
  canvasContext.textAlign = "center";

  if (showingWinScreen) {
    canvasContext.font = "bold 48px 'Courier New'";
    canvasContext.fillStyle = "#00ff00";
    canvasContext.textAlign = "center";

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("LEFT PLAYER WINS!", canvas.width / 2, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("RIGHT PLAYER WINS!", canvas.width / 2, 200);
    }

    canvasContext.font = "bold 24px 'Courier New'";
    canvasContext.fillStyle = "#00ff00";
    canvasContext.fillText("CLICK TO CONTINUE", canvas.width / 2, 300);
    return;
  }

  drawNet();

  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "#00ff00");

  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "#00ff00"
  );

  colorCircle(ballX, ballY, 10, "#00ff00");

  canvasContext.fillText(player1Score, 100, 80);
  canvasContext.fillText(player2Score, canvas.width - 100, 80);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
