const repeat = (count, ...arg) => {
    const f = arg.pop();
    for (let i = 0; i < count; i++) f(i, ...arg);
};
const sel = s => document.querySelector(s);
const ERR = v => { throw v };
const OVERRIDE = (cls, f) => f in cls.prototype ? f : ERR(`${cls.name} doesn't have ${f}`);
const IS_OVERRIDE = _ => ERR('OVERRIDE!!');
const PROP = (self, ...v) => Object.assign(self, ...v);

const HOOK = (_ => {
    const syms = new WeakMap;
    return (cls, f, ...arg) => {
        if (!syms.has(cls)) syms.set(cls, new Map);
        const sym = syms.get(cls);
        if (!sym.has(f)) sym.set(f, Symbol());
        return sym.get(f);
    };
})();

const Point = class Point{
    constructor(_row, _col) {
        PROP(this, {_x: ~~(_col/2)-1, _y: -1, _row, _col});
    }
    left() {
        if(this._x === 0) return false;
        return this._x -=1;
    }
    right(blockCol) {
        if(this._x === (this._col-blockCol)) {
            return false;
        }
        return this._x += 1;
    }
    down(blockRow) {
        if(this._y === (this._row-blockRow)) return false;
        return this._y += 1;
    }
    clear() {
        [this._x, this._y] = [~~(this._col/2)-1, -1];
    }
    get y() {
        return this._x;
    }
    get x() {
        return this._y;
    }
    get xy() {
        return {x: this._x, y: this._y};
    }
}

const SubData = class SubData{
    constructor(listener) {PROP(this, {listener});}
    notify() {if(this.listener) this.listener();}
    clear() {this[HOOK(SubData, 'clear')]();}
}

const Stage = class Stage extends SubData {
    [HOOK(SubData, 'clear')]() {
        this.stage = 0;
        this.isNext();
    }
    isNext() {  
        let flag = (this.stage++ === SET.stage.max) ? false : (this.notify(), true);
        return flag;
    }
    get speed() {
        const {stage: {speed: {min, max}, max:stageMax}} = SET;
        return min - (min-max) * (this.stage-1) / stageMax;
    }
    get count() {
        const {stage: {count:{max, inc}}} = SET;
        return max + inc * (this.stage - 1);
    }
}


const Score = class Score extends SubData {
    [HOOK(SubData, 'clear')]() {
        this.curr = this.total = 0;
        this.notify();
    }
    add(line, stage) {
        const score = parseInt((stage * 5) * (2 ** line));
        this.curr += score, this.total += score;
    }
}


const Data = class Data extends Array {
    constructor(rowNum, colNum) {
        super();
        Object.assign(this, {rowNum, colNum});
        this.clear();
    }
    save(data) {
        this[0] = data[0];
    }
    merge(block, point){
        const returnData = new Data(this.rowNum, this.colNum)
        const [blockColor, blockArr] = [block.color, block.block];
        let arr = this[0].map(o => o.slice());
        let flag = true;
        blockArr.every((row,rowNum) => {
            row.every((col, colNum)=>{
                if(arr[rowNum+point.y][colNum+point.x] !== "0" && col !== "0") {
                    return (flag = false);
                }
                if(col === "1") {
                    arr[rowNum+point.y][colNum+point.x] = blockColor;
                }
                return true;
            });
            return flag;
        });
        if(flag === false) {
            game.clearPoint();
            game.getNextBlock();
            game.checkCompletedLine();
            arr = game.pastData[0][0];
        }
        returnData[0] = arr, arr = null;
        return returnData;
    }
   clear() {
        const arr = [];
        const zeroRow = "0".repeat(this.colNum).split("");
        repeat(this.rowNum, arr, zeroRow, (i, arr, zeroRow) => arr[i] = zeroRow);
        this[0] = arr;
    }
}


const Block = (_ => {
    const s = v => v.split(',').map(v => v.split('|').map(v => v.split('')));
    const c = (c, b) => class extends Block { constructor() { super(c, b); } };
    const Block = class Block{
        static block() {
            return new (this.blocks[parseInt(Math.random() * this.blocks.length)]);
        }
        constructor(color, blocks) {
            if(Block === new.target){ throw "new Block으로 쓰일수 없습니다."}
            Object.assign(this, { color: '#' + color, blocks: s(blocks), rotate: 0 });
        }
        left() {
            if (--this.rotate < 0) this.rotate = 3;
        }
        right() {
            if (++this.rotate > 3) this.rotate = 0;
            return true;
        }
        get block() {
            return this.blocks[this.rotate];
        }
    }
    Block.blocks = [
        '00C3ED-1111,1|1|1|1,1111,1|1|1|1',
        // '00C3ED-1|1|1|1,1111,1|1|1|1,1111',
        'FBD72B-11|11,11|11,11|11,11|11',
        'B84A9C-010|111,10|11|10,111|010,01|11|01',
        '00FF24-011|110,10|11|01,011|110,10|11|01',
        'FF1920-110|011,01|11|10,110|011,01|11|10',
        '2900FC-100|111,11|10|10,111|001,01|01|11',
        'FD7C31-001|111,10|10|11,111|100,11|01|01'
    ].map(v => c(...v.split('-')));
    return Block;
})();


