```javascript
const er = (a) => {throw `${a} 값을 입력해주세요.`};

/* Person 클래스 */
class Person {
	constructor(genderFlag = er('gender') ) {
		let _male;	// private 변수
		_male = genderFlag;
		
      	// 이것의 문제점은 getGender가 내부값을 읽어서 male, female을 반환한다는 것이다.
		this.getGender = ()=>{
			console.log(this);
			return _male ? "male" : "female";
		}
    }
}

/* 수정된 Person 클래스1 */
// 사람은 남자와 여자로 나뉜다. Man, Woman 클래스가 그것을 상속하게 만든다.
// Person 객체에게 요구하는 것은 성별이 무엇인지 알고 싶은 것이다. 
// 이 객체는 성별을 확인해줄 책임이 있다. 따라서 Person의 추상 메소드로 getGender() 선언
// 성별은 남자와 여자에게 물었을 때 확인가능 => getGender 메소드는 자식 클래스에 구현

class Person1 {
  constructor () {}
  getGender() { throw "상속해서 메서드를 만드세요.";}
}

class Man extends Person1 {
  getGender() {return "male";}
}
class Woman extends Person1 {
  getGender() {return "female";}
}

const talkGender = human => {
  if(!(human instanceof Person1)) throw "Person 만 가능합니다.";
  console.log(`성별은 ${human.getGender()} 입니다.`);
}

let he = new Man();
let she = new Woman();

talkGender(he);			// 성별은 male 입니다.
talkGender(she);		// 성별은 female 입니다.
talkGender([]);			// Person만 가능합니다.
talkGender({});			// Person만 가능합니다.

/* 수정된 Person 클래스2 */
// 성별을 물은 다음에 그 답변에 대해서 판단하지 말고, 성별 판단 자체를 Person에게 주자
class Person2 {
  constructor () {}
  isMale () { throw "상속해서 구현하세요"; }
}

class Man extends Person2 {
  isMale () {return true;}
}
class Woman extends Person2 {
  isMale () {return false;}
}

const talkGender = human => {
  if(!(human instanceof Person2)) throw "Person 만 가능합니다.";
  console.log(human.isMale() ? "남자입니다." : "여자입니다.");
}

// Person 클래스는 객체의 행위를 내부 속성값에 의존한다는 점에서 비객체지향적이다.
// 객체지향 방식에서는 객체의 행위가 상황에 따라 달라질 경우 상속을 통해 하위 클래스에 그 행위를 구체화 한다.
// Person1, Person2 클래스는 객체의 행위를 하위 클래스에서 구체적으로 결정된다는 점에서 다형성을 적절히 응용한 객체지향 코드이다. Person2는 성별 판단의 책임을 Person2 클래스에 완전히 위임했다.
```


```javascript
class MyRobot {
	constructor() {
		this._currentState = 0;
	}
	setState(state) {
		if( state < 0 || state > 2) throw "0~2 까지 숫자가 필요하다.";
		this._currentState = state;
    }
	talk() {
		switch(this._currentState) {
            case 0 : console.log("아이 좋아 좋아");break;
            case 1 : console.log("아이 싫어 싫어");break;
            case 2 : console.log("아이 썰렁 썰렁");break;
        };
    }
}

// 수정

class MyRobot {
  constructor() {
    this._state = new HappyState();
  }
  setState(stateObj) {
    if(!(stateObj instanceof State)) throw "State 클래스만 가능";
    this._state = stateObj;
  }
  talk() {
    this._state.talk();
  }
}

class State {
  constructor() {}
  talk() { throw "구현 필요합니다."; }
}

class ColdState extends State{
  talk() { console.log("차가운 상태다"); }
}

class HappyState extends State {
  talk() { console.log("행복한 상태다"); }
}

class AngryState extends State {
  talk() { console.log("화난 상태다."); }
}

let robot = new MyRobot();
robot.talk();	// 행복한 상태다.

robot.setState(new ColdState());
robot.talk();	// 차가운 상태다. 

// 갑자기 배고픈 상태를 추가하라고 한다!
// 기존의 코드를 수정할 필요 없이 이렇게 만들면 된다!
class HungryState extends State {
  talk() { console.log("배고픈 상태다"); }
}

robot.setState(new HungryState());
robot.talk();


/*
상태 패턴은 상태에 따라 동작을 다르게 하는 부분만 별도의 클래스로 정의하는 패턴
특정 객체는 내부의 상태가 변할 때 행위도 그거에 따라 변하게 된다. 마치 객체가 자신의 클래스를 프로그램의 실행중에 변경하는 것처럼 보인다.
State 패턴은 객체의 행위가 별도로 분리된 상태(state) 에 따라 달라지도록 해준다. 이 떄 상태정보는 클래스로 정의된다. State란 추상클래스가 정의되며 하위 클래스에서 상태별로 달라지는 행위가 구현된다. 이런 구조로 상태의 정보를 캡슐화하여 프로그램 실행 중에 특정 객체의 행위를 변경하는 패턴을 State 패턴이라고 한다.

state패턴은 개체의 상태정보를 별도의 클래스로 캡슐화한다.
strategy 패턴은 개체의 알고리즘을 캡슐화하여 별도의 클래스로 정의한다.
*/
```

```javascript
class IState {
  s1() {}
  s2() {}
  s3() {}
}

class S1 extends IState {
  s1() {console.log("동일 상태"); return this;}
  s2() {console.log("A 이벤트 상태"); return new S2();}
  s3() {console.log("E 이벤트 상태"); return new S3();}
}

class S2 extends IState {
  s1() {console.log("C 이벤트 상태"); return this;}
  s2() {console.log("동일 상태"); return new S3();}
  s3() {console.log("B 이벤트 상태"); return new S3();}
}

class S3 extends IState {
  s1() {console.log("가능하지 않음"); return this;}
  s2() {console.log("D 이벤트 상태"); return new S2();}
  s3() {console.log("동일 상태"); return this;}
}

class StateManager {
  constructor(state){
    if(!(state instanceof IState)) throw "IState클래스만 가능합니다.";
    this.state = state;
  }
  s1() {this.state = this.state.s1() }
  s2() {this.state = this.state.s2() }
  s3() {this.state = this.state.s3() }
}
```

