const numRows = 8;
const numCols = 8;
const numMines = 10;

const gameBoard = document.getElementById("gameBoard");
let board = [];

function initializeBoard() {
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {
                isMine: false,
                isRevealed: false,
            };
        }
    }

    let minesPlaced = 0
    while (minesPlaced < numMines){
        const row = Math.floor(
            Math.random() * numRows
        );
        const col = Math.floor(
            Math.random() * numCols
        );

        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            console.log(row, col);
            minesPlaced++;
        } else {
            console.log("already placed");
        }
        
    }

    for(let i = 0; i <numRows; i++){
        for(let j = 0; j<numCols; j++){
            board[i][j].mineCount = countNeighborMines(i,j);
        }
    }

    //showBoard();
}


function countNeighborMines(row, col) {
    let count = 0;

    // Define relative coordinates for all neighbors (including diagonals)
    const directions = [
        { row: -1, col: 0 },  // N
        { row: -1, col: 1 },  // NE
        { row: 0, col: 1 },   // E
        { row: 1, col: 1 },   // SE
        { row: 1, col: 0 },   // S
        { row: 1, col: -1 },  // SW
        { row: 0, col: -1 },  // W
        { row: -1, col: -1 }  // NW
    ];

    // Check each neighbor
    for (const direction of directions) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;

        // Check if the neighbor is within the board boundaries
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            // Check if the neighbor contains a mine
            if (board[newRow][newCol].isMine) {
                count++;
            }
        }
    }

    return count;
}


function clickCell(row, col){
    board[row][col].isRevealed = true;
    console.log("in click");
    showBoard();
}


function showBoard() {
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            console.log("in show");

            if (!board[i][j].revealed) {
                // Add event listener only to unrevealed cells
                cell.addEventListener(
                    "click",
                    () => clickCell(i, j)
                );
            }

            if (board[i][j].revealed) {
                console.log("in reveal");
                if (board[i][j].isMine) {
                    cell.classList.add("mine");
                } else {
                    const mineCount = board[i][j].mineCount;
                    cell.textContent = mineCount > 0 ? mineCount : '';
                }
            }

            gameBoard.appendChild(cell);
        }

        gameBoard.appendChild(document.createElement("br"));
    }
}



initializeBoard();
showBoard();
