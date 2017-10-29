class Board {

    constructor() {
        // these variables are for the timing of the piece dropping
        this.lastTime = 0;
        this.dropCounter = 0;
        this.dropInterval = 1000;

        // how long they've been holding an arrow key down for
        this.downFor = 0;

        // define the bottom and right of the board per how many gridSizes
        // value is in pixels
        this.lowerLimit = gridHeight*gridSize;
        this.rightLimit = gridWidth*gridSize;

        this.gameStarted = false;
        this.difficulty = "Easy";
        this.diffColor = "green";
        this.gridOn = true;

        // your score counter
        this.score = 0;
        // personal best
        this.best = getCookie('personal_best');

        // create a board grid, size (gridHeight) x (gridWidth)
        // boxes in the board are referenced:
        // matrix[row][col]
        // with [0][0] at the top-left
        var empty = new Array(gridHeight);

        for (var j=0; j<empty.length; j++) {
            empty[j] = new Array(gridWidth);

            for (var i=0; i<gridWidth; i++) {
                empty[j][i] = {
                    pos:   {x: i, y: j},
                    color: {r: 255, g: 255, b: 255},
                    value: 0
                };
            }
        }

        this.matrix = empty;
    } // end of constructor()

    deleteRow(row) {
        // go through each row, starting at the full one, up to the top
        while (row > 0) {
            for (let i = 0; i < this.matrix[row].length; i++) {
                // change each row's attributes to be the one above it
                this.matrix[row][i].value = this.matrix[row-1][i].value;
                this.matrix[row][i].color = this.matrix[row-1][i].color;
                //console.log(this.matrix[row][i]);
                //console.log(this.matrix[row-1][i]);
            }
            row--;
        }
    }

    // checks if any rows are full
    checkIfRowsFull() {

        // go through each row
        for (var j=1; j<this.matrix.length; j++) {

            // go through each column
            for (var i=0; i<this.matrix[j].length; i++) {

                if (this.matrix[j][i].value == 0) {
                    break;
                }
                // we are at the last column, all values are 1
                else if (i == this.matrix[j].length-1) {
                    // delete row j
                    this.deleteRow(j);
                    this.checkIfRowsFull();
                    return;
                }
            }
        }

      return;

    }

    // add a new piece to the board
    addPiece(piece) {

        // go through every element in the piece (4x4)
        for (var j=0; j<piece.matrix.length; j++) {
            for (var i=0; i<piece.matrix[j].length; i++) {
                var value = piece.matrix[j][i];
                // if its value is 1, save its state in the (Board)
                if (value == 1) {
                    this.matrix[j+piece.pos.y][i+piece.pos.x].value = 1;
                    this.matrix[j+piece.pos.y][i+piece.pos.x].color.r = piece.color.r;
                    this.matrix[j+piece.pos.y][i+piece.pos.x].color.g = piece.color.g;
                    this.matrix[j+piece.pos.y][i+piece.pos.x].color.b = piece.color.b;
                }
            }
        }
    }

    // draw the entire board
    draw() {
        // go through every element of the entire board matrix (gridHeight) x (gridWidth)
        for (var j=0; j<this.matrix.length; j++) {
            for (var i=0; i<gridWidth; i++) {
                // if the value is 1, draw the box (gridSize) x (gridSize)
                var box = this.matrix[j][i];
                if (box.value == 1 || this.gridOn) {
                    fill(
                        box.color.r,
                        box.color.g,
                        box.color.b
                    );
                    rect(
                        box.pos.x*gridSize,
                        box.pos.y*gridSize,
                        gridSize,
                        gridSize
                    );
                }
            }
        }
    } // end of draw()

} // end of Board class
