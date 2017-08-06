/* Dispatch 이해용 */
class StaticDispatch {
  //  StaticDispatch라는 구현 클래스의 method이므로 정적으로 정해진다.
  method(){return 'hello staticDispatch';}
}

let staticDispatch = new StaticDispatch();
console.log(staticDispatch.method());

class Dispatchable {
  method(){throw '구현해야 합니다.';}
}
class DynamicDispatch extends Dispatchable {
  method(){return 'hello dynamicDispatch';}
}

let dynamicDispatch = new DynamicDispatch();
console.log(dynamicDispatch.method());

// 더블 디스패치 예제
// SmartPhone 일종의 인터페이스 클래스 (JS에 자바와 같은 인터페이스는 없지만..)

// Iphone, Gallaxy SmartPhone 상속한 클래스
// Iphone6, Gallaxy6 더블 디스패치를 위한 클래스

// Game 기본적인 클래스
// GameIf if문을 이용한 각 휴대폰 클래스 마다 다르게 동작하게 한 클래스
// GameThis 더블 디스패치를 위한 클래스


class SmartPhone {
  getSimpleName(){ throw "구현 필요합니다.";}
  game() {}
}

class Iphone extends SmartPhone {
  getSimpleName(){ return "Iphone";}
}

class Gallaxy extends SmartPhone {
  getSimpleName(){ return "Gallaxy";}
}

class Game {
  play(phone) {
    if(!(phone instanceof SmartPhone)) throw "class SmartPhone만 가능";
    console.log(`Gameplay [ ${phone.getSimpleName()} ]`);
  }
}

let phoneList = [new Iphone(), new Gallaxy()];

// 스마트폰 리스트를 순회하면서 각각 게임을 하고 있다.
// 스마트폰 리스트는 동적 디스패치로 인해 출력내용은 모두 다르다.
// 객체 레퍼런스를 동적으로 추적하기 때문이다.
let game = new Game();
phoneList.forEach(one => game.play(one));

console.log('==================');

// 하지만, Gameplay가 스마트폰 구현체 별로 다르게 구현되어야 한다면????
// SmartPhone 구현체가 증가하면 계속 변경이 필요하다. OOP적 방법이 아니다.
class GameIf {
  play(phone) {
    if(!(phone instanceof SmartPhone)) throw "class SmartPhone만 가능";
    if(phone instanceof Iphone)
      console.log(`iphone play [ ${phone.getSimpleName()} ]`);
    if(phone instanceof Gallaxy)
      console.log(`Gallaxy play [ ${phone.getSimpleName()} ]`);
  }
}
let gameif = new GameIf();
phoneList.forEach(one => gameif.play(one));

console.log('==================');

class Iphone6 extends SmartPhone {
  getSimpleName() { return "Iphone6";}
  game(g) {
    if(!(g instanceof GameThis)) throw 'GameThis 클래스만 가능합니다.';
    console.log(`iphone1 play => ${this.getSimpleName()}`);
  }

}
class Gallaxy6 extends SmartPhone {
  getSimpleName() { return 'Gallaxy6';}
  game(g) {
    if(!(g instanceof GameThis)) throw 'GameThis 클래스만 가능합니다.';
    console.log(`gallaxy1 play => ${this.getSimpleName()}`);
  }
}

class GameThis {
  play(phone) {
    if(!(phone instanceof SmartPhone)) throw 'class SmartPhone만 가능';
    phone.game(this);
  }
}

// 기존 Game, GameIf에 존재하던 비즈니스 로직을 자기자신이 처리하게 수정했다.
// 이때 디스패치가 2번 일어나게 되는데 play 메서드를 찾기 위한 정적 디스패치 발생
// game 메서드를 찾기 위한 동적 디스패치가 발생한다.
// 만약 GameThis 클래스도 인터페이스 기반으로 구현하여 인터페이스로 참조를 하게 되면
// 동적 디스패치가 2번 발생할 것이다.

// 처음에 정적 또는 동적 play 메서드에 대한 디스패치만 발생하던 코드에서
// play 메서드 내부의 비즈니스 로직을 호출하는 실제 객체를 찾기 위한
// [동적 디스패치가 1번 더 발생하면] *더블 디스패치* 가 되는 것이다.

// 다른 폰 클래스가 추가되더라도 Game 클래스 변경 없이 OCP를 만족하게 바뀐다.

let phone6List = [new Iphone6(), new Gallaxy6()];
let gameThis = new GameThis();
phone6List.forEach(one => gameThis.play(one));
