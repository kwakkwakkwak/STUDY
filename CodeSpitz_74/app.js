// 개별함수, 개별 클래스에 함몰되는 경우가 많다.
// 전체 모습을 만들고 그것을 점점 채워나가는 것이 더 생산성이 좋다.

// 전역변수는 존재하든 말든 인식하지 않도록 한다.

const APP = (SET=>{

"use strict";   // 우리가 감당할수 잇는 것은 앱내부니까 여기에서만 쓴다.

const repeat = (count, ...arg) => {
    const f = arg.pop();    // last is function;
    for(let i = 0; i < count; i++) f(i, ...arg);
};

const ERR = v => {throw v};
const OVERRIDE = v => "";       // 구현해야함
const IS_OVERRIDE = _ => ERR('OVERRIDE!!');
const PROP = (self, ...v) => Object.assign(self, ...v); // self에 속성을 넣는다는 의미

// 언어에서 지원을 하지 않으면 함수로 구현하면 된다.
const TMPL = (self, method, ...arg) => '-' + method in self ? self['_'+method](arg) : ERR(`TMPL(${method})`);
const HOOK = (p, method) => typeof p.prototype[method] === 'function' ? '_'+method : ERR(`HOOK(${method})`);

// 템플릿 메소드 패턴에 따르면 어떤 것은 오버라이드, 어떤 것은 템플릿으로서 호출해야 하는게 있다.
// 이거를 클래스에서 암묵적인 규칙으로 쓰고 잇었는데, 명시적 규칙으로 바꿔보자

// 그것을 위한 클래스가 SubData이다.
const SubData = class {
    // state, ranking ,etc... parentclass
    constructor(listener) {PROP(this, {listener});}
    notify() {if(this.listener) this.listener();}
    clear() {TMPL(this, 'clear');}
}

// 나쁜 코드 좋은 코드의 기준은 분기점이 얼마나 있느냐가 이다.
const Stage = class extends SubData {
    [HOOK(SubData, 'clear')]() {
        this.stage = 0;
        this.isNext();
    }
    isNext() {  // 만약 분기문이 있다면, mandatory 분기로 짜야 좋은 분기이다.
        // 매직넘버는 나중에 성공적으로 뺄수가 없다.
        // 매직넘버가 나오면 무조건 그 순간에 빼야 한다. 설정 값은 무조건 나온즉시 보내야 한다.
        if(this.stage++ === SET.stage.max) return false;
        else {this.notify();return true;}
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

// 코드의 암묵적인 부분들을 명시적인 부분으로 변경을 해보았다.
// 이제 Score 만들어 보자.

const Score = class extends SubData {
    [HOOK(SubData, 'clear')]() {
        this.curr = this.total = 0;
        this.notify();
    }
    add(line, stage) {
        // 생략
    }
}

const Block = class extends SubData {
    static get() {  // get은 메서드 이름으로도 가능하다.

    }
    constructor() {}
    left() {}
    right() {}
    get block() {}
}

const Data = class extends Array {
    constructor(row, col) {
        super(row);     // 성긴 배열 : 배열이 500개짜리라도 실제 3개만 있다면, 497개의 배열은 메모리 차지 안함. 이것을 성긴배열
        this.fill([]);
        PROP(this, {col});
    }
    cell() {}
    row() {}
    all() {}
}

const Renderer = class {
    constructor() {}
    clear() {
        IS_OVERRIDE();      // 주석을 쓰지말고 코드를 주석화 해라.
    }
    render(v) {
        TMPL(this, 'render', v);
    }
}

const TableRenderer = class extends Renderer {
    // 이렇게 해도 클래스 정의시에만 한번 동작하기 때문에 성능과는 무관하다고 보면된다.
    [HOOK(Renderer, 'render')]() {}
    [OVERRIDE(Renderer, 'clear')]() {}
}

const Panel = class {
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

// Game은 상태를 호스팅해주는 역할만 해준다. 
const Game = class {
    constructor(col, row, , basePanel) {

    }
    addState(state, {init, render}, f) {
        this.state[state] = f;
        this.panel[panel] = new Panel(this, init, render);
    }
}

return {
    init() {
        const game = new Game(10, 20, {
            init(){
                return self('#stage');
            }, 
            render(base, game, panel, {base: el = panel.init()}) {
                base.innerHTML = "";
                base.appendChild(el);
            }
        });
        game.addState(Game.title, {
            init(game, ...arg){
                sel('#title').style.display = "block";
                sel('#title.start').onclick = _ => game.setState(Game.stageIntro);
                return self('#title');
            }, 
            render(){}
        }, (_, {stage, score}) => {
            stage.clear();
            score.clear();
        });
    }
}

})(SET);

APP.init();