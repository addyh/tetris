// the size of 1 block
let gridSize = 50;

// how many blocks wide/high is the grid
let gridWidth = 12;
let gridHeight = 12;

let piece;
let board;
let mainCanvas;
let hiscoreInput;

var getBestName;
var getBestScore;

function setup() {
  board = new Board();
  piece = new Piece(board);

  mainCanvas = createCanvas(board.rightLimit+gridSize*2, board.lowerLimit+gridSize*2)
    .id('mainCanvas');

  // high score input box
  hiscoreInput = createInput('').id('hiscoreInput').parent('hiscoreForm');
  hiscoreInput.style('position', 'absolute');
  hiscoreInput.style('width', '300px');
  hiscoreInput.style('height', '30px');
  hiscoreInput.style('font-size', '24pt');
  hiscoreInput.attribute('maxlength', '19');

  // submit the form when they prss enter
  $('#hiscoreForm').submit(function(event) {
    submitHiscore();
    event.preventDefault();
  });

  if (typeof getBestName == 'undefined') {
    getBestName = function() {
      return 'Nobody';
    };
  }

  if (typeof getBestScore == 'undefined') {
    getBestScore = function() {
      return 0;
    };
  }

}

// main draw loop
function draw() {

  // Keep highscore input box hidden until needed
  hiscoreInput.style('display', 'none');

  // clear screen every frame
  background(255);

  // draw game borders
  // border color, dark gray
  fill(100);
  noStroke();
  // top
  rect(0, 0, board.rightLimit+gridSize, gridSize);
  // left
  rect(0, 0, gridSize, board.lowerLimit+gridSize);
  // right
  rect(board.rightLimit+gridSize, 0, gridSize, board.lowerLimit+gridSize);
  // bottom
  rect(0, board.lowerLimit+gridSize, board.rightLimit+2*gridSize, gridSize);

  // post current high score
  fill(255);
  textSize(25);
  text('Score: ' + board.score, 100, 32);
  text('Personal Best: ' + board.best, 380, 32);

  // grid color, light gray
  stroke(200);

  // we need to translate because the grid is off by 1 gridSize
  // because of the game border
  translate(gridSize, gridSize);

  if (board.gameOver) {
    board.draw();
    gameOverScreen();
  }
  else if (board.gameStarted) {
    gameLoop();
  }
  else {
    board.gridOn ? board.draw() : null;
    startScreen();
  }

} // end of draw() loop

function startScreen() {

  // booleans, are we hovering?
  let hoverStart = hovering('start');
  //let hoverGrid = hovering('grid');
  let hoverDiff = hovering('diff');
  let hoverCredits = hovering('credits');

  // High score
  let bestName = getBestName();
  let bestScore = getBestScore();

  if (!bestName || !bestScore) {
    bestName = 'Nobody';
    bestScore = 0;
  }

  // mouse pointer type
  if ((hoverStart || hoverDiff || hoverCredits) // || hoverGrid
        && board.gameStarted == false) {
    $('#mainCanvas').css('cursor', 'pointer');
  }
  else {
    $('#mainCanvas').css('cursor', 'default');
  }

  // button layout
  push();

  // start button
  translate(0,-50);
  strokeWeight(9);
  fill(40);
  stroke(hoverStart?255:150);
  rect(180,150,250,75);
  fill(hoverStart?255:150);
  textSize(40);
  noStroke();
  text('Start Game!',200,200);

  // high score
  translate(0, 150);
  fill(0);
  textSize(50);
  text('High Score:', 175, 140);
  let nameTextCount = bestName.length;
  let scoreTextCount = bestScore.toString().length;
  text(bestName + '\n', 270-(nameTextCount*10), 205);
  text(bestScore, 285-(scoreTextCount*10), 270);

  // difficulty button
  translate(0,150);
  fill(40);
  stroke(hoverDiff?255:150);
  rect(180-40,150,250+80,75);
  fill(board.diffColor);
  noStroke();
  textSize(40);
  text('Difficulty: '+board.difficulty,200-30,200);

  // credits link
  translate(0, 150);
  textSize(25);
  fill(hoverCredits?color(0,0,238):150);
  stroke(hoverCredits?color(0,0,238):150);
  strokeWeight(1);
  text('addyh.github.io',210,185);
  if (hoverCredits) {
    strokeWeight(3);
    line(210, 190, 380, 190);
  }
  translate(0,-450+50);
  strokeWeight(1);
  fill(0);
  stroke(0);

  pop();
} // end of startScreen()

