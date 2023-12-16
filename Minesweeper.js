const numRows = 8;
const numCols = 8;
const numMines = 10;
let gameLost = false;
let elapsedTime = 0;

let timerInterval;

const gameBoard = document.getElementById("gameBoard");
userMineCount1 = document.getElementById("count1");
userMineCount2 = document.getElementById("count2");
userMineCount3 = document.getElementById("count3");
document.getElementById("restartButton").addEventListener("click", restartGame);
let board = [];

function initializeBoard() {
    elapsedTime = 0;
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
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
            minesPlaced++;
        }
        
    }

    for(let i = 0; i <numRows; i++){
        for(let j = 0; j<numCols; j++){
            board[i][j].mineCount = countNeighborMines(i,j);
        }
    }
    timerInterval = setInterval(updateTimer, 1000); // Update every second

}

function updateTimer() {
    elapsedTime++;
    time1 = elapsedTime%10;
    time2 = Math.floor(elapsedTime/10);
    time3 = Math.floor(elapsedTime/100);
    if(elapsedTime > 99){
        time2 = time2%10;
    }
    if(elapsedTime >999){
        stopTimer();
    }
    document.getElementById("timer1").textContent = time1;
    document.getElementById("timer2").textContent = time2;
    document.getElementById("timer3").textContent = time3;
}

function stopTimer() {
    clearInterval(timerInterval);
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
    if (gameLost) {
        // Game is already lost, do nothing
        return;
    }

    board[row][col].isRevealed = true;
    if (board[row][col].isMine){
        for(let i = 0; i< numRows; i++){
            for(let j = 0; j<numCols; j++){
                if (board[i][j].isMine){
                    board[i][j].isRevealed = true;
                }
            }
        }
        gameLost = true;
    }
    if(board[row][col].mineCount === 0){
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
        
        for (const direction of directions) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;
        
            if (
                newRow >= 0 && newRow < numRows &&
                newCol >= 0 && newCol < numCols &&
                !board[newRow][newCol].isRevealed
            ) {
                clickCell(newRow, newCol);
            }
        }
        
    }
    showBoard();
}


function showBoard() {
    gameBoard.innerHTML = "";
    UserFoundMines = 0;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            
            // Initialize the flag state for each cell

            if (!board[i][j].isRevealed) {
                // Add event listener only to unrevealed cells
                cell.addEventListener(
                    "click",
                    () => clickCell(i, j)
                );

                cell.addEventListener("contextmenu", function (event) {
                    event.preventDefault(); // Prevent the default context menu

                    // Toggle the flag state
                    board[i][j].isFlagged = true;
                    showBoard();
                });
            }

            if (board[i][j].isRevealed) {
                if (board[i][j].isMine) {
                    stopTimer();
                    const bombImage = document.createElement("img");
                    bombImage.src = "pictures/bomb.png";
                    cell.appendChild(bombImage);
                    
                    bombImage.style.width = "100%"; // Adjust as needed
                    bombImage.style.height = "100%"; // Adjust as needed

                    // Clear the existing content of the cell and append the image
                    cell.innerHTML = '';
                    cell.appendChild(bombImage);
                    //cell.classList.add("mine");
                } else if (board[i][j].mineCount === 0) {
                    cell.classList.add("count");
                } else {
                    const mineCount = board[i][j].mineCount;
                    cell.textContent = mineCount;
                }
            }

            if(board[i][j].isFlagged){
                UserFoundMines +=1;
                const flagImage = document.createElement("img");
                flagImage.src = "pictures/flag.png";
                cell.appendChild(flagImage);
                
                flagImage.style.width = "100%"; // Adjust as needed
                flagImage.style.height = "100%"; // Adjust as needed

                // Clear the existing content of the cell and append the image
                cell.innerHTML = '';
                cell.appendChild(flagImage);

                if(UserFoundMines === numMines){
                    winCondition();
                }


                cell.addEventListener("contextmenu", function (event) {
                    event.preventDefault(); // Prevent the default context menu

                    // Toggle the flag state
                    board[i][j].isFlagged = false;
                    showBoard();
                });
            }

            gameBoard.appendChild(cell);
        }

        gameBoard.appendChild(document.createElement("br"));
    }
    userMineCount1.textContent = (numMines-UserFoundMines)%10;
    userMineCount2.textContent = Math.floor((numMines-UserFoundMines)/10);
    userMineCount3.textContent = 0;
}

function restartGame() {
    gameLost = false;
    UserFoundMines = numMines;
    elapsedTime = 0; // Reset elapsed time
    stopTimer(); // Stop the timer from the previous game
    initializeBoard();
    showBoard();
}


function winCondition(){
    let countMines = 0;
    for(let i = 0; i < numRows; i++){
        for(let j = 0; j<numCols; j++){
            if (board[i][j].isMine && board[i][j].isFlagged){
                countMines++;
            }
        }
    }
    if (countMines === numMines){
        stopTimer();
        alert("you win!");  
    }
}

initializeBoard();
showBoard();
