function renderBoard(board, selector) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {
      strHTML += '<tr>'
      for (var j = 0; j < board[0].length; j++) {
        const cell = board[i][j]
        const className = `cell cell-${i}-${j}`
  
        strHTML += `<td class="${className}">${cell}</td>`
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
  
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
  }
  
  // location is an object like this - { i: 2, j: 7 }
  function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
  }
  
  function getEmptyLocation(board) {
    var emptyLocations = []
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        var currCell = board[i][j]
        if (currCell === '') {
          var emptyLocation = { i: i, j: j }
          emptyLocations.push(emptyLocation)
        }
      }
    }
    if (emptyLocations.length === 0) return
    return emptyLocations
  }
  
  function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
      newMat[i] = []
      for (var j = 0; j < mat[0].length; j++) {
        newMat[i][j] = mat[i][j]
      }
    }
    return newMat
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
  
  
  function onCellClicked(elCell, cellI, cellJ) {
    if (gBoard[cellI][cellJ] === LIFE) {
      gBoard[cellI][cellJ] = SUPER_LIFE
      elCell.innerText = gBoard[cellI][cellJ]
      blowUpNegs(cellI, cellJ)
    }
  }
  
  
  // function cellClicked(elCell, i, j) {
  //   const cell = gCinema[i][j]
  
  //   if (!cell.isSeat || cell.isBooked) return
  //   console.log('Cell clicked: ', elCell, i, j)
  
  //   // Only a single seat should be selected
  //   if (gElSelectedSeat) {
  //       gElSelectedSeat.classList.remove('selected')
  //   }
  //   elCell.classList.add('selected')
  //   gElSelectedSeat = elCell
  //   // TODO: Support Unselecting a seat
  //   showSeatDetails({ i: i, j: j })
  // }
  
  
  
  
  function createBoard() {
    var board = []
    for (let i = 0; i < 8; i++) {
      board.push([])
      for (let j = 0; j < 6; j++) {
        board[i][j] = Math.random() > 0.65 ? LIFE : ''
      }
    }
    return board
  }
  
  
  function startTimer() {
    gStartTime = Date.now()
    gTimeInterval = setInterval(updateTimer, 100)
  
  }
  
  function updateTimer() {
    var diff = Date.now() - gStartTime
    var inSeconds = (diff / 1000).toFixed(3)
    document.querySelector('.timer').innerText = inSeconds
  }
  
  function stopTimer() {
    clearInterval(gTimeInterval)
  }
  
  
  
  function cellClicked(elCell, num) {
    console.log(elCell.dataset, num);
    if (+elCell.dataset.num === gNextNum) {
        if (gNextNum === 1) startTimer()
        elCell.classList.add('clicked')
        gNextNum++
        if (gNextNum >= gSize) stopTimer()
        renderNextNum()
    }
  }
  
  
  function initGame(size = 16) {
    stopTimer()
    gSize = size
    gNums = createNums(size)
    gNextNum = 1
    renderBoard(size)
    renderNextNum()
  }
  
  
  
  
  function countNegs(rowIdx, colIdx, board) {
    var numNegs = 0
    // Neighbours loop - start
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i >= board.length) continue
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j >= board[i].length) continue
        if (i === rowIdx && j === colIdx) continue
        // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++;
        // The above line wil be used in cases there are elements that occupy a cell but we don't consider them negs
        if (board[i][j]) {
          numNegs++
        }
      }
    }
    //Neighbours loop - end
  
    return numNegs
  }
  
  
  
  function onToggleGame(elBtn) {
    if (gGameInterval) {
      clearInterval(gGameInterval)
      gGameInterval = null
      elBtn.innerText = 'Start'
    } else {
      gGameInterval = setInterval(play, GAME_FREQ)
      elBtn.innerText = 'Pause'
    }
  }
  
  
  
  
  function buildBoard() {
    const size = 10
    const board = []
  
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            gGame.foodCount++
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                gGame.foodCount--
            } else if ((i === 1 && j === 1)
                || (i === size - 2 && j === 1)
                || (i === 1 && j === size - 2)
                || (i === size - 2 && j === size - 2)) {
                board[i][j] = SUPER_FOOD
                gGame.foodCount--
            }
        }
    }
    console.log(gGame.foodCount);
    return board
  }
  
  function updateScore(diff) {
    // update model and dom
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
  
  }
  
  
  function gameOver() {
    console.log('Game Over')
    gGame.isOn = false
    renderCell(gPacman.location, EMPTY)
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    showModal(gGame.isWin)
  }
  
  function checkVictory() {
    if (!gGame.foodCount) {
        gGame.isWin = true
        gameOver()
    }
  }
  
  
  function showModal(isWin) {
    const message = isWin ? 'Victory!' : 'Game Over'
    document.querySelector('.modal h2').innerText = message
    document.querySelector('.modal').style.display = 'block'
  }
  
  
  var gElSelectedSeat = null
  
  
  function countEmptySeatsAround(cinema, rowIdx, colIdx) {
    var emptySeatsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= cinema.length) continue
  
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= cinema[0].length) continue
            if (i === rowIdx && j === colIdx) continue
  
            var currCell = cinema[i][j]
            if (currCell.isSeat && !currCell.isBooked) emptySeatsCount++
        }
    }
    return emptySeatsCount
}
  



/////

function onCellClicked(cell) {
  if (cell.innerText === '1') {
    startGame()
  }
  if (cell.classList.contains('clicked')) return

  var currNum = +cell.innerText
  if (currNum === gNextNum) {
    gNextNum++
    onRenderBoard(cell)
    checkEnd()
  } else wrongAnswer()
}


function renderTimer() {
  gPlayTime = (Date.now() - gStartTime) / 1000
  var strHTML = `${gPlayTime}`
  var elTimer = document.querySelector('.timer')
  elTimer.innerText = strHTML
}