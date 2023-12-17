// main.js
document.addEventListener('DOMContentLoaded', function () {
    let currentGame = null;

    document.getElementById("beginner").addEventListener("click", function () {
        if (currentGame) {
            currentGame.cleanup(); // Add a cleanup method to your Minesweeper classes
        }
        currentGame = new MinesweeperBeginner();
        currentGame.initializeBoard();
        currentGame.showBoard();
    });

    document.getElementById("intermediate").addEventListener("click", function () {
        if (currentGame) {
            currentGame.cleanup();
        }
        currentGame = new MinesweeperIntermediate();
        currentGame.initializeBoard();
        currentGame.showBoard();
    });

    document.getElementById("expert").addEventListener("click", function () {
        if (currentGame) {
            currentGame.cleanup();
        }
        currentGame = new MinesweeperExpert();
        currentGame.initializeBoard();
        currentGame.showBoard();
    });
});