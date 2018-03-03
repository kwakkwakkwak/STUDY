const repeat = (count, ...arg) => {
    const f = arg.pop();
    for (let i = 0; i < count; i++) f(i, ...arg);
};
const sel = s => document.querySelector(s);
const ERR = v => { throw v };
const OVERRIDE = (cls, f) => f in cls.prototype ? f : ERR(`${cls.name} doesn't have ${f}`);             // 오버라이드를 명시적으로 알려주기 위한 함수 코드
const IS_OVERRIDE = _ => ERR('OVERRIDE!!'); // 오버라이드 체크
const PROP = (self, ...v) => Object.assign(self, ...v);

const HOOK = (_ => {                        // 템플릿 메소드 패턴에서의 HOOK
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
    get y() {return this._x;}
    get x() {return this._y;}
    get xy() {return {x: this._x, y: this._y};}
}

const SubData = class SubData{
    // state, ranking ,etc... parentclass
    constructor(listener) {PROP(this, {listener});}
    notify() {if(this.listener) this.listener();}
    clear() {this[HOOK(SubData, 'clear')]();}
}

// 생성자가 없으니 clear가 호출하기 전에는 this.stage가 생성되지
// 않는다.
const Stage = class Stage extends SubData {
    [HOOK(SubData, 'clear')]() {
        this.stage = 0;
        this.isNext();
    }
    isNext() {  // 만약 분기문이 있다면, mandatory 분기로 짜야 좋은 분기이다.
        // 매직넘버는 나중에 성공적으로 뺄수가 없다.
        // 매직넘버가 나오면 무조건 그 순간에 빼야 한다. 설정 값은 무조건 나온즉시 보내야 한다.
        let flag = (this.stage++ === SET.stage.max) ? false : (this.notify(), true);
        return flag;
    }
    // 최저 스피드, 최고 스피드
    get speed() {
        const {stage: {speed: {min, max}, max:stageMax}} = SET;
        return min - (min-max) * (this.stage-1) / stageMax;
    }
    // 카운트는 기저값, 판마다 증가되는 값이 있었다.
    // 해체를 쓰는 이유는 제어문을 줄여주기 때문이다. 
    // 해체가 지원되는 언어들은 좌측이 우측의 구조를 만든다.
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
                // 바닥에 닿으면 에러발생함.
                // col을 체크해서 0이 아닐경우만 색상을 칠한다.
                if(arr[rowNum+point.y][colNum+point.x] !== "0" && col !== "0") {
                    flag = false;
                    return flag;
                }
                if(col === "1") {
                    arr[rowNum+point.y][colNum+point.x] = blockColor;
                }
                return true;
            });
            return flag;
        });
        if(flag === false) {
            this.save(game.pastData[0]);
            game.clearPoint();
            game.getNextBlock();
            arr = game.pastData[0][0];
        }
        returnData[0] = arr, arr = null;
        return returnData;
    }
    checkCompleteLines() {
        
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
            // this.blocks에는 Block의 상속 클래스가 배열안에 담겨 있다.
            return new (this.blocks[parseInt(Math.random() * this.blocks.length)]);
        }
        constructor(color, blocks) {
            // 이건 클래스 자체에서 get block으로 쓰인다.
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
        '00C3ED-1|1|1|1,1111,1|1|1|1,1111',
        'FBD72B-11|11,11|11,11|11,11|11',
        'B84A9C-010|111,10|11|10,111|010,01|11|01',
        '00FF24-011|110,10|11|01,011|110,10|11|01',
        'FF1920-110|011,01|11|10,110|011,01|11|10',
        '2900FC-100|111,11|10|10,111|001,01|01|11',
        'FD7C31-001|111,10|10|11,111|100,11|01|01'
    ].map(v => c(...v.split('-')));
    return Block;
})();







// Game은 상태를 호스팅해주는 역할만 해준다. 
// 너무 많은 외부 의존성을 가지고 있었고, 게임에서 상태 처리기를 다 소유하려 했다. 
// 외부의 네이티브 뷰를 받아들일려고 했지만 그래서는 안된다.
// 왜냐하면 상태를 늘릴 방법이 없다. 코드에 확정되기 때문이다.