function gameOverScreen() {
  let hoverStart = hovering('start');
  let hoverEasy = hovering('Easy');
  let hoverMed = hovering('Med.');
  let hoverHard = hovering('Hard');
  let hoverSubmit = hovering('submit');

  let canPressEasy = (board.difficulty != 'Easy');
  let canPressMed = (board.difficulty != 'Med.');
  let canPressHard = (board.difficulty != 'Hard');
  // High score
  let bestName = getBestName();
  let bestScore = getBestScore();

  if (!bestName || !bestScore) {
    bestName = 'Nobody';
    bestScore = 0;
  }

  // Did player beat the all time high score?
  let newBestScore = isBestScore();
  let scoreDiff = (bestScore - board.score);

  // mouse pointer type
  if (board.gameOver == true
        && (hoverStart
            || (hoverSubmit && newBestScore)
            || (hoverEasy && canPressEasy && !newBestScore)
            || (hoverMed && canPressMed && !newBestScore)
            || (hoverHard && canPressHard && !newBestScore))) {
    $('#mainCanvas').css('cursor', 'pointer');
  }
  else {
    $('#mainCanvas').css('cursor', 'default');
  }

  // game over buttons
  push();

  // try again
  translate(0, -50);
  strokeWeight(9);
  fill(40);
  stroke(hoverStart?255:150);
  rect(180, 150, 250, 75);
  fill(hoverStart?255:150);
  textSize(40);
  noStroke();
  text('  Try Again', 200, 200);

  // high score
  translate(0, 125);
  strokeWeight(9);
  stroke(150);
  fill(40);
  rect(80, 150, 435, 350);

  // player beat the high score!
  if (newBestScore) {
    noStroke();
    fill(150);
    textSize(25);
    text('                Congratulations!'
            + '\n        You beat the High Score!!!'
            + '\n\n\n\nEnter your name:', 100, 200);
    textSize(40);
    fill('cyan');
    let scoreTextCount = board.score.toString().length;
    // 10 is half the width of a single digit
    text(board.score, 290-(scoreTextCount*10), 300);
    let canvasPos = $('#mainCanvas').position();
    hiscoreInput.style('display', 'block');
    hiscoreInput.style('top', (canvasPos.top+500) + 'px');
    hiscoreInput.style('left', (canvasPos.left+200) + 'px');
    hiscoreInput.value(hiscoreInput.value().replace(/[^a-zA-Z0-9 _-]/g, ''));
    document.getElementById('hiscoreInput').focus();

    // submit button
    translate(0, 275);
    fill(40);
    stroke(hoverSubmit?255:150);
    strokeWeight(4);
    if (hoverSubmit) {
      strokeWeight(5);
    }
    rect(180-40, 150, 250+80, 60);
    fill('cyan');
    noStroke();
    if (hoverSubmit) {
      textSize(41);
      fill(255);
    }
    text('Submit Score!',175, 195);
  }
  // player did not beat the high score
  else {
    noStroke();
    fill(150);
    textSize(25);
    text('Your score was: ' + board.score + '!'
            + '\n\nThat\'s only ' + scoreDiff + ' away'
            + '\n from beating ' + bestName + '!'
            + '\n\nPlay Medium or Hard\n to earn points faster!', 180, 200);

    strokeWeight(3);
    stroke(150);
    fill(40);

    // easy button
    if (canPressEasy) {
      stroke('green');
      if (hovering('Easy')) {
        strokeWeight(5);
        textSize(26);
      }
    }
    rect(120, 420, 100, 50);
    if (canPressEasy) {
      fill('green');
    }
    strokeWeight(1);
    text('Easy', 120+23, 420+32);
    textSize(25);
    strokeWeight(3);
    stroke(150);
    fill(40);

    // medium button
    if (canPressMed) {
      stroke('orange');
      if (hovering('Med.')) {
        strokeWeight(5);
        textSize(26);
      }
    }
    rect(240, 420, 100, 50);
    if (canPressMed) {
      fill('orange');
    }
    strokeWeight(1);
    text('Med.', 240+23, 420+32);
    textSize(25);
    strokeWeight(3);
    stroke(150);
    fill(40);

    // hard button
    if (canPressHard) {
      stroke('red');
      if (hovering('Hard')) {
        strokeWeight(5);
        textSize(26);
      }
    }
    rect(360, 420, 100, 50);
    if (canPressHard) {
      fill('red');
    }
    strokeWeight(1);
    text('Hard', 360+23, 420+32);
  }

  pop();
} // end of gameOverScreen()


// main gameplay loop
function gameLoop() {

  board.draw();
  piece.draw();

  // board.checkIfRowsFull();

  if (!piece.atBottom) {
    piece = piece.lower();
  }

  // if they are holding down an arrow key
  // we need to remember how long
  if (keyIsDown(LEFT_ARROW)
        || keyIsDown(RIGHT_ARROW)
        || keyIsDown(DOWN_ARROW)) {
    board.downFor++;
  }

  // if it's been held down for 10 frames, and not at the bottom
  // then we can start moving the piece
  if (board.downFor > 10 && piece.atBottom == false) {
    if (keyIsDown(LEFT_ARROW))  {
      piece.move(-1);
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      piece.move(1);
    }
    else if (keyIsDown(DOWN_ARROW)) {
      piece.goDown();
    }
  }
} // end of gameLoop()

// move by 1 gridSize with a simple arrow press
function keyPressed() {
  if (!piece.atBottom) {
    if (keyCode === LEFT_ARROW) {
      piece.move(-1);
    }
    else if (keyCode === RIGHT_ARROW) {
      piece.move(1);
    }
    else if (keyCode === DOWN_ARROW) {
      piece.goDown();
    }
  }

  if (keyCode == 32) {
    piece.matrix = piece.rotate();
  }
}

// when an arrow key is released,
// reset the down-pressed timer to zero
function keyReleased() {
  if (keyCode === LEFT_ARROW
        || keyCode === RIGHT_ARROW
        || keyCode === DOWN_ARROW) {
    board.downFor = 0;
  }
}
