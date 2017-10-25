// the size of 1 block
var gridSize = 50;

// how many blocks wide/high is the grid
var gridWidth = 12;
var gridHeight = 12;

var piece;
var board;

function setup() {
    board = new Board();
    piece = new Piece(board);

    createCanvas(board.rightLimit+gridSize*2, board.lowerLimit+gridSize*2);
    background(255);

}


function draw() {

    background(255);
    noStroke();
    fill(100);

    // draw game limits
    // top
    rect(0, 0, board.rightLimit+gridSize, gridSize);
    // left
    rect(0, 0, gridSize, board.lowerLimit+gridSize);
    // right
    rect(board.rightLimit+gridSize, 0, gridSize, board.lowerLimit+gridSize);
    // bottom
    rect(0, board.lowerLimit+gridSize, board.rightLimit+2*gridSize, gridSize);

    stroke(200);
    // we need to translate because the grid is off by 1
    // because of the game border
    translate(gridSize, gridSize);

    if (board.gameStarted) {
        startGame();
    } else {
        board.gridOn?board.draw():null;
        startScreen();
    }


}

function startScreen() {

    var hoverStart = hovering('start');
    var hoverGrid = hovering('grid');
    var hoverDiff = hovering('diff');

    translate(0,-50);
    strokeWeight(9);
    fill(40);
    stroke(hoverStart?255:150);
    rect(180,150,250,75);
    fill(hoverStart?255:150);
    textSize(40);
    noStroke();
    text("Start Game!",200,200);
    fill(40);
    stroke(hoverGrid?255:150);
    translate(0,150);
    rect(180,150,250,75);
    fill(hoverGrid?255:150);
    noStroke();
    text("Grid: "+(board.gridOn?"ON":"Off"),225,200);
    translate(0,150);
    fill(40);
    stroke(hoverDiff?255:150);
    rect(180-40,150,250+80,75);
    fill(board.diffColor);
    noStroke();
    text("Difficulty: "+board.difficulty,200-30,200);
    translate(0, 150);
    textSize(20);
    fill(150);
    noStroke();
    text("games by ady",200+40,195);
    translate(0,-450+50);
    strokeWeight(1);
    fill(0);
    stroke(0);
}

// main gameplay loop
function startGame() {

    board.draw();
    piece.draw();

    board.checkIfRowsFull();

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
        } else if (keyIsDown(RIGHT_ARROW)) {
            piece.move(1);
        } else if (keyIsDown(DOWN_ARROW)) {
            piece.goDown();
        }
    }
}

// move by 1 gridSize with a simple arrow press
function keyPressed() {
    if (!piece.atBottom) {
        if (keyCode === LEFT_ARROW) {
            piece.move(-1);
        } else if (keyCode === RIGHT_ARROW) {
            piece.move(1);
        } else if (keyCode === DOWN_ARROW) {
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

Number.prototype.between = function(a, b) {
    return (this >= a && this <= b);
};

function hovering(over) {
    if (over == "start") {
        return (mouseX.between(179+25, 430+25) && mouseY.between(97+25, 178+25));

    } else if (over == "grid") {
        return (mouseX.between(179+25, 431+25) && mouseY.between(250+25, 328+25));

    } else if (over == "diff") {
        return (mouseX.between(139+25, 470+25) && mouseY.between(389+25, 474+25));
    }
}

var xDir;
var lastX;
//var mouseIsPressed;

function mousePressed() {
    lastX = mouseX;
    xDir = 0;
}

function mouseDragged() {
    xDir = mouseX - lastX;
}

function mouseReleased() {
    if (board.gameStarted) {
        if (xDir > 50) {
          piece.move(1);
        } else if (xDir < -50) {
            piece.move(-1);
        } else if (xDir >= -50 && xDir <= 50) {
            piece.matrix = piece.rotate();
        }
    }
}

function mouseClicked() {
    //console.log(mouseX,mouseY);
    if (!board.gameStarted) {
        // start game button
        if (hovering('start')) {
            board.gameStarted = true;

        // grid on/off button
        } else if (hovering('grid')) {
            board.gridOn = !board.gridOn;

        // difficuly level button
        } else if (hovering('diff')) {

            if (board.difficulty == "Easy") {
                board.difficulty = "Med.";
                board.diffColor = "orange";
                board.dropInterval = 300;
            } else if (board.difficulty == "Med.") {
                board.difficulty = "Hard";
                board.diffColor = "red";
                board.dropInterval = 100;
            } else if (board.difficulty == "Hard") {
                board.difficulty = "Easy";
                board.diffColor = "green";
                board.dropInterval = 1000;
            }
        }
    }
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseClicked();
  mouseReleased();
  return false;
}
