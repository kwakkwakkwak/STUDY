

"use strict";

// loop 중복 빼기 위해서 만듦, 마지막에 콜백함수
const repeat = (count, ...arg) => {
    const f = arg.pop();
    for (let i = 0; i < count; i++) f(i, ...arg);
}

const ERR = v => { throw v; }
const OVERRIDE = v => "";   // 이거 구현해야 한다.
const IS_OVERRIDE = _ => ERR('OVERRIDE!!');
const sel = s => document.querySelector(s);
const PROOP = (self, ...v) => Object.assign(self, ...v);
const TMPL = (self, method, ...arg) => '_' + method in self ? self['_' + method](arg) : ERR();
const HOOK = (p, method) => typeof p.prototype[method] === 'function' ? '_' + method : ERR();

const Stage = class {
    clear() {
        this.stage = 0;
        this.next();
    }
    _speed() {
        this.speed = 500 - 450 * this.stage / Stage.max;
    }
    _count() {
        this.count = 10 + 3 * this.stage;
    }
    next() {
        if (this.stage++ < Stage.max) {
            this._speed();
            this._count();
        }
    }
    [Symbol.toPrimitive](h) { return this.stage; }
}

const Score = class {
    clear() {
        this.curr = this.total = 0;
    }
    add(line, stage) {
        const score = parseInt((stage * 5) * (2 ** line));
        this.curr += score, this.total += score;
    }
    [Symbol.toPrimitive](h) { return `${this.curr},${this.total}`; }
}

const Block = (_ => {
    const s = v => v.split(',').map(v => v.split('|').map(v => v.split('')));
    const c = (c, b) => class extends Block { constructor() { super(c, b); } };
    const Block = class {
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


const Data = class extends Array {
    constructor(rowNum, colNum) {
        super();
        Object.assign(this, { rowNum, colNum });
    }
    cell(rowIdx, colIdx, color, test) {
        if (rowIdx > this.rowNum || colIdx > this.colNum 
            || rowIdx < 0 || colIdx < 0 || color == '0') return this;
        const row = this[rowIdx] || (this[rowIdx] = []);
        if (color && row[colIdx]) test.isIntersacted = true;
        row[colIdx] = color;
        return this;
    }
    row(rowIdx, ...colors) {
        return colors.forEach((color, colIdx) => this.cell(rowIdx, colIdx, color)), this;
    }
    all(...rows) {
        return rows.forEach((rowValue, rowIdx) => this.row(rowIdx, ...rowValue)), this;
    }
}

const Renderer = class {
    constructor(col, row, base, back) {
        Object.assign(this, { col, row, base, back, blocks: [] });
    }
    clear() {
        throw 'override';
    }
    render(v) {
        if (!(v instanceof Data)) { throw 'invalid'; }
        this._render(v);
    }
    _render(v) {
        throw 'override';
    }
}

const TableRenderer = (_ => {
    const el = v => document.createElement(v);
    const add = (p, c) => p.appendChild(typeof c == 'string' ? el(c) : c);
    const back = (s, v) => s.backgroundColor = v;
    return class extends Renderer {
        constructor(col, row, back) {
            super(col, row, el('table'), back);
            const { base, blocks } = this;
            let { row: i } = this;
            while (i--) {
                const curr = [], tr = add(base, 'tr');
                let j = col;
                blocks.push(curr);
                while (j--) curr.push(add(tr, 'td').style);
            }
        }
        clear() {
            this.blocks.forEach(v => v.forEach(s => back(s, this.back)));
        }
        _render(V) {
            this.blocks.forEach((c, i) => c.forEach((s, j) => back(s, v[i][j])));
        }
    }
})();

const Panel = class {
    static get(game, init, render) {
        const p = new Panel();
        return p.init(game, init(game), render), p;
    }
    init(game, base, r) {
        Object.assign(this, { base, game, r });
    }
    render(V) {
        this.render(this.game, v);
    }
}

const s = {};
'title,stageIntro,play,dead,stageClear,clear,ranking'.split(',').forEach(v => s[v] = Symbol(v));
const Game = class {
    constructor(base, col, row, ...v) {
        Object.assign(this, { base, col, row, state: {}, curr: 'title', score: new Score, stage: new Stage });
        let i = 0;
        while (i < v.length) this.state[v[i++]] = Panel.get(this, v[i++], v[i++]);
    } 
    setState(state) {
        if (!Object.values(s).includes(state)) throw 'invalid';
        this.curr = state;
        const { state: { [this.curr]: { base: el } } } = this;
        this.base.innerHTML = '';
        this.base.appendChild(el); 
        el.style.display = 'block';
        if(this.state[this.curr].r) this.state[this.curr].r(this, state.toString());
        // this[this.curr]();
        
    }
    _render(v) {
        const { state: { [this.curr]: base } } = this;
        base.render(v);
    }
};
Object.entries(s).forEach(([k, v]) => Game[k] = v);
Object.freeze(Game);

const game = new Game(
    sel('body'), 10, 20,
    //
    Game.title,
    game => {       // init
        sel('#title .btn').onclick = _ => game.setState(Game.stageIntro);
        return sel('#title');
    },
    null,           // render
    //
    Game.stageIntro,
    game => sel('#stageIntro'),     //init
    (game, v) => {                  //render
        sel('#stageIntro .stage').innerHTML = v;
        setTimeout(_ => game.setState(Game.play), 500);
    },
    //
    Game.play,
    game=>{
        const t = new TableRenderer(game.col, game.row, '#000');
        sel('#play').appendChild(t.base);
        sel('#play').renderer = t;
        return sel('#play');
    },
    v=>{
        switch(true) {
            case v instanceof Data : sel('#play').renderer.render(v); break;
            case v instanceof Block :
                v = v.block;
                const t = new TableRenderer(
                    v.reduce((p,v)=>v.length > p ? v.length : p, 0),
                    v.length,
                    'rgba(0,0,0,0)'
                );
                sel('#play .next').innerHTML = t.base.outHTML;
                t.render(new Data(5,5).all(...v.map(v=>v=='0'?'0':v.color)));
                break;
        }
    }

);
game.setState(Game.title);