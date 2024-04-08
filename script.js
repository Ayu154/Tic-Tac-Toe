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
  const emptyCells = [...cells].filter(cell => cell.innerText === '');
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const cell = emptyCells[randomIndex];
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
