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
    function makeNameInput() {
        const nameInput = document.querySelector('.name-btn');
        
        nameInput.addEventListener('click', players.changeNames)
    }
    function announceWinner(player) {
        const message = document.querySelector('.winner');
        message.textContent = `${player.name} wins!`;
    }
    function announceTurn(player) {
        const turn = document.querySelector('.turn');
        if (!player) {
            turn.textContent = '';
            return;
        }
        turn.textContent = `${player.name}'s turn`;
    }

    function makeResetBtn() {
        const resetBtn = document.querySelector('.reset');
        resetBtn.addEventListener('click', resetGame);
    }
    function resetGame() {
        let container = document.querySelector('.container');
        let winner = document.querySelector('.winner');
        let turn = document.querySelector('.turn');

        winner.replaceChildren();
        turn.textContent = `${players.player1.name}'s turn`;
        container.replaceChildren();
        domTranslator.printBoard();
        players.currentPlayer = 0;
        makeButtons();    
    }
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
    function checkDraw() {
        const cells = document.querySelectorAll('.cell');
        let count = 0;
        cells.forEach(cell=>{
            if (cell.textContent) count++;
        });
        if (count == 9) return true;
        else return false;
        
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
        if (players.currentPlayer) {
            cell.classList.add('fade');
            cell.textContent = 'O';
            if (checkWin(cellRow, cellColumn)) {
                console.log('Game over!');
                undoButtons();
                announceWinner(players.player2);
                announceTurn();
                return;
            }
            if (checkDraw()) {
                announceTurn();
                document.querySelector('.winner').textContent = 'Draw!';
                return;
            }
            announceTurn(players.player1);

            players.currentPlayer = 0;

        }
        else {
            cell.textContent = 'X';
            cell.classList.add('fade');
            if (checkWin(cellRow, cellColumn)) {
                console.log('Game over!');
                undoButtons();
                announceWinner(players.player1);
                announceTurn();
                return;
            }
            if (checkDraw()) {
                announceTurn();
                document.querySelector('.winner').textContent = 'Draw!';
                return;
            }
            announceTurn(players.player2);

            players.currentPlayer = 1;
        }
    }
    return {addMarker, makeButtons, makeResetBtn, makeNameInput, announceTurn};
})();

const players = (()=>{
    function waver({name}) {
        return {
            wave: () => console.log(`${name} waved`)
        }
    }
    function nameSetter({name, marker}) {
        return {
            setName: (newName) => {
                return {
                    name: newName,
                    marker
                }
            }
        }
    }
    // desired outcome: player1.setName('Johnny');

    
    
    const playerCreator = (name, marker) => {
        let player = {name, marker};
        player = Object.assign(player, waver(player), nameSetter(player));
        return player;
    }
    let currentPlayer;
    const player1 = playerCreator('Player 1', 'X');
    const player2 = playerCreator('Player 2', 'O');

    function changeNames(event) {
        event.preventDefault();
        let player1name = document.querySelector('.player-1-name').value;
        let player2name = document.querySelector('.player-2-name').value;
        if (player1name) players.player1.name = players.player1.setName(player1name).name;
        if (player2name) players.player2.name = players.player2.setName(player2name).name;
        document.querySelector('.player-1-name').value = '';
        document.querySelector('.player-2-name').value = '';
        gameController.announceTurn(players.player1);

    }

    return {currentPlayer, player1, player2, changeNames};
})();


const codeRunner = (() => {
    domTranslator.printBoard();    
    gameController.makeButtons();
    gameController.makeResetBtn();
    gameController.makeNameInput();

    
    
})();

