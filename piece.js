// define a Piece as a 2-d array of blocks
class Piece {

    constructor(board) {
        // set to 1 for testing
        // what is the piece shape
        this.shape = round(random(0,6));

        // position of the piece's top-left corner, not yet scaled by gridSize
        // so every 1 position, translates to X gridSize in (this.draw())
                                       // (POS) * (GRIDSIZE) = PIXEL
        this.pos = {x: 4, y: 0};       // ****** UNITARY ******
        this.color = {r: random(0,200), g: random(0,200), b: random(0,200)};
        this.matrix = makeMatrix(this.shape);
        this.atBottom = false;
        this.board = board;
    }

    // draw the piece on the board using its (pos) (color) and (matrix)
    // scaled by (gridSize)
    draw() {
        for (var y=0; y<this.matrix.length; y++) {
            var row = this.matrix[y];

            for (var x=0; x<row.length; x++) {
                var value = row[x];

                // draw boxes where the matrix has value 1
                if (value != 0) {
                    //noStroke();
                    fill(this.color.r, this.color.g, this.color.b);
                    rect(
                        // we're adding here because:
                        // start at the top-left of the piece
                        // x and y determine which element of the (matrix)
                        // we are on, so add that to the piece's position (pos)
                        // to draw that individual box
                        // ****************************************************
                        // The multiplication here is why everywhere else,
                        //     ----------   (pos) is unitary    -----------
                        // This is the only place we scale (pos) by (gridSize)
                        // Anywhere else, to use pixel positions, we must
                        // DIVIDE THE PIXELS BY GRIDSIZE when comparing to (pos)
                        // (POS) * (GRIDSIZE) = PIXEL
                        // ****************************************************
                        this.pos.x*gridSize + x*gridSize,
                        this.pos.y*gridSize + y*gridSize,
                        gridSize,
                        gridSize
                    );
                }
            }
        }
    } // end of draw()

    // drop the piece by 1 gridSize at an interval
    lower() {
        var time = round(millis());
        var deltaTime = time - this.board.lastTime;
        this.board.lastTime = time;
        this.board.dropCounter += deltaTime;

        // lower the piece by 1 gridSize every (dropInterval) milliseconds
        if (this.board.dropCounter >= this.board.dropInterval
            && this.farBottom() < this.board.lowerLimit
            && this.canGoDown() == true) {

            this.goDown();
        }

        // block has reached the bottom of the board
        if (this.farBottom() == this.board.lowerLimit || this.canGoDown() == false) {
            // wait (dropInterval) milliseconds
            if (this.board.dropCounter >= this.board.dropInterval) {
                // this is where lower() will stop being called by the main piece
                this.atBottom = true;
                // add piece to the baord matrix
                this.board.addPiece(this);
                // check if any rows are full
                this.board.checkIfRowsFull();
                // make a new piece at the top
                return new Piece(this.board);
            }
        }

        return this;
    } // end of lower()

    // drop the piece down by 1 block
    goDown() {
        if (this.farBottom() < this.board.lowerLimit && this.canGoDown() == true) {
            this.pos.y++;
            this.board.dropCounter = 0;

            // score increases here
            if (this.board.difficulty == 'Easy') {
                this.board.score++;
            }
            else if (this.board.difficulty == 'Med.') {
                this.board.score += 2;
            }
            else if (this.board.difficulty == 'Hard') {
                this.board.score += 5;
            }
            // save personal best cookie
            if (this.board.score > this.board.best) {
                this.board.best = this.board.score;
                setCookie('personal_best', this.board.best, 365*100);
            }
        }
    }

    // this only moves the piece LEFT or RIGHT
    // pass in -1 or 1, and it is scaled by gridSize
    // automatically within the draw function
    move(where) {
        // RIGHT and LEFT limits of the board, respectively
        if (((where > 0 && this.farRight(this.matrix) < this.board.rightLimit)
            || (where < 0 && this.farLeft(this.matrix) > 0))
            && this.canMove(where)) {

                this.pos.x += where;
            }
    }

    rotate() {
      var copy = new Array(this.matrix.length);
        for (var i=0; i<this.matrix.length; i++) {
            copy[i] = new Array(this.matrix[i].length);
            for (var j=0; j<this.matrix[i].length; j++) {
                copy[i][j] = this.matrix[i][j];
            }
        }

        var rotated = rotatedPiece(copy);

        var canRotate = (this.canRotate(rotated));

        if (canRotate) {
            return rotated;
        } else {
          return this.matrix;
        }
    }

    // can the piece be rotated?
    canRotate(rotatedMatrix) {
        // go through every element in the piece (4x4)
        for (var j=0; j<rotatedMatrix.length; j++) {

            for (var i=0; i<rotatedMatrix[j].length; i++) {
                var value = rotatedMatrix[j][i];
                if ((value == 1)
                    && (!this.board.matrix[j+this.pos.y]
                    || !this.board.matrix[j+this.pos.y][i+this.pos.x]
                    || this.board.matrix[j+this.pos.y][i+this.pos.x].value == 1)) {
                    return false;
                }
            }
        }
        return true;
    }

    // can the piece go down by 1 block?
    canGoDown() {
        // go through every element in the piece (4x4)
        for (var j=0; j<this.matrix.length; j++) {
            for (var i=0; i<this.matrix[j].length; i++) {
                var value = this.matrix[j][i];

                if ((value == 1)
                    && (!this.board.matrix[j+this.pos.y+1]
                    || this.board.matrix[j+this.pos.y+1][i+this.pos.x].value == 1)) {
                    return false;
                }
            }
        }
        return true;
    }

    // can the piece move left/right?
    canMove (where) {
        // go through every element in the piece (4x4)
        for (var j=0; j<this.matrix.length; j++) {
            for (var i=0; i<this.matrix[j].length; i++) {
                var value = this.matrix[j][i];

                if (value == 1 &&
                    this.board.matrix[j+this.pos.y][i+this.pos.x+where].value == 1) {
                    return false;
                }
            }
        }
        return true;
    }

    // in pixels
    farRight(matrix) {
        var farRight = 0;
        matrix.forEach(function(row, y) {
            row.forEach(function(value, x) {
                if (value == 1 && farRight < x) {
                    farRight = x;
                }
            });
        });
        return (this.pos.x*gridSize + (farRight+1)*gridSize);
    }

    // in pixels
    farLeft(matrix) {
        var farLeft = 100;
        matrix.forEach(function(row, y) {
            row.forEach(function(value, x) {
                if (value == 1 && farLeft > x) {
                    farLeft = x;
                }
            });
        });
        return (this.pos.x*gridSize + farLeft*gridSize);
    }

    // in pixels
    farBottom() {
        var farBottom = 0;
        this.matrix.forEach(function(row, y) {
            row.forEach(function(value, x) {
                if (value == 1 && farBottom < y) {
                    farBottom = y;
                }
            });
        });
        return (this.pos.y*gridSize + (farBottom+1)*gridSize);
    }

} // end of Piece class
