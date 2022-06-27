const gameBoard = (() => {
    let board = [
        '','','',
        '','','',
        '','',''
    ]

    //creates divs for gameboard
    const createSpaces = () => {
        const gameContainer = document.getElementById('game');
        for (let i = 0; i < 9; i++){
            const div = document.createElement('div');
            div.setAttribute('class','game-space');
            div.setAttribute('id',`space-${i}`);
            gameContainer.appendChild(div);
        }
    }

    // writes x's or o's on gameboard
    const writeBoard = () => {
        for (let i = 0; i < 9; i++){
            document.getElementById(`space-${i}`).textContent = board[i];
        }
    }

    const setEventListeners = () => {
        for (let i = 0; i < 9; i++) {
            const space = document.getElementById(`space-${i}`);
            space.addEventListener('click', () => {
                if (board[i] == ''){
                    board[i] = 'x';
                }
                
                writeBoard();
            });

        }
    }

    return {
        createSpaces,
        writeBoard,
        setEventListeners
    };
})();

const Player = (name) => {
    return { name };
};

gameBoard.createSpaces();
gameBoard.setEventListeners();