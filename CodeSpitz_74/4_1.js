/* STAGE : 현재 스테이지 정보 */
class Stage {
    constructor() {

    }
}

class Board {
    constructor() {
        this._board = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [8,8,8,8,8,8,8,8,8,8]
        ]
    }

    setBoard(board) {
        this._board = board;
    }

    getBoard() {
        return this._board.map(one=>one.slice());
    }

    getRows() {
        return this._board.length;
    }

    getCols() {
        return this._board[0].length;
    }
}



/* SCORE : 점수 및 계산법 */
class Score {
    constructor() {

    }
}


/* BLOCK : 범용 블록 정의 */
class Block {
    constructor(blocks) {
        this._rotate = 0;
        this._blocks = blocks;
    }

    rotate() {
        let temp = this._rotate;
        this._rotate = temp > 2 ? 0 : temp + 1;
    }

    getBlock() {
        return this._blocks[this._rotate].slice();
    }

    getRowCol() {
        const currentBlock = this.getBlock();
        return [currentBlock.length, currentBlock[0].length];
    }
}

class BlockFactory {
    constructor({block}) {
        this._block = block;
        this._blockType = [];
    }

    addType(arr) {
        this._blockType.push(arr);
    }

    getType() {
        const len = this._blockType.length;
        const num = ~~(Math.random() * len)
        return this._blockType[num];
    }

    getBlock() {
        return new this._block(this.getType());
    }
}

class ConsoleRenderer {
    render(arr) {
        let result = "";
        arr.forEach(one => {
                one.forEach( v => {
                    switch(v) {
                        case 1: result += "*"; break;
                        case 8: result += "─"; break;
                        case 9: result += "|"; break;
                        default: result += " ";
                    }
                });
                result += "\n";
            }
        );
        console.clear();
        console.log(result);
        return result;
    }
}

class Game {
    constructor({blockFactory, board, renderer}) {
        this._isDone = false;
        this._blockFactory = blockFactory;
        this._board = board;
        this._tempBoard = [];
        this._currentPoint = [0, 0];
        this._currentBlock = this._blockFactory.getBlock();
        this._renderer = renderer;
        this._boardSize = this.getBoardSize();
        this._interval;
    }

    getBoardSize() {
        return [this._board.getRows(), this._board.getCols()];
    }

    start() {
        this._interval = setInterval( ()=>{
            this._renderer.render(this.merge());
            this.pointDown();
        },200)
    }

    pointDown() {
        const currentPoint = this._currentPoint.slice(),
              nextPoint = [currentPoint[0] + 1, currentPoint[1]];

        this._currentPoint = nextPoint;
    }

    merge() {
        const [pointRow, pointCol] = this._currentPoint,
              blankBoard = this._board.getBoard(),
              nextBoard = this.makeNextBoard(blankBoard, pointRow, pointCol),
              result = this.applyNextBoard(nextBoard);

        return result;
    }

    
    makeNextBoard(blankBoard, pointRow, pointCol) {
        const result = blankBoard.map( 
            (rowArr, row) => rowArr.map( 
                (one, col) => one + this.mergeBlock(row, col, pointRow, pointCol)
            )
        );  
        return result;
    }

    mergeBlock(row, col, pointRow, pointCol) {
        const [blockRows, blockCols] = this._currentBlock.getRowCol(),
              currentBlock = this._currentBlock.getBlock();
        let result = 0;

        if(this.rowColCheck(row, pointRow, blockRows, col, pointCol, blockCols)) {
            result = currentBlock[row - pointRow][col - pointCol];
        }
        return result ? result : 0;
    }

    rowColCheck(row, pointRow, blockRows, col, pointCol, blockCols) {
        return this.rowCheck(row,pointRow, blockRows) && this.colCheck(col, pointCol, blockCols);
    }

    rowCheck(row, pointRow, blockRows) {
        return pointRow <= row && row < pointRow + blockRows;
    }

    colCheck(col, pointCol, blockCols) {
        return pointCol <= col && col < pointCol + blockCols;
    }

    applyNextBoard(nextBoard) {
        if(this.checkNextBoard(nextBoard)) {
            this._tempBoard = nextBoard;
            this._isDone = false;
            return nextBoard;
        }
        else {
            if(this._isDone) this.gameOver();

            this.makeNewBlock();
            this._isDone = true;
            return this.merge();
        } 
    }

    checkNextBoard(nextBoard) {
        const rows = nextBoard.length;
        for(let i = 0; i < rows; i++) {
            if(!this.checkRowCrash(nextBoard[i])) return false;
        }
        return true;
    }

    checkRowCrash(rowArr) {
        return rowArr.every(one => this.checkCrashRule(one));
    }

    checkCrashRule(num) {
        const BOTTOM_LINE = 8,
              BLANK_AREA = 0,
              BLOCK = 1;
        return num === BLANK_AREA || num === BLOCK || num === BOTTOM_LINE;
    }

    
    gameOver() {
        clearInterval(this._interval);
        throw "gameOver";
    }

    makeNewBlock() {
        this._currentPoint = [0, 0];
        this._currentBlock = this._blockFactory.getBlock();
        this._board.setBoard(this._tempBoard);
    }
}
