document.addEventListener('DOMContentLoaded', function () {
    let currentGame = null;

    // Function to show the open mouth picture
    function showPicture() {
        console.log(currentGame.getGameWon());
        if (!currentGame.getGameLost() && !currentGame.getGameWon()){
            mouseIsClicked = true;
            document.getElementById("restartButton").innerHTML = '<img src="pictures/open_mouth.png" alt="Sad Face">';
        }
        
    }

    // Function to hide the open mouth picture
    function hidePicture() {
        if (!currentGame.getGameLost() && !currentGame.getGameWon()){
            mouseIsClicked = false;
            document.getElementById("restartButton").innerHTML = '<img src="pictures/smiley_face.png" alt="Smiley Face">';
        }
        
    }

    //initialize the beginner game
    document.getElementById("beginner").addEventListener("click", function () {
        //check if there is a current game going
        if (currentGame) {
            currentGame.cleanup();
        }
        currentGame = new MinesweeperBeginner();
        currentGame.initializeBoard();
        currentGame.showBoard();
        document.getElementById('gameBoard').addEventListener('mousedown', showPicture);
        document.getElementById("gameBoard").addEventListener('mouseup', hidePicture);
    });

    //initialize the intermediate game
    document.getElementById("intermediate").addEventListener("click", function () {
        if (currentGame) {
            currentGame.cleanup();
        }
        currentGame = new MinesweeperIntermediate();
        currentGame.initializeBoard();
        currentGame.showBoard();
        document.getElementById('gameBoard').addEventListener('mousedown', showPicture);
        document.getElementById("gameBoard").addEventListener('mouseup', hidePicture);
    });

    //initialize the expert game
    document.getElementById("expert").addEventListener("click", function () {
        if (currentGame) {
            currentGame.cleanup();
        }
        currentGame = new MinesweeperExpert();
        currentGame.initializeBoard();
        currentGame.showBoard();
        document.getElementById('gameBoard').addEventListener('mousedown', showPicture);
        document.getElementById("gameBoard").addEventListener('mouseup', hidePicture);
    });
});
