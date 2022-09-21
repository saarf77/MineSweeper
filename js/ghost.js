'use strict'

const GHOST = '&#9781'
var gGhosts
var gIntervalGhosts
var gDeadGhosts


function createGhost(board) {

    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor(),
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = []
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // console.log('move')
    // figure out moveDiff, nextLocation, nextCell
    const moveDiff = getMoveDiff()
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    // console.log('nextLocation', nextLocation)

    const nextCellContent = gBoard[nextLocation.i][nextLocation.j]
    // console.log('nextCellContent', nextCellContent)
    // console.log('nextCell', nextCell)
    // return if cannot move
    if (nextCellContent === WALL) return
    if (nextCellContent === GHOST) return

    // hitting a pacman? call gameOver
    if (nextCellContent === PACMAN) {
        gameOver()
        return
    }
    if (nextCellContent === SUPER_PACMAN) {
        eatGhost(nextLocation)
        return
    }

    // moving from current location:
    // update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location:
    // update the model (save cell contents so we can restore later)
    ghost.location = nextLocation
    ghost.currCellContent = nextCellContent
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    const color = gPacman.isSuper ? 'blue' : ghost.color
    return `<span style="color: ${color}">${GHOST}</span>`
}

function eatGhost(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        if (ghost.location.i === location.i &&
            ghost.location.j === location.j) {
            if (ghost.currCellContent === FOOD) {
                ghost.currCellContent = EMPTY
                gGame.foodCount--
                updateScore(1)
                checkVictory()
            } else if (ghost.currCellContent === CHERRY) {
                updateScore(10)
            }
            var deadGhost = gGhosts.splice(i, 1)[0]
            gDeadGhosts.push(deadGhost)
            // var deadGhost = gGhosts.splice(i, 1)
            // gDeadGhosts.push(...deadGhost)
            return
        }
    }
}

function reviveGhosts() {
    // for (var i = 0; i < gDeadGhosts.length; i++) {
    //     var ghost = gDeadGhosts[i]
    //     gGhosts.push(ghost)
    //     renderCell(ghost.location, getGhostHTML(ghost))
    // }
    // console.log('gGhosts', gGhosts)
    // console.log('gDeadGhosts', gDeadGhosts)
    // gDeadGhosts = []

    gGhosts = gGhosts.concat(gDeadGhosts)
    gDeadGhosts = []
}