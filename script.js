const gameBoard = (() => {
        const board = [];
        for (let i = 0; i < 3; i++)
        {
            board[i] = [];
            for (let j = 0; j < 3; j++)
            {
                board[i].push(0);
            }
        }
        return board;
})();

const domTranslator = (() => {
    const container = document.querySelector('.container');
    const printBoard = () => {
        for (let i = 1; i <= 3; i++)
        {
            for (let j = 1; j <= 3; j++)
            {
                cell = document.createElement('div');
                cell.classList.add(`row-${i}`, `column-${j}`, `cell`);
                container.appendChild(cell);
            }
        }
    }
    return {printBoard};
})();

const gameController = (() => {
    function makeButtons() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', gameController.addMarker);
        });
    }
    function undoButtons() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', gameController.addMarker);
        });
    }
    function checkWin(row, column) {
        const checkedRow = document.querySelectorAll(`.row-${row}`);
        const checkedColumn = document.querySelectorAll(`.column-${column}`);
        if ((checkedRow[0].textContent == checkedRow[1].textContent) && 
            (checkedRow[0].textContent == checkedRow[2].textContent)) {
            return true;
        }
        if ((checkedColumn[0].textContent == checkedColumn[1].textContent) && 
            (checkedColumn[0].textContent == checkedColumn[2].textContent)) {
            return true;
        }
        const firstDiagonal = [];
        for (let i = 1; i <= 3; i++)
        {
            firstDiagonal.push(document.querySelector(`.row-${i}.column-${i}`));
        }
        const secondDiagonal = [];
        let count = 1;
        for (let i = 3; i >= 1; i--)
        {
            secondDiagonal.push(document.querySelector(`.row-${i}.column-${count}`));
            count++;
        }
        if ((firstDiagonal[0].textContent == firstDiagonal[1].textContent) && 
        (firstDiagonal[0].textContent == firstDiagonal[2].textContent)) {
            if (firstDiagonal[0].textContent) return true;
        }
        if ((secondDiagonal[0].textContent == secondDiagonal[1].textContent) && 
        (secondDiagonal[0].textContent == secondDiagonal[2].textContent)) {
            if (secondDiagonal[0].textContent) return true;
        }
        return false;
    }
    function addMarker(event) {
        const cell = event.target;
        let cellRow = cell.classList[0].split('');
        let cellColumn = cell.classList[1].split('');
        cellRow = cellRow[cellRow.length - 1];
        cellColumn = cellColumn[cellColumn.length - 1];
        if (cell.textContent) {
            return;
        }
        console.log(cell);
        if (players.currentPlayer) {
            cell.textContent = 'O';
            if (checkWin(cellRow, cellColumn)) {
                console.log('Game over!');
                undoButtons();
            }
            players.currentPlayer = 0;

        }
        else {
            cell.textContent = 'X';
            if (checkWin(cellRow, cellColumn)) {
                console.log('Game over!');
                undoButtons();
            }
            players.currentPlayer = 1;
        }
    }
    return {addMarker, makeButtons};
})();

const players = (()=>{
    function waver({name}) {
        return {
            wave: () => console.log(`${name} waved`)
        }
    }
    const playerCreator = (name, marker) => {
        let player = {name, marker};
        player = Object.assign(player, waver(player));
        return player;
    }
    let currentPlayer;
    const player1 = playerCreator('Player 1', 'X');
    const player2 = playerCreator('Player 2', 'X');
    return {currentPlayer, player1, player2};
})();


const codeRunner = (() => {
    domTranslator.printBoard();    
    gameController.makeButtons();
    
    
})();

