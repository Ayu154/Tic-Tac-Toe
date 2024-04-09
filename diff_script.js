document.addEventListener("DOMContentLoaded", function() {
  const board = document.getElementById("board");
  const cells = document.querySelectorAll(".cell");
  const result = document.getElementById("result");
  const restartBtn = document.getElementById("restartBtn");

  let currentPlayer = "X";
  let gameActive = true;

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  cells.forEach(cell => cell.addEventListener("click", handleClick));
  restartBtn.addEventListener("click", restartGame);

  function handleClick() {
    const cellIndex = parseInt(this.getAttribute("data-cell-index"));

    if (cells[cellIndex].innerText === "" && gameActive) {
      cells[cellIndex].innerText = currentPlayer;
      if (checkWin(currentPlayer)) {
        gameActive = false;
        result.innerText = `${currentPlayer} wins!`;
      } else if (checkDraw()) {
        gameActive = false;
        result.innerText = "It's a draw!";
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (currentPlayer === "O") {
          setTimeout(botMove, 500); // Bot's move with delay
        }
      }
    }
  }

  function checkWin(player) {
    return winPatterns.some(pattern => {
      return pattern.every(index => {
        return cells[index].innerText === player;
      });
    });
  }

  function checkDraw() {
    return [...cells].every(cell => {
      return cell.innerText !== "";
    });
  }

  function botMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerText === "") {
        cells[i].innerText = currentPlayer;
        const score = minimax(cells, 0, false);
        cells[i].innerText = "";

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    cells[move].innerText = currentPlayer;

    if (checkWin(currentPlayer)) {
      gameActive = false;
      result.innerText = `${currentPlayer} wins!`;
    } else if (checkDraw()) {
      gameActive = false;
      result.innerText = "It's a draw!";
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWin("X")) {
      return -10;
    } else if (checkWin("O")) {
      return 10;
    } else if (checkDraw()) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i].innerText === "") {
          board[i].innerText = "O";
          const score = minimax(board, depth + 1, false);
          board[i].innerText = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i].innerText === "") {
          board[i].innerText = "X";
          const score = minimax(board, depth + 1, true);
          board[i].innerText = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function restartGame() {
    cells.forEach(cell => {
      cell.innerText = "";
    });
    result.innerText = "";
    currentPlayer = "X";
    gameActive = true;
  }
});
