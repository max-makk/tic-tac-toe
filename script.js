const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return {
    getName,
    getMark,
  };
};

const gameBoard = (function () {
  let board = [];
  for (let i = 0; i < 9; i++) {
    board.push(i);
  }
  const checkBoard = function () {
    if (
      (board[0] === board[1] && board[1] === board[2]) ||
      (board[3] === board[4] && board[4] === board[5]) ||
      (board[6] === board[7] && board[7] === board[8]) ||
      (board[0] === board[3] && board[3] === board[6]) ||
      (board[1] === board[4] && board[4] === board[7]) ||
      (board[2] === board[5] && board[5] === board[8]) ||
      (board[0] === board[4] && board[4] === board[8]) ||
      (board[2] === board[4] && board[4] === board[6])
    ) {
      displayController.win();
    } else {
      let copy = board.filter((el) => {
        return typeof el !== "number";
      });
      if (copy.length === 9) {
        displayController.draw();
      }
    }
  };

  return {
    board,
    checkBoard,
  };
})();

const displayController = (function () {
  const start = document.querySelector(".start");
  const displayWinner = document.querySelector(".result");
  const td = document.querySelectorAll("td");
  const firstPlayer = document.querySelector("#player1");
  const secondPlayer = document.querySelector("#player2");
  let playerOne;
  let playerTwo;
  let gameStart;

  let mark;
  const init = () => {
    playerOne = Player(firstPlayer.value, "x");
    playerTwo = Player(secondPlayer.value, "o");
    mark = playerOne.getMark();
    firstPlayer.classList.add("current");
    secondPlayer.classList.remove("current");
  };

  td.forEach((el) => {
    el.addEventListener("click", function (e) {
      if (playerOne === undefined || gameStart === false) {
        return;
      }
      if (
        gameBoard.board[e.target.id] === "x" ||
        gameBoard.board[e.target.id] === "o"
      ) {
        return;
      }
      gameBoard.board[e.target.id] = mark;
      e.target.classList.add(mark);
      if (mark === "x") {
        firstPlayer.classList.toggle("current");
        secondPlayer.classList.toggle("current");
        mark = "o";
      } else {
        firstPlayer.classList.toggle("current");
        secondPlayer.classList.toggle("current");
        mark = "x";
      }
      gameBoard.checkBoard();
    });
  });

  start.addEventListener("click", function () {
    gameStart = true;
    init();
    displayWinner.style.display = "none";
  });

  const clearTable = function () {
    gameStart = false;
    td.forEach((el) => {
      el.classList.remove("x");
      el.classList.remove("o");
    });
    for (let i = 0; i < 9; i++) {
      gameBoard.board[i] = i;
    }
    firstPlayer.classList.remove("current");
    secondPlayer.classList.remove("current");
  };

  const win = function () {
    clearTable();
    if (mark === "o") {
      displayWinner.style.display = "block";
      displayWinner.innerHTML = playerOne.getName() + "</br>WIN";
    } else {
      displayWinner.style.display = "block";
      displayWinner.innerHTML = playerTwo.getName() + "</br>WIN";
    }
  };

  const draw = function () {
    clearTable();
    displayWinner.style.display = "block";
    displayWinner.textContent = "DRAW";
  };
  return {
    init,
    win,
    draw,
  };
})();
