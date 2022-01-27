const Player = (name, mark) => {
  const setMark = (m) => (mark = m)
  const setName = (n) => (name = n)
  const getName = () => name
  const getMark = () => mark
  return { setName, getMark, setMark, getName }
}

const gameBoard = (() => {
  const board = new Array(9).fill('-')
  const addMark = (i, m) => (board[i] = m)
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const checkBoard = (b) => {
    let result = false
    const current = displayController.getCurrent()
    if (!b.includes('-')) {
      result = 'tie'
    }
    winConditions.forEach((el) => {
      if (
        b[el[0]] === current &&
        b[el[1]] === current &&
        b[el[2]] === current
      ) {
        result = current
      }
    })
    return result
  }
  const getBoard = () => board
  const clearBoard = () => board.fill('-')
  return {
    checkBoard,
    addMark,
    getBoard,
    clearBoard,
  }
})()

const displayController = (() => {
  const cells = document.querySelectorAll('td')
  const start = document.querySelector('.start')
  const name1 = document.querySelector('#player-1')
  const name2 = document.querySelector('#player-2')
  const xo = document.querySelector('#switch')
  const displayAlert = document.querySelector('.display-alert')
  const alertMessage = document.querySelector('.alert-text')
  const ok = document.querySelector('.ok')
  const overlay = document.querySelector('.overlay')

  let ai = false
  let gameStarted = false
  let current = '?'

  const leftPlayer = Player(name1.value, '?')
  const rightPlayer = Player(name2.value, '?')

  start.addEventListener('click', function () {
    current = 'o'
    if (xo.checked) {
      current = 'x'
    }
    clearCells()
    leftPlayer.setName(name1.value)
    rightPlayer.setName(name2.value)
    leftPlayer.setMark(current === 'o' ? 'x' : 'o')
    rightPlayer.setMark(current === 'x' ? 'o' : 'x')
    gameStarted = true
    xo.disabled = true
    name1.disabled = true
    name2.disabled = true
    if (
      leftPlayer.getName().toLowerCase() === 'ai' ||
      rightPlayer.getName().toLowerCase() === 'ai'
    ) {
      if (leftPlayer.getName().toLowerCase() === 'ai') {
        aiMove()
      }
      ai = true
    } else {
      ai = false
    }
  })

  cells.forEach((el) => {
    el.addEventListener('click', (e) => {
      if (!gameStarted) return
      if (gameBoard.getBoard()[+e.target.id] !== '-') {
        return
      }
      if (current === 'x') {
        gameBoard.addMark(+e.target.id, 'o')
        e.target.classList.add('o')
        current = 'o'
        if (checkForWinner()) {
          return
        }
        if (ai) {
          aiMove()
          if (checkForWinner()) {
            return
          }
        }
      } else {
        gameBoard.addMark(+e.target.id, 'x')
        e.target.classList.add('x')
        current = 'x'
        if (checkForWinner()) {
          return
        }
        if (ai) {
          aiMove()
          if (checkForWinner()) {
            return
          }
        }
      }
    })
  })

  function aiMove() {
    current = current === 'x' ? 'o' : 'x'
    const id = optimalMove.findBestMove(gameBoard.getBoard())
    gameBoard.addMark(+id, current)
    setTimeout(() => {
      document.getElementById('' + id).classList.add(current)
    }, 100)
  }

  function checkForWinner() {
    const result = gameBoard.checkBoard(gameBoard.getBoard())
    if (result === current) {
      if (leftPlayer.getMark() === current) {
        alertMessage.textContent = leftPlayer.getName() + ' WINS'
      } else {
        alertMessage.textContent = rightPlayer.getName() + ' WINS'
      }
      displayAlert.classList.toggle('closed')
      overlay.classList.toggle('closed')
      return true
    } else if (result === 'tie') {
      alertMessage.textContent = 'TIE'
      displayAlert.classList.toggle('closed')
      overlay.classList.toggle('closed')
      return true
    }
  }

  ok.addEventListener('click', function () {
    clearCells()
    gameStarted = false
    xo.disabled = false
    name1.disabled = false
    name2.disabled = false
    displayAlert.classList.toggle('closed')
    overlay.classList.toggle('closed')
  })

  function clearCells() {
    cells.forEach((el) => {
      el.classList.remove('x')
      el.classList.remove('o')
    })
    gameBoard.clearBoard()
  }
  alertMessage.textContent =
    "To play against the computer, enter 'AI' in one of the input fields."
  displayAlert.classList.toggle('closed')
  overlay.classList.toggle('closed')

  const getCurrent = () => current
  return {
    leftPlayer,
    rightPlayer,
    getCurrent,
  }
})()

const optimalMove = (() => {
  function isMovesLeft(board) {
    for (let i = 0; i < board.length; i++) {
      if (board[i] == '-') {
        return true
      }
    }
    return false
  }

  function evaluate() {
    const player = displayController.getCurrent()
    const opponent = displayController.getCurrent() === 'x' ? 'o' : 'x'
    const board = gameBoard.getBoard()
    for (let i = 0; i < board.length; i += 3) {
      if (board[i] === board[i + 1] && board[i + 1] === board[i + 2]) {
        if (board[i] == player) {
          return +10
        } else if (board[i] == opponent) {
          return -10
        }
      }
    }
    for (let j = 0; j < board.length; j++) {
      if (board[j] === board[j + 3] && board[j + 3] === board[j + 6]) {
        if (board[j] == player) {
          return +10
        } else if (board[j] == opponent) {
          return -10
        }
      }
    }

    if (
      (board[4] == board[0] && board[4] == board[8]) ||
      (board[4] == board[2] && board[4] == board[6])
    ) {
      if (board[4] == player) {
        return +10
      } else if (board[4] == opponent) {
        return -10
      }
    }

    return 0
  }

  function minimax(board, depth, isMax) {
    const player = displayController.getCurrent()
    const opponent = displayController.getCurrent() === 'x' ? 'o' : 'x'
    const score = evaluate(board)

    if (score == 10) {
      return score
    }

    if (score == -10) {
      return score
    }

    if (!isMovesLeft(board)) {
      return 0
    }

    if (isMax) {
      let best = -1000

      for (let i = 0; i < board.length; i++) {
        if (board[i] == '-') {
          board.splice(i, 1, player)
          const value = minimax(board, depth + 1, false)
          best = Math.max(best, value)
          board.splice(i, 1, '-')
        }
      }
      return best
    } else if (!isMax) {
      let best = 1000
      for (let i = 0; i < board.length; i++) {
        if (board[i] == '-') {
          board.splice(i, 1, opponent)
          const value = minimax(board, depth + 1, true)
          best = Math.min(best, value)
          board.splice(i, 1, '-')
        }
      }
      return best
    }
  }

  function findBestMove(board) {
    const player = displayController.getCurrent()
    let bestVal = -1000
    let bestMove = -1

    for (let i = 0; i < board.length; i++) {
      if (board[i] == '-') {
        board.splice(i, 1, player)
        const moveVal = minimax(board, 0, false)
        board.splice(i, 1, '-')
        if (moveVal > bestVal) {
          bestMove = i
          bestVal = moveVal
        }
      }
    }
    return bestMove
  }

  return {
    findBestMove,
  }
})()

