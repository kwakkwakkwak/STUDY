# CodeSpitz 75 - 2

## Design Pattern Category

생성패턴, 구조패턴, 행동패턴

GOF의 디자인 패턴에는 3가지 패턴이 이다.

- 생성패턴 : 객체 생성 관련
- 구조패턴 : 객체간 관계지을 때 이용
- 행동패턴 : Behavior 즉 알고리즘을 객체간의 협력망으로 푸는 데 이용

이 카테고리로 이해하려면 역햘모델과 객체지향에 대한 이해가 깊어야 한다. 즉 이미 객체지향 설계에 숙달한 사람을 대상으로 하는 것이다. 우리는 선수 과목인 객체지향에 대해서 깊은 이해를 다루어보도록 한다.

​     

### 객체지향설계를 학습할 수 있는 분류

캡슐화, 다형성, 변화율, 객체관계, **역할모델** (우리가 집중할 부분)

​    

## 알고리즘이 변화하는 이유

우리가 해결하고 싶어하는 문제들은 결국에는 그 문제와 관련 있는 알고리즘으로 되어 있을 것이다. 알고리즘이 변화하는 이유는 다음과 같다.

- 비즈니스 변화, 연관 라이브러리 변화, 호스트측 변화
- 위의 3가지 원인들은 대부분 통제불가 요소이다.



​    

### 기존 제어문 기반의 알고리즘이 갖는 문제

변화에 대응하는 프로그램? 그것을 적응형 프로그램, 반응형 프로그램 (adaptive program) 인데, 환경이나 수정요청이 왔을 때 유연하게 대처할수 있는 여러가지 철학들을 말하는데 그 실천 방법중 하나가 객체지향 프로그래밍이다. 

"수정하면 전체가 컴파일 된다!!"

==> 알고리즘이 변화한 부분만 수정하고 나머지는 건드리고 싶지 않다면?  **최대한 개별 알고리즘을 함수로 분리한다.**

```javascript
if(Case == 1) {
    ...
} else if(case == 2) {
	...  
}  else if(case ==3) {   // <= 이거 하나만 변경하는데 전체가 다시 배포되어야 한다.
    .......
}
    
// ==============================
    
if(case == 1) {
    case1();
} else if(case == 2) {
    case2();   // <= 이렇게 최대한 함수로 쪼개면 해당 함수의 파일만 수정하면 된다.
               // 즉 격리를 하게 된다.
} else if(case == 3) {
    case3();
}
```



### 함수 분화시의 문제들

1) 경우가 자체가 변경될 때    
케이스4가 들어왔기 때문에 전체를 다시 컴파일 하고 재배포해야 한다.

2) 함수간 공통 부분    
공통부분이 새롭게 생기거나 수정될 때 다시 전부다 컴파일해고 재배포해야 한다.

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

해결책은?    
최소한의 변화를 일으키는 부분을 분리해서 격리한다. 격리를 어떻게 할 것인가?

​    

## 알고리즘 분화 시 객체지향에서의 두 가지 방법

1) 상속 위임

- 중앙에 공통된 부분을 만들고, 경우의 수만큼 자식클래스를 생성한다.
- 내부계약관계로 추상층에서 공통 요소를 해결하고 상태를 공뷰할 수 있음.
- 부모와 자식간의 통신은 속성으로 한다. 인자가 아니다. 
- 안의 상태를 공유하는 대신에, 분기해야 할 내용만 자식에서 따로 구현한다.

2) 소유 위임

- 베이스를 두고, 경우의 수에 맞는 객체들을 소유함으로서 해결한다.


- 외부계약관계로 각각이 독립적인 문제를 해결하며 메세지를 주고 받는 것으로 문제를 해결함
- (GOF DP 방향성 ==> 단, 부가적인 형이 많이 생김. 그래서 간단한 문제는 그냥 만드는게 좋다.)
- 언제 적용하고 언제는 그냥 간단히 만들어야 할까? 훌륭한 개발자는 여기서 얼마나 역할을 분리할 지를 감각적으로 알게 된다. 이 부분은 수정이 들어오겠다 싶으면 더 많이 역할을 나누는 것이고, 이 부분은 변화가 없을거 같다고 생각될 경우에는 역할을 거의 안나눌 것이다. 이 점을 판별하는게, 도메인에 얼마나 익숙한 개발자인지에 달려 있다. 해당 업계에 오래 있어야 알수 있는 부분이다. 물론 에이전시 같은 경우는 맨날 하는 것이지만.

​      

### 상속 위임

깃허브는 restapi를 주고 있는데 jsonp로도 빼주고 있다.

