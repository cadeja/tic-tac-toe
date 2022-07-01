


// gameboard related shenanigans
const gameBoard = (() => {
    let board = [
        '','','',  // 0, 1, 2
        '','','',  // 3, 4, 5
        '','',''   // 6, 7, 8
    ]
    
    const getBoard = () => board;

    //creates divs for gameboard
    const _createSpaces = () => {
        const gameContainer = document.getElementById('game');
        for (let i = 0; i < 9; i++){

            const div = document.createElement('div');

            div.setAttribute('class','game-space');
            div.setAttribute('id',`space-${i}`);

            gameContainer.appendChild(div);
        }
    }

    // loads board array and displays x's and o's
    const loadBoard = () => {
        for (let i = 0; i < 9; i++){
            const space = document.getElementById(`space-${i}`);
            space.textContent = board[i];

            // controls color
            if (space.textContent == 'x'){
                space.setAttribute('style',`color: ${playerOne.getColor()};`);
            } else if (space.textContent == 'o'){
                space.setAttribute('style',`color: ${playerTwo.getColor()};`);
            }
        }
    }

    // writes sign (x or o) at space on board and reloads it
    const writeBoard = (space, sign) => {
        board[space] = sign;
        loadBoard();
    }

    const clearGame = () => {
        board = [
            '','','',  // 0, 1, 2
            '','','',  // 3, 4, 5
            '','',''   // 6, 7, 8
        ]

        gameController.resetGame();
        writeBoard();
        displayController.turnMessage();
        playerOne.resetMoves();
        playerTwo.resetMoves();

    };

    // INITIALIZE BOARD
    _createSpaces();

    return {
        loadBoard,
        writeBoard,
        getBoard,
        clearGame
    };
})();


// deals with menus, buttons, and displays outside the game board
const displayController = (() =>{
    
    const container = document.getElementById('info-container');
    const changeText = (str) => container.textContent = str;


    // day/night theme toggle
    let theme = 'dark';
    const _themeToggle = () => {
        const root = document.querySelector(':root');
        if (theme == 'dark'){
            theme = 'light';
            root.style.setProperty('--base-color', '#bbbebd');
            root.style.setProperty('--content-color', '#0e1112');
            root.style.setProperty('--button-hover-color','#d4dad8');
        } else if (theme == 'light'){
            theme = 'dark';
            root.style.setProperty('--base-color', '#0e1112');
            root.style.setProperty('--content-color', '#bbbebd');
            root.style.setProperty('--button-hover-color','#212729');
        }
    };

    const _themeToggleEvent = () => {
        const btn = document.getElementById('theme-toggle');
        btn.addEventListener('click',_themeToggle);
    };

    _themeToggleEvent();


    // display turn message
    const turnMessage = () => {
        const container = document.getElementById('info-container');
        container.textContent = `${gameController.getActivePlayer().name}'s Turn`;
    }



    // FORM STUFF

    // gets player names from form
    const getPlayerName = (player) => {  //player: 'one' or 'two'
        const playerName = document.getElementById(`player-${player}-name`);

        return playerName.value;
    }


    const displayRestartButton = () => {
        const container = document.getElementById('info-container');
        container.innerHTML += '<button class="play-again-button" id="play-again-button">Play Again?</button>';
        const btn = document.getElementById('play-again-button');
        btn.addEventListener('click',gameBoard.clearGame);
    };


    const getColorSelector = (n) => { // 1 or 2 for argument
        return document.getElementById(`color-selector-${n}`).style.backgroundColor;
    };

    // color selector
    const setPlayerColor = () => {
        playerOne.setColor(getColorSelector(1));
        playerTwo.setColor(getColorSelector(2));
    };


    // start button
    const startButtonEvent = () => {
        const btn = document.getElementById('start-game');
        btn.addEventListener('click', () => {

            setPlayerColor();

            playerOneName = getPlayerName('one');
            playerTwoName = getPlayerName('two');
            if (playerOneName != ''){
                playerOne.name = playerOneName;
            }
            if (playerTwoName != ''){
                playerTwo.name = playerTwoName;
            }

            turnMessage();

        });
    }

    startButtonEvent();

    return{
        changeText,
        turnMessage,
        displayRestartButton,
        getColorSelector
    }
})();


// controls game flow and is the big papa module
const gameController = (() => {

    // returns player object whose turn it is
    const getActivePlayer = () => playerOne.getTurn() == true ? playerOne : playerTwo;


    const changePlayerTurns = () => {
        // switches turn bools
        playerOne.switchTurn();
        playerTwo.switchTurn();

        // sets playersign
        playerOne.getTurn() == true ? playersign = playerOne.sign : playersign = playerTwo.sign;
    };



    // sets of indices for win conditions
    const _winConditions = [
        [0,1,2],[3,4,5],[6,7,8], // row wins
        [0,3,6],[1,4,7],[2,5,8], // column wins
        [0,4,8],[2,4,6]          // diagonal wins
    ];

    // check for win by comparing array of player moves with _winConditions array
    const _checkForWin = (playerMoves) => {
        for (let i = 0; i < _winConditions.length; i++){
            
            if (
                playerMoves.includes(_winConditions[i][0]) &&
                playerMoves.includes(_winConditions[i][1]) &&
                playerMoves.includes(_winConditions[i][2])) {
                    return true;
                }
        }
        return false;
    };

    const resetGame = () => gameOver = false;


    // THE MAIN EVENT
    let gameOver = false;
    const _setSpaceEventListeners = () => {
        for (let i = 0; i < 9; i++) {
            const space = document.getElementById(`space-${i}`);
            space.addEventListener('click', () => {
                if (gameBoard.getBoard()[i] == '' && !gameOver){  // make sure space is empty
                    gameBoard.writeBoard(i, playersign); // puts player sign on space

                    getActivePlayer().addMove(i); // adds board index to player moves

                    if (_checkForWin(getActivePlayer().getMoves())){
                        gameOver = true;
                        displayController.changeText(getActivePlayer().name + ' wins!');
                        displayController.displayRestartButton();
                    } else {
                        changePlayerTurns();
                        displayController.turnMessage();
                    }

                    
                }
            });
        }
    }

    // SET EVENT
    _setSpaceEventListeners();

    return {
        changePlayerTurns,
        getActivePlayer,
        resetGame
    };
})();





const Player = (name, sign, goesFirst, color) => {

    // turn stuff
    let isMyTurn = goesFirst;

    const switchTurn = () => isMyTurn = !isMyTurn;
    const getTurn = () => isMyTurn;

    const getColor = () => color;
    const setColor = (newColor) => color = newColor;

    // player move indices
    let moves = [];
    const addMove = (index) => moves.push(index);
    const getMoves = () => moves;
    const getName = () => name;
    const resetMoves = () => moves = [];

    return {
        name,
        sign,
        color,
        getTurn,switchTurn,
        addMove, getMoves, resetMoves,
        getName,
        getColor, setColor
    };
};


const playerOne = Player('Player One', 'x', true, displayController.getColorSelector(1));
const playerTwo = Player('Player Two', 'o', false, displayController.getColorSelector(2));
let playersign = playerOne.sign;