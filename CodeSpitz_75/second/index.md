# CodeSpitz 75 - 2

## Design Pattern Category

생성패턴, 구조패턴, 행동패턴



=> 이미 객체지향설계에 숙달한 사람을 대상으로 한다.



### 객체지향설계를 학습할 수 있는 분류

캡슐화, 다형성, 변화율, 객체관계, **역할모델**



## 알고리즘이 변화하는 이유

비즈니스 변화, 연관 라이브러리 변화, 호스트측 변화

==> 대부분 통제불가요소이다.



### 기존 제어문 기반의 알고리즘이 갖는 문제

"수정하면 전체가 컴파일 된다!!"

==> 알고리즘이 변화한 부분만 수정하고 나머지는 건드리고 싶지 않다면?

==> 최대한 개별 알고리즘을 함수로 분리한다.

```javascript
if(Case == 1) {
    ...
} else if(case == 2) {
	...  
}  else if(case ==3) {
    .......
}
    
// ==============================
    
if(case == 1) {
    case1();
} else if(case == 2) {
    case2();
} else if(case == 3) {
    case3();
}
```



### 문제들

1. 경우가 변경될 때
2. 함수간 공통 부분

```javascript
if(case == 1) {
    case1();
} else if(case == 2) {
    case2();
} else if(case == 3) {
    case3();
}
// 경우가 변경될 때
else if(case == 4) {
    case4();
}

// ================================

if(case == 1) {
    common();
    case1();
} else if(case == 2) {
    common();
    case2();
} else if(case == 3) {
    case3();
}
```



## 알고리즘 분화 시 객체지향에서 선택할 수 있는 두 가지 방법

1) 상속 위임

내부계약관계로 추상층에서 공통 요소를 해결하고 상태를 공뷰할 수 있음

2) 소유 위임

외부계약관계로 각각이 독립적인 문제를 해결하며 메세지를 주고 받는 것으로 문제를 해결함

(GOF DP 방향성 ==> 단, 부가적인 형이 많이 생김)



### 상속 위임

```javascript
/*** TEMPLATE METHOD PATTERN ***/

const Github = class {   // 정의시점 - 변하지 않는 부분
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }
    // TEMPLATE METHOD
    load(path) {
        // ================== 공통부분 ===================
        const id = `callback${Github._id++}`;
        const f = Github[id] = ({data:{content}}) => {
            delete Github[id];
            document.head.removeChild(s);
            this._loaded(content);  // <=== 위임부분
        };
        const s = document.createElement('script');
        s.src = `${this._base + path}?callback=Github.${id}`;
        document.head.appendChild(s);
        // =============================================
    }
    _loaded(v) {throw 'override!';}   // HOOK
};
Github._id = 0;

// =============================================================================
const ImageLoader = class extends Github {   // 실행시점 선택지 - 변하는 부분
    constructor(id, repo, target) {
        super(id, repo);
        this._target = target;
    }
    _loaded(v) {  // <=== 위임구현
        this._target.src = `data:text/plain;base64,${v}`;
    }
}

const s75img = new ImageLoader(
	'hikaMaeng',
    'codespitz75',
    codument.querySelector('#a')
);
s75img.load('einBig.png');

// =============================================================================
const MdLoader = class extends Github {
    constructor(id, repo, target) {
        super(id, repo);
        this._target = target;
    }
    _loaded(v) {
        this._target.innerHTML = this._parseMD(v);
    }
    _parseMD(v) {
        return d64(v).split('\n').map(v => {
            let i = 3;
            while(i) {
                if(v.startWith('#'.repeat(i))) 
                    return `<h${i}>${v.substr(i)}</h${i}>`;
                i--;
            }
            return v;
        }).join('<br/>');
    }
}
const d64 =v=>decodeURIComponent(
	atob(v)
    .split('')
    .map(c=>'%' + ('00' + c.charCodeAt(0).toString(16)).splice(-2))
    .join('')
);

const s75md = new MdLoader(
	'hikaMaeng',
    'codespitz75',
    codument.querySelector('#b')
)
s75md.load('README.md');
```



**상속 위임의 정의시점과 실행시점**

```html
<script src="Github.js"></scrip>
<script src="ImageLoader.js"></script>
<script src="MdLoader.js"></script>
<script>
    const img = new ImageLoader(...);
    img.load(...);
    
    const md = new MdLoader(...);
    md.load(...);
</script>
```



### 소유 위임

