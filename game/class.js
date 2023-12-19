class MinesweeperBase {
    constructor(numRows, numCols, numMines) {
      this.numRows = numRows;
      this.numCols = numCols;
      this.numMines = numMines;
      this.gameLost = false;
      this.gameWon = false;
      this.elapsedTime = 0;
      this.timerInterval = null;
      this.board = [];
      this.mouseIsClicked = false;
  
      this.gameBoard = document.getElementById("gameBoard");
      this.userMineCount1 = document.getElementById("count1");
      this.userMineCount2 = document.getElementById("count2");
      this.userMineCount3 = document.getElementById("count3");
  
      document.getElementById("restartButton").addEventListener("click", () => this.restartGame());
    }
    
    //initializes board with random mines and the number of mines surrounding the cell
    //hides the values underneath a grey square
    initializeBoard() {
      this.elapsedTime = 0;
      this.gameLost = false;
      this.gameWon = false;
      this.board = [];

      document.getElementById("restartButton").innerHTML = '<img src="pictures/smiley_face.png" alt="Smiley Face">';
  
      for (let i = 0; i < this.numRows; i++) {
        this.board[i] = [];
        for (let j = 0; j < this.numCols; j++) {
          this.board[i][j] = {
            isMine: false,
            isRevealed: false,
            isFlagged: false,
          };
        }
      }
  
      let minesPlaced = 0;
      while (minesPlaced < this.numMines) {
        const row = Math.floor(Math.random() * this.numRows);
        const col = Math.floor(Math.random() * this.numCols);
  
        if (!this.board[row][col].isMine) {
          this.board[row][col].isMine = true;
          minesPlaced++;
        }
      }
  
      for (let i = 0; i < this.numRows; i++) {
        for (let j = 0; j < this.numCols; j++) {
          this.board[i][j].mineCount = this.countNeighborMines(i, j);
        }
      }
  
      this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }
    //checks for the changing of the face
    getGameLost() {
        return this.gameLost;
    }
    //checks for the changing of the face
    getGameWon() {
        return this.gameWon;
    }
    //updates the timer by 1 for each second
    //parses into digits
    updateTimer() {
        this.elapsedTime++;
        this.time1 = this.elapsedTime%10;
        this.time2 = Math.floor(this.elapsedTime/10);
        this.time3 = Math.floor(this.elapsedTime/100);
        if(this.elapsedTime > 99){
            this.time2 = this.time2%10;
        }
        if(this.elapsedTime >999){
            this.stopTimer();
        }
        document.getElementById("timer1").textContent = this.time1;
        document.getElementById("timer2").textContent = this.time2;
        document.getElementById("timer3").textContent = this.time3;
    }
    
    stopTimer() {
        clearInterval(this.timerInterval);
    }
    
    //counts the number of mines around a specific cell
    countNeighborMines(row, col) {
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
            if (newRow >= 0 && newRow < this.numRows && newCol >= 0 && newCol < this.numCols) {
                // Check if the neighbor contains a mine
                if (this.board[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    
        return count;
    }
    
    //reveals the cell that is clicked
    //reveals multiple cells if there is no mine around the cell that is clicked
    clickCell(row, col){
        if (this.gameLost) {
            // Game is already lost, do nothing
            return;
        }
    
        this.board[row][col].isRevealed = true;
        if (this.board[row][col].isMine){
            for(let i = 0; i< this.numRows; i++){
                for(let j = 0; j<this.numCols; j++){
                    if (this.board[i][j].isMine){
                        this.board[i][j].isRevealed = true;
                    }
                }
            }
            this.gameLost = true;
        }
        if(this.board[row][col].mineCount === 0){
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
                    newRow >= 0 && newRow < this.numRows &&
                    newCol >= 0 && newCol < this.numCols &&
                    !this.board[newRow][newCol].isRevealed
                ) {
                    this.clickCell(newRow, newCol);
                }
            }
            
        }
        this.showBoard();
    }
    
    //organizes each cell into a div
    //determines if a mine should be flagged, revealed, etc
    //goes to win/lost condition
    showBoard() {
        this.gameBoard.innerHTML = "";
        this.UserFoundMines = 0;
    
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
    
                if (!this.board[i][j].isRevealed) {
                    cell.addEventListener(
                        "click",
                        () => this.clickCell(i, j)
                    );
    
                    cell.addEventListener("contextmenu", (event) => {
                        event.preventDefault();
                        this.board[i][j].isFlagged = true;
                        this.showBoard();
                    });
                }
    
                if (this.board[i][j].isRevealed) {
                    if (this.board[i][j].isMine) {
                        this.stopTimer();
                        const bombImage = document.createElement("img");
                        bombImage.src = "pictures/bomb.png";
                        bombImage.style.width = "100%";
                        bombImage.style.height = "100%";
                        cell.innerHTML = '';  // Clear the existing content
                        cell.appendChild(bombImage);
                    } else if (this.board[i][j].mineCount === 0) {
                        cell.classList.add("count");
                    } else {
                        const mineCount = this.board[i][j].mineCount;
                        cell.textContent = mineCount;
                        cell.classList.add(`count-${mineCount}`);
                    }
                }
    
                if (this.board[i][j].isFlagged) {
                    this.UserFoundMines += 1;
                    const flagImage = document.createElement("img");
                    flagImage.src = "pictures/flag.png";
                    flagImage.style.width = "100%";
                    flagImage.style.height = "100%";
                    cell.innerHTML = '';  // Clear the existing content
                    cell.appendChild(flagImage);
    
                    if (this.UserFoundMines === this.numMines) {
                        this.winCondition();
                    }
    
                    cell.addEventListener("contextmenu", (event) => {
                        event.preventDefault();
                        this.board[i][j].isFlagged = false;
                        this.showBoard();
                    });
                }
                if (this.gameLost) {
                    document.getElementById("restartButton").innerHTML = '<img src="pictures/sad_face.png" alt="Sad Face">';
                }
    
                this.gameBoard.appendChild(cell);
            }
    
            this.gameBoard.appendChild(document.createElement("br"));
        }
    
        this.userMineCount1.textContent = (this.numMines - this.UserFoundMines) % 10;
        this.userMineCount2.textContent = Math.floor((this.numMines - this.UserFoundMines) / 10);
        this.userMineCount3.textContent = 0;
    }    
    
    //resets each of the variables for the game restart
    restartGame() {
        this.gameLost = false;
        this.UserFoundMines = this.numMines;
        this.elapsedTime = 0; // Reset elapsed time
        this.stopTimer(); // Stop the timer from the previous game
        this.initializeBoard();
        this.showBoard();
    }
    
    //from the library, triggers the api
    triggerConfetti() {
        confetti({
            particleCount: 150,
            spread: 180,
            origin: { y: 0.6 },
        });
    }
    //changes face and reveals confetti if won
    winCondition(){
        let countMines = 0;
        this.gameWon = true;
        for(let i = 0; i < this.numRows; i++){
            for(let j = 0; j<this.numCols; j++){
                if (this.board[i][j].isMine && this.board[i][j].isFlagged){
                    countMines++;
                }
            }
        }
        if (countMines === this.numMines){
            this.stopTimer();
            this.triggerConfetti();
            document.getElementById("restartButton").innerHTML = '<img src="pictures/sunglasses_face.png" alt="Sunglasses Face">';
        }
    }

    //for only having one variable at a time
    cleanup() {
        this.stopTimer();
    }
  
  }
  