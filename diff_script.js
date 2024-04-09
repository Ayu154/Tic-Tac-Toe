const HUMAN_PLAYER = 'X';
const BOT_PLAYER = 'O';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart-btn');
const statusMessage = document.getElementById('status');

let currentPlayer = HUMAN_PLAYER;
let gameEnded = false;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  currentPlayer = HUMAN_PLAYER;
  gameEnded = false;
  cells.forEach(cell => {
    cell.innerText = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  statusMessage.innerText = '';
  if (currentPlayer === BOT_PLAYER) {
    botMove();
  }
}

function handleClick(e) {
  const cell = e.target;
  if (gameEnded || cell.innerText !== '') return;
  cell.innerText = currentPlayer;
  if (checkWin(currentPlayer)) {
    endGame(`${currentPlayer} Wins!`);
  } else if (isDraw()) {
    endGame("It's a Draw!");
  } else {
    currentPlayer = currentPlayer === HUMAN_PLAYER ? BOT_PLAYER : HUMAN_PLAYER;
    setBoardHoverClass();
    if (currentPlayer === BOT_PLAYER) {
      botMove();
    }
  }
}

function botMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerText === '') {
      cells[i].innerText = BOT_PLAYER;
      let score = minimax(cells, 0, false);
      cells[i].innerText = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  const cell = cells[move];
  cell.innerText = BOT_PLAYER;
  if (checkWin(BOT_PLAYER)) {
    endGame(`${BOT_PLAYER} Wins!`);
  } else if (isDraw()) {
    endGame("It's a Draw!");
  } else {
    currentPlayer = HUMAN_PLAYER;
    setBoardHoverClass();
  }
}

function endGame(message) {
  statusMessage.innerText = message;
  gameEnded = true;
}

function setBoardHoverClass() {
  board.classList.remove(HUMAN_PLAYER);
  board.classList.remove(BOT_PLAYER);
  board.classList.add(currentPlayer);
}

function checkWin(player) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].innerText === player;
    });
  });
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.innerText === HUMAN_PLAYER || cell.innerText === BOT_PLAYER;
  });
}

function minimax(board, depth, isMaximizing) {
  if (checkWin(BOT_PLAYER)) {
    return 10 - depth;
  } else if (checkWin(HUMAN_PLAYER)) {
    return depth - 10;
  } else if (isDraw()) {
    return 0;
  }

  if (depth >= 4) { // Adjust the depth limit to optimize performance
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i].innerText === '') {
        board[i].innerText = BOT_PLAYER;
        let score = minimax(board, depth + 1, false);
        board[i].innerText = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i].innerText === '') {
        board[i].innerText = HUMAN_PLAYER;
        let score = minimax(board, depth + 1, true);
        board[i].innerText = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
