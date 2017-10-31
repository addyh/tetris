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

    createCanvas(board.rightLimit+gridSize*2, board.lowerLimit+gridSize*2)
        .id('mainCanvas');
    background(255);

}

// main draw loop
function draw() {

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
    text("Score: "+board.score, 100, 32);
    text("Personal Best: "+board.best, 380, 32);

    // grid color, light gray
    stroke(200);

    // we need to translate because the grid is off by 1 gridSize
    // because of the game border
    translate(gridSize, gridSize);

    if (board.gameOver) {
        board.draw();
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

    // mouse pointer type
    if ((hoverStart || hoverDiff || hoverCredits) // || hoverGrid
        && board.gameStarted == false) {
        $('#mainCanvas').css('cursor', 'pointer');
    }
    else {
        $('#mainCanvas').css('cursor', 'default');
    }

    // button layout
    translate(0,-50);
    strokeWeight(9);
    fill(40);
    stroke(hoverStart?255:150);
    rect(180,150,250,75);
    fill(hoverStart?255:150);
    textSize(40);
    noStroke();
    text("Start Game!",200,200);
    // fill(40);
    // stroke(hoverGrid?255:150);
    translate(0,150);
    // rect(180,150,250,75);
    // fill(hoverGrid?255:150);
    // noStroke();
    // text("Grid: "+(board.gridOn?"ON":"Off"),225,200);
    translate(0,150);
    fill(40);
    stroke(hoverDiff?255:150);
    rect(180-40,150,250+80,75);
    fill(board.diffColor);
    noStroke();
    text("Difficulty: "+board.difficulty,200-30,200);
    translate(0, 150);
    textSize(25);
    fill(hoverCredits?color(0,0,238):150);
    stroke(hoverCredits?color(0,0,238):150);
    strokeWeight(1);
    text("addyh.github.io",210,185);
    if (hoverCredits) {
        strokeWeight(3);
        line(210, 190, 380, 190);
    }
    translate(0,-450+50);
    strokeWeight(1);
    fill(0);
    stroke(0);
} // end of startScreen()

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
        } else if (keyIsDown(RIGHT_ARROW)) {
            piece.move(1);
        } else if (keyIsDown(DOWN_ARROW)) {
            piece.goDown();
        }
    }
} // end of gameLoop()

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
        return (mouseX.between(179+gridSize, 430+gridSize)
            && mouseY.between(97+gridSize, 178+gridSize));
    }
    // else if (over == "grid") {
    //     return (mouseX.between(179+gridSize, 431+gridSize)
    //         && mouseY.between(250+gridSize, 328+gridSize));
    // }
    else if (over == "diff") {
        return (mouseX.between(139+gridSize, 470+gridSize)
            && mouseY.between(389+gridSize, 474+gridSize));
    }
    else if (over == "credits") {
        return (mouseX.between(139+50+gridSize, 470+gridSize-50)
            && mouseY.between(389+gridSize+160, 474+gridSize+125));
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
            $('#mainCanvas').css('cursor', 'default');
        }
        // grid on/off button
        // else if (hovering('grid')) {
        //     board.gridOn = !board.gridOn;
        //
        // }
        // difficuly level button
        else if (hovering('diff')) {

            if (board.difficulty == "Easy") {
                board.difficulty = "Med.";
                board.diffColor = "orange";
                board.dropInterval = 300;
            }
            else if (board.difficulty == "Med.") {
                board.difficulty = "Hard";
                board.diffColor = "red";
                board.dropInterval = 100;
            }
            else if (board.difficulty == "Hard") {
                board.difficulty = "Easy";
                board.diffColor = "green";
                board.dropInterval = 1000;
            }
        }
        else if (hovering('credits')) {
            window.location.href = 'https://addyh.github.io';
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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return 0;
}
