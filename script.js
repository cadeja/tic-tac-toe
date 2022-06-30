const gameBoard = (() => {
    let board = [
        '','','',  // 0, 1, 2
        '','','',  // 3, 4, 5
        '','',''   // 6, 7, 8
    ]

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

    const _setSpaceEventListeners = () => {
        for (let i = 0; i < 9; i++) {
            const space = document.getElementById(`space-${i}`);
            space.addEventListener('click', () => {
                if (board[i] == ''){
                    writeBoard(i, playersign);
                }
            });
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
    _setSpaceEventListeners();

    return {
        loadBoard,
        writeBoard
    };
})();

const gameController = (() => {


    const _changePlayerTurns = () => {
        playerOne.switchTurn();
        playerTwo.switchTurn();
    };


    const _winConditions = [[0,1,2],[3,4,5],[6,7,8], // row wins
                            [0,3,6],[1,4,7],[2,5,8], // column wins
                            [0,4,7],[2,4,6]];        // diagonal wins

    //const checkForWin = () => {

    //};
})();


const Player = (name, sign, goesFirst) => {
    let isMyTurn = goesFirst;

    const switchTurn = () => isMyTurn = !isMyTurn;

    const getTurn = () => isMyTurn;

    return { name, sign, getTurn, switchTurn };
};

const playerOne = Player('Cade', 'x', true);
const playerTwo = Player('Mark', 'o', false);

console.log(playerOne.getTurn());
playerOne.switchTurn();
console.log(playerOne.getTurn());