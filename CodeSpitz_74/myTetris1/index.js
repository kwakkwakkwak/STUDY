
const game = new Game(
    11, 23, 
    {
    init(){
        return sel('#stage');
    }, 
    // base가 없을 경우에는 panel.init을 발동시키기 위해서 초기값을 설정한다.
    render(base, game, panel) {
        el = panel.base || panel.init();
        // base는 다양한 패널이 들어온다.
        // 어떤 상태가 되면 베이스의 자식을 바꿔서 현재 패널 것을 넣어주는 역할을 한다.
        // 현재 베이스에 넣어주는 것이다. 
        panel.render();
        base.innerHTML = "";
        base.appendChild(el);
    }
});


/************************************ title ***************************************/
game.addState(
    Game.title, 
    {
        init(game, ...arg){
            sel('#title').classList.remove('none');
            sel('#title .start').onclick =_=> game.setState(Game.play);
            return sel('#title');}, 
        render(){}
    }, 
    (_, {stage, score}) => {
        stage.clear();
        score.clear();
    }
);

/************************************ play ***************************************/

game.addState(
    Game.play,
    {
        init() {
            const gameArea = sel('#game');
            gameArea.classList.remove('none');
            gameArea.classList.add('game');
            const currPoint = this.game.currentPoint;

            let pastData = this.game.pastData;
            const mergeAndRender = (flag) => {
                if(flag === false) return;
                pastData[0] = game.data.merge(game.currentBlock, currPoint.xy);
                game.panel[Game.play].render(pastData[0]);
            }
            document.addEventListener('keydown', e => {
                // 다른 화면에서는 동작하지 않도록!
                if(this.game.currState !== Game.play) return;
                
                e.stopPropagation();
                e.preventDefault();
                switch(e.keyCode) {
                    case 37: {
                        mergeAndRender(currPoint.left());
                        break;
                    }
                    case 38: {
                        mergeAndRender(game.currentBlock.right());
                        break;
                    }
                    case 39: {
                        mergeAndRender(currPoint.right((game.currentBlock.block)[0].length));
                        break;
                    }
                    case 40: {
                        game.downBlock();
                        break;
                    }
                }
            });

            const play = gameArea.querySelector('.play');
            const renderer = new TableRenderer(this.game.col, this.game.row, '#fff');
            gameArea.renderer = renderer;
            gameArea.play = play;
            play.appendChild(renderer.base);
            
            return gameArea;
        },
        // 원래 코드에서는 basePanel이  해당 패널의 init()만 실행시켰지만
        // basepanel이 render()도 호출할수 있도록 수정했다.
        // 따라서 game.setState() => basePanel.render() => 해당Panel.render()를 실행되는 것이다.
        render(base, game, v) {
            base.querySelector('.stage').innerHTML = game.stage.stage;
            base.querySelector('.curr').innerHTML = game.score.curr;
            base.querySelector('.total').innerHTML = game.score.total;
            base.renderer.clear();
            switch(true) {
                case v instanceof Data : base.renderer.render(v); break;
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
    },
    (game, {stage, score}) => {
        const {data, currentPoint, row, col, panel} = game;
        setInterval(()=>{
            game.downBlock();
        },game.stage.speed - 300);
    }
);

/************************************ stageclear ***************************************/

game.addState(
    Game.stageClear,
    {
        init() {
            sel('#stateEnd').classList.remove('none');
            sel('#stateEnd .next').onclick =_=> {
                game.stage.isNext();
                game.setState(Game.play)
            };
            return sel('#stateEnd');
        },
        render(base, game, v){
            base.querySelector('.stage').innerHTML = game.stage.stage;
            base.querySelector('.curr').innerHTML = game.score.curr;
            base.querySelector('.total').innerHTML = game.score.total;
        }
    },
    () => {}
);


/************************************ dead ***************************************/

game.addState(
    Game.dead,
    {
        init() {
            sel('#dead').classList.remove('none');
            sel('#dead .rank').onclick =_=> game.setState(Game.ranking);
            sel('#dead .title').onclick =_=> game.setState(Game.title);
            return sel('#dead');
        },
        render(){}
    },
    () => {}
);

/************************************ clear ***************************************/

game.addState(
    Game.clear,
    {
        init() {
            sel('#clear').classList.remove('none');
            sel('#clear .rank').onclick =_=> game.setState(Game.ranking);
            sel('#clear .title').onclick =_=> game.setState(Game.title);
            return sel('#clear');
        },
        render(){}
    },
    () => {}
)

/************************************ ranking ***************************************/

game.addState(
    Game.ranking,
    {
        init() {
            sel('#ranking').classList.remove('none');
            return sel('#ranking');
        },
        render(){}
    },
    () => {}
)

const App = {
    init: ()=>game.setState(Game.title),
    start: ()=>game.setState(Game.play)
}

App.init();

const oneBlock = Block.block()

// game.data.change1ToColor(oneBlock.color, oneBlock.block)
// game.panel[Game.play].render(game.data)
// 이렇게 하면 블럭에 색이 칠해진다.
// 그렇다면, 현재 블럭과 다음 블럭을 가지고 있고,
// 현재 블럭의 좌표는 누가 가지고 있어야 하는 것일까?