```javascript
/*** STRATEGY PATTERN ***/
const Github = class {   // 정의시점 - 변하지 않는 부분
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }
    load(path) {
        if(!this._parser) return;
        const id = `callback${Github._id++}`;
        const f = Github[id] = ({data:{content}}) => {
            delete Github[id];
            document.head.removeChlid(s);
            this._parser(content);   // <=== 위임 부분
        };
        const s = document.createElement('script');
        s.src = `${this._base + path}?callback=Github.${id}`;
        document.head.appendChild(s);
    }
    // STRATEGY OBJECT   실행시점선택지 - 변하는 부분
    set parser(v) {this._parser = v;}   // <== 위임 객체
};
Github._id = 0;

// =============================================================================

const el =v=>document.querySelector(v);
const parseMD =v=> ...;
const loader = new Github('hikaMaeng', 'codespitz75');

// img
const img =v=> el('#a').src = `data:text/plain;base64,${v}`;
loader.parser = img;
loader.load('xx.png');

// md
const md =v=> el('#b').innerHTML = parseMD(v);
loader.parser = md;
loader.load('xx.md');
```



**자유변수를 통한 확장**

```javascript
const Github = class {
    constructor(id, repo) {
        this._base = `https://apt.github.com/repos/${id}/${repo}/contents/`;
    }
	load(path) {
        if(!this._parser) return;
        const id =`callback${Github._id++}`;
        const f = Github[id] = ({data:{content}}) => {
            delete Github[id];
            document.head.removeChild(s);
            this._parser[0](content, ...this._parser[1]);   // <= 자유변수 활용
        };
        const s = document.createElement('script');
        s.src = `${this._base + path}?callback=Github.${id}`;
        document.head.appendChild(s);
    }
    setParser(f, ...arg) {this._parser = [f,arg];}   // <= 자유변수 활용
};
Github._id = 0;

// =============================================================================
const el =v=>document.querySelector(v);
const parseMd =v=> ...;
const loader = new Github('hikaMaeng', 'codespitz75');

// img
const img =(v, el) => el.src = `data:text/plain;base64,${v}`;
loader.setParser(img, el('#a'));
loader.load('xx.png');

// md
const md =(v, el) => el.innerHTML = parseMD(v);
loader.setParser(md, el('#b'));
loader.load('xx.md');
```



**소유 위임의 정의시점과 실행시점**

```html
<!-- 정의 시점 -->
<script src="Github.js"></script>
<script src="img.js"></script>
<script src="md.js"></script>

<!-- 실행시점 선택 위임 -->
<script>
const loader = new Github('hikaMaeng', 'codespitz75');
loader.setParser(img, el('#a'));
loader.load('xx.png');
loader.setParser(md, el('#b'));
loader.load('xx.md');
</script>
```



```javascript
// 실행시점 선택 위임
const Loader = class {
    constructor(id, repo) {
        this._git = new Github(id, repo);
        this._router = new Map;   // ==> 라우팅테이블
    }
    add(ext, f, ...arg) {
        ext.split(',').forEach(v=>this._router.set(v, [f, ...arg]));
    }
    load(v) {
        const ext = this._v.split('.').pop();
        if(!this._router.has(ext)) return;
        this._git.setParser(...this._router.get(ext));   // 확장자 경우에 따라 자동 분기
        this._git.load(v);
    }
}

const loader = new Loader('hikaMaeng', 'codespitz75');

// 발생가능한 경우의 수를 값으로 기술
// LOADER이ㅡ 코드가 변경되지 않음
loader.add('jpg, png,gif', img, el('#a'));
loader.add('md', md, el('#b'));

loader.load('xx.jpg');
loader.load('xx.md');
```



## 상태에 대한 분기는 사라지지 않는다.

"그 분기가 필요해서 태어났기 때문이다.!"

==> 정의 시점에 제거하는 방법은?

1) 분기 수 만큼 객체를 만든다.

2) 실행시점에 경우의 수를 공급한다.



### 실행시점으로 분기를 옮길 때의 장단점

**장점**

1) 정의 시점에 모든 경우를 몰라도 된다.

2) 정의 시점에 그 경우를 처리하는 방법도 몰라도 된다.

일정한 통제 범위 내에서 확장가능한 알고리즘 설계 가능 

**단점**

1) 실행 시점에 모든 경우를 반드시 기술해야 함

2) 실행 시점마다 알고리즘의 안정성을 담보해야 함

매 호스트코드마다 안정성을 따로 담보해야 함

==> 캡슐화 패턴 Factory, Builder Pattern

