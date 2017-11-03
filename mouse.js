let xDir;
let yDir;
let lastX;
let lastY;

// global mouse down event
function mousePressed() {
    lastX = mouseX;
    lastY = mouseY;
    xDir = 0;
    yDir = 0;
}

// global mouse dragged event
function mouseDragged() {
    // calculate the direction they are dragging the mouse
    xDir = mouseX - lastX;
    yDir = mouseY - lastY;
}

// global mouse up event
function mouseReleased() {
    if (board.gameStarted) {
        // move down
        if (yDir > 50) {
            piece.goDown();
        }
        // move right
        else if (xDir > 50) {
            piece.move(1);
        }
        // move left
        else if (xDir < -50) {
            piece.move(-1);
        }
        // rotate the piece
        else if (xDir >= -50 && xDir <= 50) {
            piece.matrix = piece.rotate();
        }
    }
}

// global mouse clicked event
// mouse has been fully pressed and released
function mouseClicked() {
    // console.log(mouseX, mouseY);

    // start screen buttons
    if (!board.gameStarted) {
    
        // start game button pressed
        if (hovering('start')) {
            board.gameStarted = true;
            $('#mainCanvas').css('cursor', 'default');
        }
        // difficuly level button pressed
        else if (hovering('diff')) {
            if (board.difficulty == 'Easy') {
                board.difficulty = 'Med.';
                board.diffColor = 'orange';
                board.dropInterval = 300;
            }
            else if (board.difficulty == 'Med.') {
                board.difficulty = 'Hard';
                board.diffColor = 'red';
                board.dropInterval = 100;
            }
            else if (board.difficulty == 'Hard') {
                board.difficulty = 'Easy';
                board.diffColor = 'green';
                board.dropInterval = 1000;
            }
        }
        // credits button pressed
        else if (hovering('credits')) {
            window.location.href = 'https://addyh.github.io';
        }
    }
    // game over buttons
    else if (board.gameOver) {
    
        // "try again" button pressed
        if (hovering('start')) {
            let oldBoard = board;
            board = new Board();
            piece = new Piece(board);
            board.gameStarted = true;
            board.difficulty = oldBoard.difficulty;
            board.diffColor = oldBoard.diffColor;
            board.dropInterval = oldBoard.dropInterval;
            $('#mainCanvas').css('cursor', 'default');
        }
        // Easy mode button pressed
        else if (hovering('Easy') && !isBestScore()) {
            board.difficulty = 'Easy';
            board.diffColor = 'green';
            board.dropInterval = 1000;
        }
        // Med. mode button pressed
        else if (hovering('Med.') && !isBestScore()) {
            board.difficulty = 'Med.';
            board.diffColor = 'orange';
            board.dropInterval = 300;
        }
        // Hard mode button pressed
        else if (hovering('Hard') && !isBestScore()) {
            board.difficulty = 'Hard';
            board.diffColor = 'red';
            board.dropInterval = 100;
        }
        // Submit High Score button pressed
        else if (hovering('submit') && isBestScore()) {
            submitHiscore();
        }
    }
}

// touch-screen functions
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

// is a number between two values a and b?
Number.prototype.between = function(a, b) {
    return (this >= a && this <= b);
};

// is the mouse hovering over a certain button?
function hovering(over) {
    if (over == 'start') {
        return (mouseX.between(179+gridSize, 430+gridSize)
            && mouseY.between(97+gridSize, 178+gridSize));
    }
    else if (over == 'diff') {
        return (mouseX.between(139+gridSize, 470+gridSize)
            && mouseY.between(389+gridSize, 474+gridSize));
    }
    else if (over == 'credits') {
        return (mouseX.between(139+50+gridSize, 470+gridSize-50)
            && mouseY.between(389+gridSize+160, 474+gridSize+125));
    }
    else if (over == 'Easy') {
        return (mouseX.between(168, 272)
            && mouseY.between(544, 598));
    }
    else if (over == 'Med.') {
        return (mouseX.between(289, 391)
            && mouseY.between(544, 598));
    }
    else if (over == 'Hard') {
        return (mouseX.between(409, 512)
            && mouseY.between(544, 598));
    }
    else if (over == 'submit') {
        return (mouseX.between(188, 522)
            && mouseY.between(548, 611));
    }
}
