'use strict'

var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gBoard = []
var gStartTime = 0
var gTimeInterval = 0
var gLoveCount = 3
var gIsGame = false
var gClickedCount = 0
var gCellsToClick = 0
var gGameIsOn = true

const WIN = '😎'
const NORMAL = "😄"
const LOST = "🤯"
const EMPTY = "🔲"
const MINE = "💣"
const DETONATION = "💥"
const FLAG = "🚩"
const HEART = '❤️'
const DIGITS = ["⬜️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"]

// This is called when page loads
function initGame(size = 4) {
    normalEmoji()
    stopTimer()
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

// Builds the board and reset the lives
function buildBoard() {
    heartRestart()
    gBoard = []
    gIsGame = false
    gClickedCount = 0
    gCellsToClick = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
    gGameIsOn = true
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

// Count mines around each cell 
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

// Render the board as a <table> to the page
function renderBoard(board, selector) {
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

// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    if (!gGameIsOn) {
        return
    }
    if (!gIsGame) {
        gIsGame = true
        startTimer()
        updateBoard(i, j)
    }
    const cell = gBoard[i][j]
    if (cell.isMarked || cell.isShown) {
        return
    }
    else if (cell.isMine && !cell.isMarked) {
        loseLife()
        elCell.innerText = MINE
        var ellEmoji = document.querySelector('.emoji')
        ellEmoji.innerText = LOST
        gBoard[i][j].isShown = true
        if (gLoveCount === 0) {
            isVictory(false)
            return
        }
    }
    else {
        gClickedCount++
        cell.isShown = true
        gBoard[i][j] = cell
        elCell.innerText = DIGITS[cell.minesAroundCount]
        var ellEmoji = document.querySelector('.emoji')
        ellEmoji.innerText = NORMAL
        if (cell.minesAroundCount === 0) {
            expandShown(elCell, i, j)
        }
        if (gClickedCount === gCellsToClick) {
            isVictory(true)
        }
    }
}

// Called on right click to mark a cell (suspected to be a mine) 
function cellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (!gGameIsOn) {
        return
    }
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

// Game ends when all mines are marked, or when all the other cells shown, return and show a win/lose message
function isVictory(state) {
    var ellEmoji = document.querySelector('.emoji')
        ellEmoji.innerText = WIN
    stopTimer()
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                var currElemCell = document.getElementById("myTable").rows[i].cells[j]
                currElemCell.innerText = MINE
            }
        }
    }
    var elModalBless = document.querySelector('.modal h2')
    var randColor = getRandomColor()
    elModalBless.style.color = `${randColor}`
    if (state) {
        elModalBless.innerText = `WOW! You Win! You Are The Best!`
    }
    else {
        elModalBless.innerText = `You Lost:( `
    }
    openModal()
    gGameIsOn = false
    return
}

// When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.  
function expandShown(elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue
            if ((i === rowIdx && j === colIdx) || gBoard[i][j].isShown) continue
            if (!gBoard[i][j].isMine) {
                gClickedCount++
                gBoard[i][j].isShown = true
                var currElemCell = document.getElementById("myTable").rows[i].cells[j]
                currElemCell.innerText = DIGITS[gBoard[i][j].minesAroundCount]
                if (gBoard[i][j].minesAroundCount === 0) {
                    expandShown(currElemCell, i, j)
                }
            }
        }
    }
}

// allocate mines in random location
function randMinesLocation(rowIdx, colIdx) {
    var randLocations = []
    var locationSize = 0

    while (locationSize < gLevel.MINES) {
        var currRow = getRandomInt(0, gLevel.SIZE)
        var currCol = getRandomInt(0, gLevel.SIZE)
        var currLocation = { row: currRow, col: currCol }
        if (!inLocations(currLocation, randLocations) && currRow != rowIdx && currCol != colIdx) {
            randLocations.push(currLocation)
            locationSize++
        }
    }
    return randLocations
}

// called in randMinesLocation, updateBoard, randMinesLocation and setMinesNegsCount checks 
function inLocations(currLocation, randLocations) {
    for (var i = 0; i < randLocations.length; i++) {
        if (currLocation.row === randLocations[i].row && currLocation.col === randLocations[i].col) {
            return true
        }
    }
    return false
}

// called in cellClicked, update the board after 1st click that is not a MINE
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

// called when clicked on the emoji button, restarts the board
function boardRestart() {
    initGame(gLevel.SIZE)
}

// called in buildBoard, restart the lives to 3.
function heartRestart() {
    gLoveCount = 3
    var currElemCellRow = document.getElementById("love-table").rows[0]
    for (let i = 0; i < 3; i++) {
        currElemCellRow.cells[i].innerText = HEART
    }
}

// called when clicked on a mine, decrease lives
function loseLife() {
    gLoveCount--
    var currElemCell = document.getElementById("love-table").rows[0].cells[gLoveCount]
    currElemCell.innerText = ""
}

// called in initGame, so the emoji will return to normal
function normalEmoji() {
    var ellEmoji = document.querySelector('.emoji')
    ellEmoji.innerText = NORMAL
}

// show the win/lose message for 5 seconds
function openModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    setTimeout(() => {
        elModal.style.display = 'none'
    }, 5000)
}

// start timer, update it and stop timer
function startTimer() {
    gStartTime = Date.now()
    gTimeInterval = setInterval(updateTimer, 100)
}

function updateTimer() {
    var diff = Date.now() - gStartTime
    var inSeconds = (diff / 1000).toFixed(1)
    document.querySelector('.timer').innerText = inSeconds
}

function stopTimer() {
    clearInterval(gTimeInterval)
}

// implement dark and light mode
function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
  }