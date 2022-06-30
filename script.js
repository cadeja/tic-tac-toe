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
            document.getElementById(`space-${i}`).textContent = board[i];
        }
    }

    // writes sign (x or o) at space on board and reloads it
    const writeBoard = (space, sign) => {
        board[space] = sign;
        loadBoard();
    }

    // INITIALIZE BOARD
    _createSpaces();

    return {
        loadBoard,
        writeBoard,
        getBoard
    };
})();


const gameController = (() => {

    // returns player object whose turn it is
    const _getActivePlayer = () => playerOne.getTurn() == true ? playerOne : playerTwo;


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


    // THE MAIN EVENT
    let gameOver = false;
    const _setSpaceEventListeners = () => {
        for (let i = 0; i < 9; i++) {
            const space = document.getElementById(`space-${i}`);
            space.addEventListener('click', () => {
                if (gameBoard.getBoard()[i] == '' && !gameOver){  // make sure space is empty
                    gameBoard.writeBoard(i, playersign); // puts player sign on space

                    _getActivePlayer().addMove(i); // adds board index to player moves

                    if (_checkForWin(_getActivePlayer().getMoves())){
                        console.log(_getActivePlayer().name + ' wins!');
                        gameOver = true;
                    }

                    changePlayerTurns();
                }
            });
        }
    }

    // SET EVENT
    _setSpaceEventListeners();

    return {
        changePlayerTurns
    };
})();


const Player = (name, sign, goesFirst) => {

    // turn stuff
    let isMyTurn = goesFirst;
    const switchTurn = () => isMyTurn = !isMyTurn;
    const getTurn = () => isMyTurn;

    // player move indices
    let moves = [];
    const addMove = (index) => moves.push(index);
    const getMoves = () => moves;

    return {
        name,
        sign,
        getTurn,
        switchTurn,
        addMove,
        getMoves
    };
};


const playerOne = Player('Cade', 'x', true);
const playerTwo = Player('Mark', 'o', false);
let playersign = playerOne.sign;