

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

const SubData = class {
    constructor(listener) { PROP(this, { listener }); }
    notify() { if (this.listener) this.listener(); }
    clear() { HOOK(this, 'clear'); }
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


const Game = class {
    // 이전시간에 basePanel이 Element이었기 때문에 내부 에서 innerHTML와 같은 네이티브 코드가 등장하게 되었다.
    // 따라서 base가 되는 스테이지 조차도 전부 패널로 받아야 네이티브 의존성을 없앨 수 있다. 
    // base는 그래서 필요하기 때문에 생성자에서 받는 것이다. 
    constructor(col, row, {init, render}) {
        PROP(this, {col, row, state: {}, panel: {}, basePanel: new Panel(this, init, render)});
        this.basePanel.init();
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
        debugger;
        // basePanel의 render를 호출한다. 
        const currPanel = this.panel[state];
        this.basePanel.render(currPanel);
        // panel은 this.base를 lazy loding으로 갖는다. (render()) 호출할 떄

        const { state: { [this.curr]: { base: el } } } = this;
        this.basePanel.
        this.base.innerHTML = '';
        // 해당 state의 el을 붙인다.
        this.base.appendChild(el); 
        el.style.display = 'block';
        if(this.state[this.curr].r) this.state[this.curr].r(this, state.toString());
        // this[this.curr]();
    }
}
const s = {};
'title,stageIntro,play,dead,stageClear,clear,ranking'.split(',').forEach(v => s[v] = Symbol(v));
Object.entries(s).forEach(([k, v]) => Game[k] = v);
Object.freeze(Game);

const Renderer = class {
    constructor() {}
    clear() {
        IS_OVERRIDE();      // 주석을 쓰지말고 코드를 주석화 해라.
    }
    render(v) {
        this[HOOK(Renderer, 'render', v)]();
    }
}


const TableRenderer = class extends Renderer {
    // 이렇게 해도 클래스 정의시에만 한번 동작하기 때문에 성능과는 무관하다고 보면된다.
    [HOOK(Renderer, 'render')]() {console.log('MTP render')}
    [OVERRIDE(Renderer, 'clear')]() {console.log('Renderer _ clear')}
}



const Panel = class {
    constructor(game, _init, _render) {
        PROP(this, {game, _init, _render});
    }
    // 자식 클래스를 만들지 않고 함수를 넘기는 거 만으로 각각 움직이는 인스턴스를 만든다.
    init(...arg){   // 배init열로 받고
        // lazy 초기화 (init 호출전에는 this.base가 존재하지 않는다.)
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

const game = new Game(
    10, 20, 
    {
    init(){
        return sel('#stage');
    }, 
    // base가 없을 경우에는 panel.init을 발동시키기 위해서 초기값을 설정한다.
    render(base, game, panel) {
        const el = panel.init();
        console.log(base, game, panel, el);
        // base는 다양한 패널이 들어온다.
        // 어떤 상태가 되면 베이스의 자식을 바꿔서 현재 패널 것을 넣어주는 역할을 한다.
        // 현재 베이스에 넣어주는 것이다. 
        base.innerHTML = "";
        base.appendChild(el);
    }
});
// (base, game{init, render}, f) => {}
game.addState(
    Game.title, 
    {
        init(game, ...arg){
            sel('#title').style.display = "block";
            sel('#title .start').onclick =_=> game.setState(Game.stageIntro);
            return sel('#title');}, 
        render(){}
    }, 
    
    (_, {stage, score}) => {
        stage.clear();
        score.clear();
    }
);





// 
// return {
    // 이 안에서 최종적으로 게임이 실행되는 것이다 .
//     init() {
//         const game = new Game(10, 20, {
//             init(){
//                 return self('#stage');
//             }, 
//             render(base, game, panel, {base: el = panel.init()}) {
//                 base.innerHTML = "";
//                 base.appendChild(el);
//             }
//         });
//         game.addState(Game.title, {
            // init, render 로 구성됨
//             init(game, ...arg){
//                 sel('#title').style.display = "block";
//                 sel('#title.start').onclick = _ => game.setState(Game.stageIntro);
//                 return self('#title');
//             }, 
//             render(){}
//         }, 
            // this._render(this.base, this.game, ...arg)로 실행된다.
            // (base, game, ...arg) => {}
//         (_, {stage, score}) => {
//             stage.clear();
//             score.clear();
//         });
//     }
// }