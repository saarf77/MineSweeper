var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gBoard = []
var gStartTime = 0
gTimeInterval = 0
var gIsGame = false

// const MINE = '<img src="img/mine.png">'
const WON = "😄";
const LOST = "😵";
const EMPTY = "🔲";
const MINE = "💣";
const DETONATION = "💥";
const FLAG = "🚩";
const DIGITS = ["⬜️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];


function initGame(size = 4) {
    gLevel.SIZE = size
    switch (size) {
        case 4:
            gLevel.MINES = 2
            break;
        case 8:
            gLevel.MINES = 14
            break;
        case 12:
            gLevel.MINES = 32
            break;
        default:
            break;
    }
    buildBoard()
    renderBoard(gBoard, ".board")
}

function buildBoard() {
    gBoard = []
    gIsGame = false
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell
                currCell = { minesAroundCount: 4, isShown: false, isMine: false, isMarked: false }
                gBoard[i][j] = currCell
            }
        }
    console.table(gBoard);
    // return gBoard
}



function setMinesNegsCount(rowIdx, colIdx, randLocations) {
    var numNegs = 0
    // Neighbours loop - start
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue
            if (i === rowIdx && j === colIdx) continue
            var currLocation = { row: i, col: j }
            if (inLocations(currLocation, randLocations)) {
                numNegs++
            }
        }
    }
    //Neighbours loop - end
    return numNegs
}


function renderBoard(board,selector) {
    var strHTML = ``
    for (let i = 0; i < board.length; i++) {
      strHTML += `<tr>`
      for (let j = 0; j < board[0].length; j++) {
        var currCell = board[i][j]
        var className = currCell ? 'occupied' : ''
        // strHTML += `<td class="${className}">${cell}</td>`
          strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})" 
        oncontextmenu="cellMarked(this,${i},${j}), event.preventDefault();">${""}</td>`
      }
      strHTML += `</tr>`
    }
    var elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML
  }



function cellClicked(elCell, i, j) {
    if (!gIsGame) {
        gIsGame = true
        startTimer()
        updateBoard(i, j)
    }

    const cell = gBoard[i][j]

    if (cell.isMine && !cell.isMarked) {
        stopTimer()
        console.log('Game over');
        return
    }
    else if (cell.isMarked || cell.isShown) {
        return
    }
    else {
        cell.isShown = true
        gBoard[i][j] = cell
        elCell.innerText = DIGITS[cell.minesAroundCount]
        expandShown(elCell, i, j)
    }
}


function cellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isShown) {
    return
}
else if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerText = ''
}
else {
    cell.isMarked = true
    elCell.innerText = FLAG
}
gBoard[i][j] = cell

}

function checkGameOver() {

}
function expandShown(elCell, i, j) {

}

function randMinesLocation(rowIdx, colIdx) {
    var randLocations = []
    var locationSize = 0

    while (locationSize < gLevel.MINES) {
        var currRow = getRandomInt(0, gLevel.SIZE)
        var currCol = getRandomInt(0, gLevel.SIZE)
        var currLocation = { row: currRow, col: currCol }
        if (!randLocations.includes(currLocation) && currRow!= rowIdx && currCol != colIdx) {
            randLocations.push(currLocation)
            locationSize++
        }
    }
    return randLocations
}



function inLocations(currLocation, randLocations) {
    for (var i = 0; i < randLocations.length; i++) {
        if (currLocation.row === randLocations[i].row && currLocation.col === randLocations[i].col) {
            return true
        }
    }
    return false
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
  
function updateBoard(rowIdx, colIdx) {
    var randLocations = randMinesLocation(rowIdx, colIdx)

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currLocation = { row: i, col: j }
            var currCell
            if (inLocations(currLocation, randLocations)) {
                currCell = { minesAroundCount: 0, isShown: false, isMine: true, isMarked: false }
            }
            else {
                currCell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
            }
            currCell.minesAroundCount = setMinesNegsCount(i, j, randLocations)
            gBoard[i][j] = currCell
        }
    }
    console.table(gBoard);
}



function boardRestart() {
    initGame(gLevel.SIZE)
}


