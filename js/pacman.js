'use strict'

const PACMAN = '<img src="img/pacman.png">'
const SUPER_PACMAN = '<img src="img/superpacman.png">'
var gPacman
var gPacmanDegrees

function createPacman(board) {
    // initialize gPacman...
    gPacman = {
        location: {
            i: 6,
            j: 7
        },
        isSuper: false
    }
    gPacmanDegrees = '0deg'
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    gGame.foodCount--
}

function onMovePacman(ev) {
    if (!gGame.isOn) return

    const nextLocation = getNextLocation(ev)
    if (!nextLocation) return

    const nextCellContent = gBoard[nextLocation.i][nextLocation.j]
    // return if cannot move
    if (nextCellContent === WALL) return
    // hitting a ghost? call gameOver
    if (nextCellContent === GHOST) {
        if (gPacman.isSuper) {
            eatGhost(nextLocation)
        } else {
            gameOver()
            return
        }
    } else if (nextCellContent === FOOD) {
        updateScore(1)
        gGame.foodCount--
        checkVictory()

        // console.log(gGame.foodCount);
    } else if (nextCellContent === SUPER_FOOD) {
        if (gPacman.isSuper) return
        gPacman.isSuper = true
        setTimeout(() => {
            gPacman.isSuper = false
            renderCell(gPacman.location, PACMAN)
            document.querySelector('img').style.rotate = gPacmanDegrees
            reviveGhosts()
        }, 5000)
    } else if (nextCellContent === CHERRY) {
        updateScore(10)
    }

    // moving from current location:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)
    // Move the pacman to new location:
    // update the model
    gPacman.location = nextLocation
    const pacmanImg = gPacman.isSuper ? SUPER_PACMAN : PACMAN
    gBoard[gPacman.location.i][gPacman.location.j] = pacmanImg
    // update the DOM
    renderCell(gPacman.location, pacmanImg)
    document.querySelector('img').style.rotate = gPacmanDegrees

}

function getNextLocation(eventKeyboard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // figure out nextLocation

    switch (eventKeyboard.code) {
        case 'ArrowUp':
            gPacmanDegrees = '90deg'
            nextLocation.i--
            break
        case 'ArrowDown':
            gPacmanDegrees = '270deg'
            nextLocation.i++
            break
        case 'ArrowRight':
            gPacmanDegrees = '180deg'
            nextLocation.j++
            break
        case 'ArrowLeft':
            gPacmanDegrees = '0deg'
            nextLocation.j--
            break
        default:
            return null
    }

    return nextLocation
}

