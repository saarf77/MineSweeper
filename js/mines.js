var gLevel = { SIZE: 4, MINES: 2 };
var gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gBoard = []
function initGame() {
    buildBoard()
}
function buildBoard() {
    var randLocations = randMinesLocation()
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currLocation = { row: i, col: j }
            var currCell
            if (inLocations(currLocation, randLocations)) {
                currCell = {minesAroundCount: 4, isShown: false, isMine: true, isMarked: false}
            }
            else {
                currCell = {minesAroundCount: 4, isShown: false, isMine: false, isMarked: false}
            }
            currCell.minesAroundCount = setMinesNegsCount(i, j, randLocations)
            gBoard[i][j] = currCell
        }
    }
    console.table(gBoard);
    return gBoard
}







function setMinesNegsCount(rowIdx, colIdx, randLocations)
{
    var numNegs = 0
    // Neighbours loop - start
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i >= gBoard.SIZE) continue
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j >= gBoard.SIZE) continue
          if (i === rowIdx && j === colIdx) continue
          var currLocation = {row: rowIdx, col: colIdx}
        if (inLocations(currLocation, randLocations)) {
          numNegs++
        }
      }
    }
    //Neighbours loop - end
    return numNegs
}


function renderBoard(board)
{

}
 function cellClicked(elCell, i, j)
 {

 }
 function cellMarked(elCell)
 {

 }
 function checkGameOver()
 {

 }
 function expandShown(board, elCell, i, j)
 {
     
}

function randMinesLocation(){
    var randLocations = []
    var locationSize = 0

    while (locationSize < gLevel.MINES) {
        var currRow = getRandomInt(0, gLevel.SIZE)
        var currCol = getRandomInt(0, gLevel.SIZE)
        var currLocation = { row: currRow, col: currCol }
        if (!randLocations.includes(currLocation)) {
            randLocations.push(currLocation)
            locationSize++
        }
    }
    return randLocations
}



function inLocations(currLocation, randLocations) {
    for (var i = 0; i < randLocations.length; i++) {
    if (currLocation.row === randLocations[i].row && currLocation.col === randLocations[i].col ) {
        return true
    }        
    }
    return false
}