```javascript
/*** TEMPLATE METHOD PATTERN ***/
// 깃허브에서는 뒤에 callback을 빼주면 jsonp로 할수 있다.
// jsonp는 전역함수를 필요로 한다. 
// 따라서 Github의 속성(프로퍼티)로 노출할 것이다.

// 깃헙의 컨텐츠를 읽어오는 클래스이다.
const Github = class {   // 정의시점 - 변하지 않는 부분
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }
    // TEMPLATE METHOD : 위임하는 HOOK을 호출하는 메소드
    load(path) {
        // ================== 공통부분 ===================
        // 정의 시점, 변화하지 않는 부분, 공통 로직
        const id = `callback${Github._id++}`;
        // Github의 속성으로 함수를 할당해서 전역에서 접근 가능하게 처리.
        // 깃헙에 주는 jsonp로 주는 데이터는 meta, data 키가 있고 
        // data안의 content안에 진짜 내용이 들어있다.
        // 하지만 이 content는 base64로 인코딩이 되어있어 풀어줘야 한다
        const f = Github[id] = ({data:{content}}) => {
            delete Github[id];
            document.head.removeChild(s);
            this._loaded(content);  // <=== 위임부분(상속위임)
        };
        const s = document.createElement('script');
        // url과 Github의 속성 함수로 붙여줘서 jsonp를 거기로 주라고.
        s.src = `${this._base + path}?callback=Github.${id}`;
        // document.head는 DOM lv1이다. 
        document.head.appendChild(s);
        // =============================================
    }
    _loaded(v) {throw 'override!';}   // HOOK
};
Github._id = 0;

// Concrete : 구상, 구현 이라는 의미
// ================== ImageLoader ================================================

const ImageLoader = class extends Github {   // 실행시점 선택지 - 변하는 부분
    constructor(id, repo, target) {
        super(id, repo);
        this._target = target;
    }
    _loaded(v) {  // <=== 위임구현 HOOK
        // data url : base64로 구운것을 넣을수 있다.
        // 이미지 데이터 앞에 데이터 형식에 대해서 기술해 주고 src에 넣었을 때 그림이 보이게 된다.
        this._target.src = `data:text/plain;base64,${v}`;
    }
}

// 경우의 수를 자식클래스를 만들어내는 것으로 처리했다. (상속위임)
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
// atob, btoa 브라우저에 내장됨. base64 디코딩, 인코딩 된다.
// 하지만 base64는 아스키 코드 기반으로 인코딩하므로 utf8은 다 깨진다.
// 한글 같은 것은 base64로 인코딩하려면 URL인코딩을 하고 base64를 한다.
// 풀때도 url디코딩해줘야 한다.
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

// 경우의 수 if를 제거하고 각자의 경우에 따라서 클래스를 만들어 주었다.
```



**상속 위임의 정의시점과 실행시점**

```html
// 정의시점
// 처리기를 만들어 놓을 뿐이다.
<script src="Github.js"></scrip>
<script src="ImageLoader.js"></script>
<script src="MdLoader.js"></script>

// 실행시점 선택
// if를 처리하는 책임을 이 시점에서 한다. 
// if가 변화해도 바깥쪽에서 대응을 할수 있게 된다.
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
            // 함수에게 위임한다.
            // 상속이 아닌 가지고 있는 파서에 따라서 처리하는게 달라진다.
            // 해당 타입을 처리할 로더 함수를 받아들이면서 할일이 달라진다.
        };
        const s = document.createElement('script');
        s.src = `${this._base + path}?callback=Github.${id}`;
        document.head.appendChild(s);
    }
    // STRATEGY OBJECT   실행시점선택지 - 변하는 부분
    set parser(v) {this._parser = v;}   // <== 위임 객체 (전략 객체)
    // 전략적으로 일부분을 위임할수 있는 무언가가 오기만 하면 된다.
};
Github._id = 0;

// 클래스 정의를 할 필요가 없다. 물론 전략 객체도 클래스로 만들면 물론 그럴것이다. 하지만 함수로 보낸다면 클래스 생성비용이 줄어든다. 다만 함수로 넘긴다면 함수에 대한 안정성, 넘기는 것이 그에 맞는 함수라는 보장을 할수가 없다. 
// 클래스는 타입을 instanceof로 나름의 체크를 할 수 있다.
// 전략 객체에 클래스 인스턴스를 할지 함수를 할지를 정하는 것은 그것에 대한 중요도에 따라서 달려 있다. 위험할 수록 강타입, 아니면 그냥 편하게 함수로 처리한다.
// ==================================================================

const el =v=>document.querySelector(v);
const parseMD =v=> ...;
const loader = new Github('hikaMaeng', 'codespitz75');

// img
const img =v=> el('#a').src = `data:text/plain;base64,${v}`;
loader.parser = img; // #a에 의존성이 있다.
loader.load('xx.png');

// md (파서만 교체하면 된다.)
const md =v=> el('#b').innerHTML = parseMD(v); // #b에 의존성 있다.
loader.parser = md;
loader.load('xx.md');

// 전략패턴을 소유하고 있는 것 (host 라고 부른다.)
// 파서만 바꾸면 계속 사용할 수 있다.

// 전략 패턴 : 케릭이 무기를 바꿔가며 싸우는 것 같은 것을 처리한다.
// 상속 위임 : NPC, 플레이어, 몹 등 개별 객체에 대한 개별적 처리에 적합하다.

// 계속 훈련한다. 내가 이때 상속/소유 위임중 어떠한 것을 사용할 까? 어떻게 위임? 어디까지 위임? 어디까지 쪼갤까? 이것도 수정할까? 이것까지 변화할까? 이러한 훈련을 끊임없이 해본다.
```

깃헙에는 md, image를 처리하는게 없다. 이미지, 마크다운이 변화하더라도 깃헙 클래스를 변경할 필요가 없다.



**자유변수를 통한 확장**

```javascript
// 특정 엘리먼트에 대한 의존성을 약해지도록 추가적인 상태를 기억하게 한다.
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
            // 0 파서 함수
            // 1 추가적인 argument 상태들을 보낸다.
            // 외부상태때문에 굳이 클래스 안만들고 이런식으로 버틸수도 있다.
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
// Github 객체 하나로만 처리할 수 있게 되었다.
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

