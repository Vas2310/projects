let currentPlayer = 'X';  
let board = Array(9).fill(null);  
let gameOver = false;
let mode = '';  // 'easy' or 'hard'

const cells = document.querySelectorAll('.cell');
const status = document.querySelector('#status h2');
const restartBtn = document.getElementById('restart');
const easyBtn = document.getElementById('easy');
const hardBtn = document.getElementById('hard');


restartBtn.addEventListener('click', () => {
  if (mode !== '') startGame(mode);
});

easyBtn.addEventListener('click', () => startGame('easy'));
hardBtn.addEventListener('click', () => startGame('hard'));


function startGame(selectedMode) {
  mode = selectedMode;
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('win');
  });
  status.textContent = "your turn";
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      if(board[a]==='X')
      {
        status.textContent = `You won`;
      }
      if(board [a]==='O')
      {
        status.textContent = `computer win`;
      }
      cells[a].classList.add('win');
      cells[b].classList.add('win');
      cells[c].classList.add('win');
      return;
    }
  }

  if (board.every(cell => cell !== null)) {
    gameOver = true;
    status.textContent = "It's a draw!";
  }
}

function handleClick(event) {
  if (gameOver || mode === '') return; 

  const index = event.target.getAttribute('data-index');
  if (!board[index]) {
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    checkWinner();
    if (!gameOver) {
      currentPlayer = 'O';
      status.textContent = "Computer's turn";
      setTimeout(computerMove, 500);
    }
  }
}

function getWinningMove(board, player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of winningCombinations) {
    if (board[a] === player && board[b] === player && board[c] === null) return c;
    if (board[a] === player && board[c] === player && board[b] === null) return b;
    if (board[b] === player && board[c] === player && board[a] === null) return a;
  }
  return null;
}

function computerMove() {
  if (gameOver) return;

  let move;

  if (mode === 'easy') {
    // Easy mode: random move
    let emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else if (mode === 'hard') {
    // Hard mode: try to win, then block, then random
    move = getWinningMove(board, 'O');  // Try to win
    if (move === null) {
      move = getWinningMove(board, 'X');  // Block player
    }
    if (move === null) {
      let emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }

  if (move !== null) {
    board[move] = 'O';
    cells[move].textContent = 'O';
    checkWinner();
    if (!gameOver) {
      currentPlayer = 'X';
      status.textContent = "your turn";
    }
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