// 객체지향에서 가장 중요한 스킬은 클래스에 코드로 메소드를 안쓸까? 이다.
// 클래스에 메소드를 기술하지 않는 방법은 전략 객체를 소유할 수 밖에 없다. 
// 내가 지금 소유한 전략객체의 액션을 부르면, 내가 직접 정적 시점에 확정되지 않아도
// 들어오는 객체에 따라서 유연하게 반응할 수 잇는 컨테이너 같은 객체가 될 것이다.
// 객체지향, 디자인 패턴에서 지향하는 바는, 어떻게 하면 코드로 많이 기술하지 않고 
// 런타임에 조합형 객체를 넣어서 목표를 달성한다. 내가 이모든 기능을 정적으로 확정짓지 않고 
// 동적으로 , 객체망으로 해결한다. 어떻게 역할을 분배해서 내 역할을 줄여볼까
// 유지보수와 관리를 위해서~

// 게임은 결국 각 상황에 맞춰서 그 상황을 그려주는 패널을 로딩하고
// 패널이 다 그리고 나면 그 패널한테 일어나는 각 상황별 대처를 하는 것이다.

// 두개로 볼수 잇다.
// 1. 그림를 다 그려주는 패널과
// 2. 그 상황에 맞춰서 무언가 해주는 액션으로 
// 볼수 있다.

// Game의 진정한 역할은 상태를 호스팅해주는 것이다.
// setstate하면 그쪽으로 위임하고 관리해준다.
// 책임은 col, row만 알고 있다. 그외에는 다 위임해주는게 진짜 역할 이었다.
// 이렇게 해결하는 것을 객체망으로 해결한다고 한다. 


const Game = class Game{
    // 이전시간에 basePanel이 Element이었기 때문에 내부 에서 innerHTML와 같은 네이티브 코드가 등장하게 되었다.
    // 따라서 base가 되는 스테이지 조차도 전부 패널로 받아야 네이티브 의존성을 없앨 수 있다. 
    // base는 그래서 필요하기 때문에 생성자에서 받는 것이다. 
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
        // this.currentPoint.x = ~~(this.col/2)-1;
        // this.currentPoint.y = 0;
    }
    clearData() {
        const arr = [];
        const zeroRow = "0".repeat(this.col).split("");
        repeat(this.row, arr, zeroRow, (i, arr, zeroRow) => arr[i] = zeroRow);
        return arr;
    }
    updateData() {
        // 쌓이는게 성공했을 때 Data를 갱신한다.
    }
    mergeBlockToData() {
        // currentPoint, currentBlock, data

    }
    downBlock() {
        const {currentPoint, data, panel, currentBlock, pastData} = this;
        if(currentPoint.down((currentBlock.block).length) === false){
            // 체크로직을 넣어서 한줄 이상의 완성이 있는지 보고 있다면 pastData
            data.save(pastData[0]); // 한줄 이상의 완성이 없으면 이전상태를 저장한다. 
            currentPoint.clear();
            this.getNextBlock();
            return;
        } else {
            pastData[0] = data.merge(currentBlock, currentPoint.xy);
            panel[Game.play].render(pastData[0]);
        }
    }
    
    // 각 상황에 맞춰서 데이터를 받아야 한다. 
    // 패널값과 그 처리기를 동기에 받아온다. 
    // 첫번째 인자는 스테이트 명, 두번째는 패널(init, render), 세번째는 f함수(arrow function)
    addState(state, {init, render}, f) {
        this.state[state] = f;  // 액션
        this.panel[state] = new Panel(this, init, render);  // 해당 패널을 넣으면 된다. 
    }
    // setState로 세팅할 경우 해당 패널에서 render를 실행하게 된다.
    setState(state) {
        // 해당 상태가 있는지 확인한다.
        if (!Object.values(s).includes(state)) throw 'invalid';
        this.currState = state;
        // basePanel의 render를 호출한다. 
        const currPanel = this.panel[state];
        // this.state[state] 를 실행한다.
        this.state[state](this, this);
        this.basePanel.render(currPanel);
        // panel은 this.base를 lazy loding으로 갖는다. (render()) 호출할 떄
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
        IS_OVERRIDE();      // 주석을 쓰지말고 코드를 주석화 해라.
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
    // 자식 클래스를 만들지 않고 함수를 넘기는 거 만으로 각각 움직이는 인스턴스를 만든다.
    init(...arg){   // 배init열로 받고
        // lazy 초기화 (init 호출전에는 thisP.base가 존재하지 않는다.)
        // this._init의 경우 arrow function 이기 때문에 this가 없다.
        // 따라서 this.game을 보내준다. 
        return this.base = this._init(this.game, ...arg);   // 배열해체로 인자를 준다.
    }
    // 람다 2개를 감싸서 처리해주는 컨테이너 같은 녀석이다.
    // 행동 떄문에 자바스크립트에서는 람다(arrow function)을 보내면된다. 
    render(...arg) {
        this._render(this.base, this.game, ...arg);
    }
}
