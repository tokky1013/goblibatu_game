let game;

class Chessman {
    constructor(playerNum, size) {
        this.playerNum = playerNum;
        this.size = size;
        this.innerChessman = null;
    }

    setInnerChessman(chessman) {
        this.innerChessman = chessman;
    }
}

class Player {
    constructor(playerName, playerNum) {
        this.playerName = playerName;
        this.playerNum = playerNum;
        this.chessmen = [
            new Chessman(playerNum, 2),
            new Chessman(playerNum, 2),
            new Chessman(playerNum, 1),
            new Chessman(playerNum, 1),
            new Chessman(playerNum, 0),
            new Chessman(playerNum, 0),
        ];
    }

    drawChessmen() {
        const chessmanContainer = document.getElementById('chessman-container');
        while (chessmanContainer.firstChild) {
            chessmanContainer.removeChild(chessmanContainer.firstChild);
        }

        for (let i = 0; i < this.chessmen.length; i++) {
            const chessman = this.chessmen[i];
            const elem = document.createElement('div');
            elem.classList.add('chessman');
            elem.setAttribute('onclick', 'selectChessman(this);');
            elem.dataset.i = i;

            const imgElem = document.createElement('img');
            imgElem.src = './img/face.svg';
            imgElem.classList.add('size-' + chessman.size);
            imgElem.classList.add('color-' + chessman.playerNum);
            elem.appendChild(imgElem);

            chessmanContainer.appendChild(elem);
        }
    }
}

class Game {
    constructor() {
        this.players = [
            new Player('player 1', 0),
            new Player('player 2', 1),
        ];

        this.field = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        this.turn = 0;
        this.selectedChessman = null;

        this.drawField();
        this.displayInfo();
    }

    drawField() {
        for (let i = 0; i < this.field.length; i++) {
            const fieldRow = this.field[i];
            for (let j = 0; j < fieldRow.length; j++) {
                const chessman = fieldRow[j];

                const cellImg = document.getElementById('cell-img-' + i + '-' + j);
                cellImg.classList.remove(...cellImg.classList);
                if (chessman === null) {
                    cellImg.classList.add('hidden');
                } else {
                    cellImg.classList.add('color-' + chessman.playerNum);
                    cellImg.classList.add('size-' + chessman.size);
                }
            }

        }
    }

    getPlayer() {
        return this.players[this.turn % 2];
    }

    placeChessman(x, y) {
        if (this.selectedChessman === null) {
            return false;
        }
        if (this.field[y][x] !== null && this.selectedChessman.chessman.size <= this.field[y][x].size) {
            return false;
        }

        if (this.selectedChessman.i >= 0) {
            const player = this.getPlayer();
            const i = this.selectedChessman.i
            player.chessmen[i].innerChessman = this.field[y][x];
            this.field[y][x] = player.chessmen[i];
            player.chessmen.splice(i, 1);

            player.drawChessmen();
        } else {
            const innerChessman = this.field[y][x];
            this.field[y][x] = this.selectedChessman.chessman;
            this.field[this.selectedChessman.y][this.selectedChessman.x] = this.selectedChessman.chessman.innerChessman;
            this.field[y][x].innerChessman = innerChessman;
        }
        this.drawField();
        return true;
    }

    getWinner() {
        let winner = -1;
        let tempWinner;
        for (let i = 0; i < 3; i++) {
            tempWinner = this.getRowWinner(this.field[i]);
            if (tempWinner >= 0) {
                if (winner >= 0 && tempWinner != winner) {
                    return 2;
                } else {
                    winner = tempWinner;
                }
            }
            tempWinner = this.getRowWinner([this.field[0][i], this.field[1][i], this.field[2][i]]);
            if (tempWinner >= 0) {
                if (winner >= 0 && tempWinner != winner) {
                    return 2;
                } else {
                    winner = tempWinner;
                }
            }
        }
        tempWinner = this.getRowWinner([this.field[0][0], this.field[1][1], this.field[2][2]]);
        if (tempWinner >= 0) {
            if (winner >= 0 && tempWinner != winner) {
                return 2;
            } else {
                winner = tempWinner;
            }
        }
        tempWinner = this.getRowWinner([this.field[0][2], this.field[1][1], this.field[2][0]]);
        if (tempWinner >= 0) {
            if (winner >= 0 && tempWinner != winner) {
                return 2;
            } else {
                winner = tempWinner;
            }
        }
        return winner;
    }
    getRowWinner(chessmen) {
        if (chessmen[0] === null || chessmen[1] === null || chessmen[2] === null) {
            return -1;
        }
        const tempWinner = chessmen[0].playerNum;

        if (tempWinner === chessmen[1].playerNum && tempWinner === chessmen[2].playerNum) {
            return tempWinner;
        }
        return -1;
    }

    nextTurn() {
        const winner = this.getWinner();
        if(winner >= 0) {
            if(winner === 2) {
                alert('引き分けです。');
            } else {
                alert(this.players[winner].playerName + 'さんの勝利です。');
            }
            this.reset();
            return;
        }
        this.turn++;
        this.selectedChessman = null;
        this.getPlayer().drawChessmen();
        drawSelectedCell();
        this.displayInfo();
    }

    reset() {
        this.players = [
            new Player('player 1', 0),
            new Player('player 2', 1),
        ];

        this.field = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        this.turn = 0;
        this.selectedChessman = null;

        this.drawField();
        this.getPlayer().drawChessmen();
        this.displayInfo();
    }

    displayInfo() {
        document.getElementById('turn').textContent = this.turn + 1;
        document.getElementById('player-name').textContent = this.getPlayer().playerName;
        document.getElementById('player-name').classList.add('color-' + this.getPlayer().playerNum);
        document.getElementById('player-name').classList.remove('color-' + (this.getPlayer().playerNum - 1) * (-1));
    }
}

function selectChessman(elem) {
    const i = elem.dataset.i - 0;

    if (isNaN(i)) {
        const x = elem.dataset.x - 0;
        const y = elem.dataset.y - 0;

        if (game.field[y][x] === null || game.field[y][x].playerNum !== game.getPlayer().playerNum) {
            if (game.placeChessman(x, y)) {
                game.drawField();
                game.nextTurn();
            }
            return;
        }

        game.selectedChessman = {
            'chessman': game.field[y][x],
            'x': x,
            'y': y,
            'i': -1,
        };
    } else {
        game.selectedChessman = {
            'chessman': game.getPlayer().chessmen[i],
            'x': -1,
            'y': -1,
            'i': i,
        };
    }

    drawSelectedCell(elem);
}

function drawSelectedCell(elem = null) {
    const cells = document.getElementsByClassName('cell');
    const chessmen = document.getElementsByClassName('chessman');

    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('selected');
    }
    for (let i = 0; i < chessmen.length; i++) {
        chessmen[i].classList.remove('selected');
    }

    if (elem !== null) {
        elem.classList.add('selected');
    }
}

window.onload = () => {
    game = new Game();
    game.getPlayer().drawChessmen();
};