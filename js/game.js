'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🍔'
const CHERRY = '🍒'

const gGame = {
    score: 0,
    isOn: false,
    isWin: false,
    foodCount: 0
}

var gBoard
var gCherryInterval


function onInit() {
    // Model:
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)
    gDeadGhosts = []

    gGame.score = 0
    gGame.isWin = false
    gGame.foodCount = 0
    gGame.isOn = true

    // Dom
    renderBoard(gBoard, '.board-container')

    document.querySelector('.modal').style.display = 'none'
    document.querySelector('h2 span').innerText = gGame.score

    gCherryInterval = setInterval(createCherry, 5000)
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

function createCherry() {
    const emptyPos = getEmptyPos(gBoard)
    if (!emptyPos) return
    //Model
    gBoard[emptyPos.i][emptyPos.j] = CHERRY
    //DOM
    renderCell(emptyPos, CHERRY)
}

function getEmptyPos(board) {
    const emptyPoses = []
    for (var i = 1; i < board.length - 1; i++) {
        for (var j = 1; j < board[0].length - 1; j++) {
            const currCell = board[i][j]
            if (currCell === EMPTY) {
                emptyPoses.push({ i: i, j: j })
            }
        }
    }

    if (!emptyPoses.length) return null
    const randIdx = getRandomInt(0, emptyPoses.length)
    return emptyPoses[randIdx]
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