캡슐화, 은닉화?

은닉했다고 반드시 캡슐화 한건 아니다.
캡슐화에 대한 설계가 필요하다.

인터페이스 무엇을 노출하느냐.. 그 센스를 캡슐화이다.

행동을 노출. 어떻게 추상화 할 것인가

task를 객체화 해서 추가..
노출된 인터페이스는 task를 추가해줘 만 보여준다.

add Task가 커스터마이즈가 좀더 할수 있는 옵션이 없음.
어떻게 외부에 노출할 것인가

입력 뿐만 아니라 출력 return 도 상대방과의
상호작용을 어떻게 할지 고민하는게 함수의 디자인

함수의 시그니처?

함수에는 시그니처와 정의가 사용된다.
시그니처 : 함수의 고유성을 분리하는 아이디 같은 것이다.
정의 : 그 함수를 정의하는 방법

시그니처 - 함수의 다른 점을 .. 함수 이름, 파라미터가 다르면 다른 함수로 본다.
정의 - 이름도 줘야 하고 ...도 줘야 하고 반환값도 줘야 한다.

시그니처 - 이름, 파라미터 형식이 무엇인가? 를 정의하는 행위이다.

캡슐화와 은닉을 동시에 하기 위해서 IIFE를 사용함
반환에서 캡슐화

함수이름은 addTask이지만, 바깥에 노출할때에는 add로 한다.
바깥쪽에서 인식하기 좋은 이름을 사용한다.

이름은 사람을 위해서 짓는다. 이 함수를 가져다 쓸사람을 위해서.
todoList.add <= toDoList에 추가한다는 게 자연 스럽기 때문이다.

todoList.toggle 2가지 중 하나만 하기 때문에. 이것으로 한다.

좋은 함수란? 

세상에서 가장 좋은 함수는 인자가 하나도 없는 함수
입력이 함수를 어지럽히지 않으므로.

하지만 하나도 없으면 외부와 통신할수 없으므로 인자가 1개만 있는 함수이다.

기능적인 재료를 하나 만들고, 사용자에게 보여줄 캡슐화를 정한다.
chageState를 보여줄때 사람에게 어떻게 보여주고 다가갈 것인가?

change state 내부함수의 2번째 인자는 내부 하드코딩으로 하기 때문에 외부에서 받아온 값만
밸리데이션을 하면 된다.

밸리데이션과 내부함수??

내부냐, 외부냐는 것은 자기가 봤을때 내부이면, 그리고 외부이면으로 정한다.

반드시 코드에 다 반영되어야 한다.
밸리데이션은... 외부노출된 함수에는 반드시 걸려있어야 한다.
따라서 내부함수는 밸리데이션이 없다.

작동을 이해하는 것은 1차원적.
코드를 보고 의도를 이해하는 것이 2차원 적이다.

함수가 단순히 기능적인 것뿐만 아니라 사람이 사용할때 추상적으로 어떤 의미를 가지는
지를 재정의해줘야 한다. 따라서 어떻게 노출할지 캡슐화를 충분히 해줘야 한다.

프로그래밍이라는 것은 데이터 덩어리를 깍아 나가는 조각이라고 볼수 있다.
개발자 자신이 보기에 만족할때까지 깍아나가는 과정이다.

좋은, 나쁜 개발자란 : 최종적으로 노출되었을때 어디까지가 보여지는가?
좋은코드, 나쁜 코드는 보편적이고 객관적이다.

코드가 어떻게 캡슐화, 은닉화되었는지를.. 

좋은 개발자가 된다는 것은 대리석을 사람이 될때까지 깎아볼수 밖에 없다.

인메모리 객체이다.

변수 선언, 배열을 만들면 메모리안에 만들어지니 인메모리 객체이다.
네이티브 함수란 주어진 것이다.

네이티브 함수를 분리해서 랜더 함수로 했다.
그외에는 인메모리 , 로직 함수

인메모리 함수인 렌더만이 네이티브 객체를 알고 있다.

모드에 따라서 콘솔에 그릴지, 다른데서 그릴지..

렌더함수는 모드에 따라서 수행할수 있도록 바꾸었다.
내부함수에서도 다른 함수들은 접할수 없도록 익명함수 스코프 안에 만든다.
즉 특정 함수가 다른 함수를 부를때 그 특정함수만 호출한다면
그것만 접할수 잇도록 만드는게 좋다.

외부의 상태를 인식해서 내부의 것이 작동하도록

와꾸는 잡는 방법

HTML을 직접 작성

인코딩 파일 저장시 주의점
인코딩 - UTF8로 쓰라.
윈도우 기본값ANSI 따라서 신경써서 8로 저장하라.
BOM

section에 state를 함.
진행 / 완료
순서가 붙어있지 않으므로 ul
id는 식별자를 부여한 것
state는 제대로 된 이름이 아니다. 일반명사이기 떄문이다.

id라는 식별자를 쓰기에는 일반명사라서 별루다
todo 로한다. 중복된 이름이 없도록

HTML태그를 스크립트 언어로.. 내부에서는 한다.
HTML은 프로그래밍 랭귀지와 동급이다.

todo에속해있는 complete, progress로 봐야 하도록..
고유함에도 불구하고 아이디가 아니다. 클래스이다. 
아이디 소속의 컴플릿, 프로그레스인데, 다른 소속의 컴플릿, 프로그레스 일수 있기 때문에
클래스로 한다.

form.. 안에 input이있다.
button 은 종결하는 의미이므로 sumit으로 한다.
input은 싱글태그이다.

태그를 짤때 주의할 점은 디자인을 생각하면 안된다.
시멘텍 수준, 바른 의미를 맞춰서 필요한 태그를 넣도록 한다.

렌더가 해야하는일..
진행과 완료 섹션을 지우고 다시 만들어주면 된다.

초기화 과정 init()  initialize

init과 렌더 만 공유하는 스코프를 만들기
그것은 IIFE를 이용해서 두개를 만든다.
그리고 그것에 대해서 바깥쪽에 각 변수를 선언해 준다. 이러면 스코프를 분리할수 있다.
바깥의 어휘를 안쪽에 정의할수 있다.

document.querySelector

코딩을 하자마자 확인 이 가능한 것은
역할이 잘 나뉘어져 있도록 만들어서 그러하다.

계속 확인해 가면서, 하나씩 만들고 해결하고 확인해가면서 간다.


개발 순서?
네이티브
역할 모델 
잘 확인해가면서 하나하나 만들어가면된다.
