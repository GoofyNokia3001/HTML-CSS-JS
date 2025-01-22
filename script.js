document.addEventListener('DOMContentLoaded', function () {
    const classX = 'x';
    const classO = 'circle';

    const win_rule = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const all_cell = document.querySelectorAll('.cell');
    const result_window = document.getElementById('result-box');
    const result_info = document.querySelector('.result-info');
    const restart_btn = document.getElementById('restart-btn');
    const display_player = document.querySelector('.display');
    const undo_btn = document.getElementById('undo-btn');
    let playerO;
    let playerXScore = localStorage.getItem('playerXScore') || 0;
    let playerOScore = localStorage.getItem('playerOScore') || 0;
    const playerXScoreElement = document.getElementById('playerXScore');
    const playerOScoreElement = document.getElementById('playerOScore');
    const restart_score = document.getElementById('restart-score');
    let gameEnded = false; //Value to check if game is ended (Klim)
    let moveHistory = []; //History for undo button (Klim)

    start();

    function start() {
        document.body.style.backgroundColor = "#1c2c1a";
        gameEnded = false;
        playerO = false;
        moveHistory = [];
        undo_btn.disabled = false;
        all_cell.forEach(cell => {
            cell.classList.remove(classX);
            cell.classList.remove(classO);
            cell.classList.remove('winning-cell');
            cell.style.transition = 'background-color 0.4s ease-in-out';
            cell.removeEventListener('click', clickCell);
            cell.addEventListener('click', clickCell, { once: true });
        });
        result_window.classList.remove('show');
        result_window.style.transition = 'opacity 0.4s ease-in-out';
        updateScoreDisplay();
    }

    function clickCell(click) {
        if (gameEnded) {
            return;
        }

        const cell = click.target;
        const active_player = playerO ? classO : classX;
        cell_active(cell, active_player);

        moveHistory.push({ cell, player: active_player });

        if (check_win(active_player)) {
            gameEnded = true;
            end_game(false, active_player);
        } else if (not_ended()) {
            gameEnded = true;
            end_game(true, active_player);
        } else {
            change_player();
        }
    }

    function undoLastMove() {
        if (moveHistory.length > 0) {
            const lastMove = moveHistory.pop();
            lastMove.cell.classList.remove(lastMove.player);
            lastMove.cell.style.transition = 'background-color 0.4s ease-in-out'; 
            lastMove.cell.removeEventListener('click', clickCell);
            lastMove.cell.addEventListener('click', clickCell, { once: true });
            gameEnded = false;
            change_player(true); 
        }
    }
    
    

    function check_win(active_player) {
        return win_rule.some(rule => {
            return rule.every(index => {
                return all_cell[index].classList.contains(active_player);
            });
        });
    }

    function end_game(not_ended, active_player) {
        if (not_ended) {
            result_info.innerText = "Neizšķirts!";
            undo_btn.disabled = true; //When tie button is disabled (Klim)
        } else {
            const winningPlayer = playerO ? "O" : "X";
            const winningCombination = getWinningCombination(active_player);
            highlightWinningCombination(winningCombination);
            updateScores(winningPlayer);
            result_info.innerText = `Spēlētājs ${winningPlayer} uzvarēja! ${winningPlayer === 'X' ? playerXScore : playerOScore} - ${winningPlayer === 'O' ? playerXScore : playerOScore}`;
            undo_btn.disabled = true; //When game ended button is disabled (Klim) 
        }
    
        setTimeout(function () {
            result_window.classList.add('show');
            updateScoreDisplay();
        }, 1500);
    }
    

    function getWinningCombination(active_player) {
        return win_rule.find(rule => {
            return rule.every(index => {
                return all_cell[index].classList.contains(active_player);
            });
        });
    }

    function highlightWinningCombination(winningCombination) {
        if (winningCombination) {
            winningCombination.forEach(index => {
                const cell = all_cell[index];
                cell.classList.add('winning-cell');
                cell.style.transition = 'background-color 0.4s ease-in-out';
            });
        }
    }
    //LocalStorage values so when i reload page values are saved (Klim)
    function updateScores(winningPlayer) {
        if (winningPlayer === "X") {
            playerXScore++;
            localStorage.setItem('playerXScore', playerXScore);
        } else {
            playerOScore++;
            localStorage.setItem('playerOScore', playerOScore);
        }
    }

    function updateScoreDisplay() {
        playerXScoreElement.innerText = `Spēlētāja X punkti: ${playerXScore}`;
        playerOScoreElement.innerText = `Spēlētāja O punkti: ${playerOScore}`;
    }

    function not_ended() {
        return [...all_cell].every(cell => {
            return cell.classList.contains(classX) || cell.classList.contains(classO);
        });
    }

    function cell_active(cell, active_player) {
        cell.classList.add(active_player);
    }

    function change_player(transition = true) {
        playerO = !playerO;
        display_player.innerText = `${playerO ? "O" : "X"}`;
    
        if (transition) {
            const startColor = playerO ? "#1c2c1a" : "#1a252c";
            const endColor = playerO ? "#1a252c" : "#1c2c1a";
    
            document.body.style.transition = 'background-color 0.4s ease-in-out';
            document.body.style.backgroundColor = startColor;
            //TimeOut to backgroundColor to be smooth (Klim)
            setTimeout(() => {
                document.body.style.backgroundColor = endColor;
            }, 50);
        }
    }
    

    restart_btn.addEventListener('click', start);

    restart_score.addEventListener('click', function () {
        start();
        localStorage.setItem('playerXScore', 0);
        localStorage.setItem('playerOScore', 0);
        playerXScore = 0;
        playerOScore = 0;
        updateScoreDisplay();
    });

    undo_btn.addEventListener('click', undoLastMove);
    //This button calling function when clicked (Klim)
});
