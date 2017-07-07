# Introduction Base Code



```javascript

<section id="data"></section>

const Table =(_=>{
    // static private
    const Private = Symbol();

    return class {

        // constructor
        // 왜 parent라고 쓰지?
        constructor(parent) {
            if (typeof parent !== 'string' || !parent) throw "invalid param";
            this[Private] = {parent};
        }

        // public methods

        // 처음에는 이거였다가 나중에 아래의 load 메소드로 변경.
        //load(url) {
        //    fetch(url).then(response=>{
        //        return response.json();
        //    }).then(json=>{
        //        this._render();
        //    });
        //}

        async load(url) {
            const response = await fetch(url);
            if(!response.ok) throw "invalid response";

            const json = await response.json();
            const {title, header, items} = json;
            if(!items.length) throw "no items";

            Object.assign(this[Private], {title, header, items});
            this._render();
        }

        // private methods
        // 컨벤션으로 프라이빗
        _render() {
            const fields = this[Private], 
                    parent = document.querySelector(fields.parent);

            // 부모, 데이터 체크
            if(!parent) throw "invalid parent";
            if(!fields.items || !fields.items.length) {
                parent.innerHTML = "no data";
                return;
            } else parent.innerHTML = "";

            // table 생성
            // 캡션을 title로
            const table = document.createElement("table"),
                  caption = document.createElement("caption");
            
            caption.innerHTML = fields.title;
            table.appendChild(caption);
            
            // header를 thead로
            table.appendChild(
                fields.header.reduce((thead, data)=>{
                    const th = document.createElement("th");
                    th.innerHTML = data;
                    thead.appendChild(th);
                    return thead;
                }, document.createElement("thead"))
            );

            // items를 tr로
            // 부모에 table 삽입
            parent.appendChild(
                fields.items.reduce((table, row)=>{
                    table.appendChild(
                        row.reduce((tr, data)=>{
                            const td = document.createElement("td");
                            td.innerHTML = data;
                            tr.appendChild(td);
                            return tr;
                        }, document.createElement("tr"))
                    );
                    return table;
                }, table)
            );
        }
    }
})();

const table = new Table("#data");
table.load("71_1.json");

```

## ES 2015+

### Symbol

### Class

#### Class란?

- javascript에서 Class 는 함수이며, class 표현식과 class 선언 두가지 방법이 있다.

**class 선언**
- class를 선언하기 위해서 클래스의 이름과 함께 class 키워드를 사용한다.
- 클래스 선언은 호이스팅이 일어나지 않는다.

```javascript
class Polygon{
    constructor(height, width){
        this.height = height;
        this.width = width;
    }
}
```

**class 표현식**
- class 표현식은 이름을 가질 수도, 않을 수도 있다.
- 기명 class 표현식에 주어진 이름은 클래스의 body에 대해 local scope 유효

```javascript
// unnamed
var Polygon = class{
    constructor(height, width){
        this.height = height;
        this.width = width;
    }
};

// named
var Polygon = class Polygon{
    constructor(height, width){
        this.height = height;
        this.width = width;
    }
}
```

#### Class body와 method 정의
- Class body는 `{}`로 묶여 있는 안쪽 부분이다.
- method, constructor와 같은 class members를 정의하는 곳이다.
- 클래스 바디는 strict mode에서 실행된다.

**Constructor(생성자)**
- constructor 메소드는 class로 만든 객체를 만들고 초기화하는 특수한 메소드
- 생성자는 클래스 안에 한 개만 존재한다. 두개 이상이면 SyntaxError
- `super` 키워드를 이용하면 부모클래스의 생성자를 호출할 수 있다.

**Prototype methods**

```javascript
class Polygon{
    constructor(height, width){
        this.height = height;
        this.width = width;
    }
    get area() {
        return this.calcArea();
    }
    calcArea(){
        return this.height * this.width;
    }    
}

```

### Arrow Function

### async

### await

### Object.assign

### reduce

### fetch



```javascript

const Data = class{
    async getData(){
        const json = await this._getData();
        return new Info(json);
    }

    // 상속 & override를 강제한다.
    async _getData(){throw "getData must override";}
}

const JsonData = class extends Data{
    constructor(data){
        super();    // 상속, this 쓸려면 이렇게 해야함.
        this._data = data;
    }
    // 해당 메서드를 재구성한다.
    async getData(){
        if(typeof this._data == 'string'){
            const response = await fetch(this._data);
            return await response.json();
        } else return this._data;
    }
}

const Renderer = class{
    constructor(){}
    async render(data){
        if(!(data instanceof Data)) throw "invalid data type";
        this._info = await data.getData();
        this._render();
    }
    _render(){
        throw "_render must overrided";
    }
}

const TableRenderer = class extends Renderer{
    constructor(parent){
        if(typeof parent != 'string' || !parent) throw "invalid param";
        super();
        this._parent = parent;
    }
    _render(){
        const parent = document.querySelector(this._parent);
        if(!parent) throw "invalid parent";
        parent.innerHTML = "";
        const [table, caption] = ["table", "caption"].map(v=>document.createElement(v));
        caption.innerHTML = this._info.title;
        table.appendChild(caption);
        table.appendChild(
            this._info.header.reduce(
                (thead, data)=>(thead.appendChild(document.createElement("th")).innerHTML = data, thead),
                document.createElement("thead"))
        );
        parent.appendChild(
            this._info.items.reduce(
                (table, row)=>(table.appendChild(
                    row.reduce(
                        (tr, data)=>(tr.appendChild(document.createElement("td")).innerHTML = data, tr),
                        document.createElement("tr"))
                ), table),
            table)
        );}
}

const Info = class{
    constructor(json){
        const {title, header, items} = json;
        if(typeof title != 'string' || !title) throw "invalid title";
        if(!Array.isArray(header) || !header.length) throw "invalid header";
        if(!Awwray.isArray(items) || !items.length) throw "invalid items";
        items.forEach((v, idx)=>{
            if(!Array.isArray(v) || v.length != header.length){
                throw "invalid items:" + idx;
            }
        });
        this._private = {title, header, items};
    }
    get title(){return this._private.title;}
    get header(){return this._private.header;}
    get items(){return this._private.items;}
}

const data = new JsonData("71_1.json");
const renderer = new TableRenderer("#data");
renderer.render(data);

```
