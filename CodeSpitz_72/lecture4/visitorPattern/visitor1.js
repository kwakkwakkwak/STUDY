/*
참조 : https://en.wikipedia.org/wiki/Visitor_pattern





*/

const NOT_IMPLEMENTED = "구현되어야 합니다.";
const NOT_STRING = "string 타입이 아닙니다.";
const NOT_CARELEMENT = "CarElement 클래스만 됩니다.";


class CarElementVisitor {
  constructor(name) {
    if(!(typeof name === 'string')) throw NOT_STRING;
    this._name = "Visitor : "+name;
  }
  get name() {
    return this._name;
  }

  visit() { throw NOT_IMPLEMENTED;}
}

class CarElementDoVisitor extends CarElementVisitor {
  constructor() {
    super('DoVisitor');
  }
  visit(body) {
    if(!(body instanceof CarElement)) throw NOT_CARELEMENT;
    body.do(this);
  }
}

class CarElementPrintVisitor extends CarElementVisitor {
  constructor() {
    super('PrintVisitor');
  }
  visit(body) {
    if(!(body instanceof CarElement)) throw NOT_CARELEMENT;
    body.print(this);
  }
}

class CarElement {
  constructor(name) {
    if(!(typeof name === 'string')) throw NOT_STRING;
    this._name = name;
  }
  get name() {return this._name;}
  accept(visitor) {visitor.visit(this);}
  print(visitor) {console.log(`${visitor.name} || Visiting ${this.name}`);}
  do() { throw NOT_IMPLEMENTED;}
}

class Body extends CarElement {
  constructor(name) {
    super(name);
  }
  do(visitor) {
    console.log(`${visitor.name} || Movind my ${this.name}`);
  }
}

class Car extends CarElement {
  constructor(name) {
    super(name);
    this.elements = [
      new Wheel('FrontLeft'), new Wheel('FrontRight'),
      new Wheel('BackLeft'), new Wheel('BackRight'),
      new Body('Body'), new Engine('Engine')
    ];
  }
  accept(visitor) {
    this.elements.forEach(one => one.accept(visitor));
    visitor.visit(this);
  }
  do(visitor) {
    console.log(`${visitor.name} || Starting my ${this.name}`);
  }
}

class Engine extends CarElement {
  constructor(name) {
    super(name);
  }
  do(visitor) {
    console.log(`${visitor.name} || Starting my ${this.name}`);
  }
}

class Wheel extends CarElement {
  constructor(name) {
    super(name+ " WHEEL");
  }
  do(visitor) {
    console.log(`${visitor.name} || Kicking my ${this.name}`);
  }
}

// Start car