const Game = class Game{
    constructor(col, row, {init, render}) {
        PROP(this, {
            col, row, state: {}, panel: {}, data: new Data(row, col),
            stage: new Stage, score: new Score, currState: "",
            basePanel: new Panel(this, init, render), pastData:[],
            currentPoint: new Point(row, col), 
            currentBlock: Block.block(), nextBlock: Block.block()
        });
        const zeroArr = [];

        this.basePanel.init();
    }
    getNextBlock() {
        this.currentBlock = this.nextBlock;
        this.nextBlock = Block.block();
    }
    clearPoint() {
        this.currentPoint.clear();
    }
    clearData() {
        const arr = [];
        const zeroRow = "0".repeat(this.col).split("");
        repeat(this.row, arr, zeroRow, (i, arr, zeroRow) => arr[i] = zeroRow);
        return arr;
    }
    downBlock() {
        const {currentPoint, data, panel, currentBlock, pastData} = this;
        if(currentPoint.down((currentBlock.block).length) === false){
            this.checkCompletedLine()
            currentPoint.clear();
            this.getNextBlock();
        } else {
            pastData[0] = data.merge(currentBlock, currentPoint.xy);
            panel[Game.play].render(pastData[0]);
        }
    }
    checkCompletedLine() {
        const len = this.pastData[0][0].length;
        const pData = this.pastData[0][0].filter(row => !row.every(col => col !== "0"));
        const completedLines = len - pData.length;
        if(completedLines) {
            game.score.add(completedLines, game.stage.stage);
        }
        for(let i = pData.length; i < len; i++) {
            pData.unshift("0".repeat(this.col).split(""));
        }
        this.pastData[0][0] = pData;
        this.data.save(this.pastData[0]);
    }
    addState(state, {init, render}, f) {
        this.state[state] = f;
        this.panel[state] = new Panel(this, init, render);
    }
    setState(state) {
        if (!Object.values(s).includes(state)) throw 'invalid';
        this.currState = state;
        const currPanel = this.panel[state];
        this.state[state](this, this);
        this.basePanel.render(currPanel);
    }
}
const s = {};
'title,stageIntro,play,dead,stageClear,clear,ranking'.split(',').forEach(v => s[v] = Symbol(v));
Object.entries(s).forEach(([k, v]) => Game[k] = v);
Object.freeze(Game);


const Renderer = class Renderer{
    constructor(col, row, base, back) {
        Object.assign(this, { col, row, base, back, blocks: [] });
    }
    clear() {
        IS_OVERRIDE();
    }
    render(v) {
        this[HOOK(Renderer, 'render')](v);
    }
}

const TableRenderer = (_ => {
    const el = v => document.createElement(v);
    const add = (p, c) => p.appendChild(typeof c == 'string' ? el(c) : c);
    const back = (s, v) => { if(v !== 0) s.backgroundColor = v;}
    return class TableRenderer extends Renderer {
        constructor(col, row, bgColor) {
            super(col, row, el('table'), bgColor);
            const { base, blocks } = this;
            let { row: i } = this;
            while (i--) {
                const curr = [], tr = add(base, 'tr');
                tr.className = `tr${i}`
                let j = col;
                blocks.push(curr);
                while (j--) {
                    const td = add(tr, 'td').style;
                    back(td, bgColor);
                    curr.push(td);
                }
            }
        }
        [OVERRIDE(Renderer, 'clear')]() {
            this.blocks.forEach(v => v.forEach(s => back(s, this.back)));
        }
        [HOOK(Renderer, 'render')](v) {
            this.blocks.forEach((c, i) => c.forEach((s, j) => back(s, v[0][i][j])));
        }
    }
})();



const Panel = class Panel{
    constructor(game, _init, _render) {
        PROP(this, {game, _init, _render});
    }
    init(...arg){
        return this.base = this._init(this.game, ...arg);
    }
    render(...arg) {
        this._render(this.base, this.game, ...arg);
    }
}
