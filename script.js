const Player = (name, mark) => {
  const setMark = (m) => mark = m
  const setName = (n) => name = n
  const getName = () => name
  const getMark = () => mark
  return {setName,getMark,setMark,getName}
}

const gameBoard = (() => {
  const board = new Array(9).fill('-')
  const addMark = (i,m) => board[i] = m
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const checkWin = (b) => {
    const cur = displayController.getCurrent()
    winConditions.forEach(el => {
      if(b[el[0]] === cur &&
         b[el[1]] === cur &&
         b[el[2]] === cur) {
        console.log(cur + ' win')
        return 10
      } else if (!b.includes('-')) {
        console.log('tie')
        return 0
      } else {
        return -10
      }
    })
  }
  const getBoard = () => board
  return {
    checkWin,
    addMark,
    getBoard
  }
})()

const displayController = (() => {
//  alert('Enter your name or play agains the computer (enter AI)')

  const start = document.querySelector('.start')
  const name1 = document.querySelector('#player-1')
  const name2 = document.querySelector('#player-2')
  const xo = document.querySelector('#switch')

  xo.addEventListener('change', () => cur = cur === 'o' ? 'x' : 'o')

  let ai = false
  let gameStarted = false
  let cur = 'o'
  const leftPlayer = Player(name1.value, cur)
  const rightPlayer = Player(name2.value, cur === 'o' ? 'x' : 'o')

  start.addEventListener('click', function() {
    leftPlayer.setName(name1.value)
    rightPlayer.setName(name2.value)
    leftPlayer.setMark(cur)
    rightPlayer.setMark(cur === 'o' ? 'x' : 'o')
    gameStarted = true
    xo.disabled = true
    name1.disabled = true
    name2.disabled = true
    if(leftPlayer.getName().toLowerCase() === 'ai' ||
    rightPlayer.getName().toLowerCase() === 'ai') {
      ai = true
    } else {
      ai = false
    }
  })

  const cells = document.querySelectorAll('td')
  cells.forEach(el => {
    el.addEventListener('click', (e) => {
      if(!gameStarted) return
      if(gameBoard.getBoard()[+e.target.id] !== '-') {
          return
        }
      if(cur === 'x') {
        gameBoard.addMark(+e.target.id, 'o')
        e.target.classList.add('o')
        cur = 'o'
      } else {
        gameBoard.addMark(+e.target.id, 'x')
        e.target.classList.add('x')
        cur = 'x'
        if(ai) {
          cur = 'o'
          const id = findBestMove(gameBoard.getBoard())
          gameBoard.addMark(+id, 'o')
          document.getElementById(''+id).classList.add('o')
          console.log(id)
        }
      }
      const res = gameBoard.checkWin(gameBoard.getBoard())
      if(res === 10) {
        console.log(cur, ' win')
      }

    })
  })
  const getCurrent = () => cur
  return {
    leftPlayer,rightPlayer,getCurrent
  }
})()


function isMovesLeft(board){
    for (var i = 0; i<board.length; i++){
        if (board[i] =='-'){
            return 'true';
        }
    }
return 'false';
} 



function evaluate(){
  const opponent = displayController.getCurrent() === 'x' ? 'o' : 'x'
  const player = displayController.getCurrent()
  const board = gameBoard.getBoard()
    for (var i = 0; i < board.length; i += 3) {
        if (board[i] === board[i + 1] && board[i + 1] === board[i + 2]) {
            if (board[i] == player){
                return +10;  
            }
            else if(board[i]== opponent){
                return -10;
            } 
        }
    }
    for (var j = 0; j < board.length; j++) {
        if (board[j] === board[j + 3] && board[j + 3] === board[j + 6]) {
            if (board[j] == player){
                return +10;  
            }
            else if(board[j] == opponent){
                return -10;
            } 
        }
    }


  if ((board[4]==board[0] && board[4]==board[8]) || (board[4]==board[2] && board[4]==board[6])) {
    if (board[4]==player){
        return +10;
    }
    else if (board[4]==opponent){
        return -10;
    }
 }

return 0;
}



function minimax(board, depth, isMax){
  const player = displayController.getCurrent()
  const opponent = displayController.getCurrent() === 'x' ? 'o' : 'x'
    var score = evaluate(board);

    if (score == 10){
        return score;
    }

    if (score == -10){
        return score;
    }

    if (isMovesLeft(board) =="false"){
        return 0;
    }

    if (isMax == "true"){
        var best = -1000;

        for (var i = 0; i< board.length; i++){
            if (board[i]=='-'){
                board.splice(i, 1, player);
                var value = minimax(board, depth+1, "false");
                best = Math.max(best, value);

                board.splice(i, 1, "-");
            }
         }
         return best;  
     }

    else if (isMax == 'false'){
        var best = 1000;
        for (var i = 0; i<board.length; i++){
            if (board[i]=='-'){
             board.splice(i, 1, opponent);
             var value = minimax(board, depth+1, "true");
             best = Math.min(best, value);

             board.splice(i, 1, "-");
            }
         }
        return best;
      }
}

function findBestMove(board){
  const player = displayController.getCurrent()
    var bestVal = -1000;
    var bestMove= -1;

    for (var i = 0; i<board.length; i++){
        if (board[i]=='-'){
            board.splice(i, 1, player);
            var moveVal = minimax(board, 0, "false");

            board.splice(i, 1, "-");

            if (moveVal > bestVal)
            {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove
}


/*
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

*/
