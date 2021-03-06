const Table =(_=>{
    const Private = Symbol();
    return class {
        constructor(parent) {}
        async load(url) {}
        _render() {}
    }
})();

const Data = class {
    async getData() {
        const json = await this._getData();
        return new Info(json);
    }
    async _getData() {
        throw "_getData must override";
    }
}

const JsonData = class extends Data {
    constructor(data) {
        super();
        this._data = data;
    }
    async _getData() {
        let json;
        if(typeof this._data == 'string') {
            const res = await fetch(this._data);
            return await res.json();
        } else return this._data;
    }
}

const itemChecker = (_=>{
    const v = (v) => {throw `${v} is mandotory!`}
    const parsingPercent = one => one.match(/-?(\d+.)?\d+%/g);
    const is6Length = arr => {if(arr.length !== 6){throw "Item array's length should be 6.";}};
    const isNumber = one => {if(typeof one !== "number" || Number.isNaN(one)) {throw `${one} is not Number`;}}
    const isChange = one => {if(!(one === "" || one === "change")){throw `${change} is not "" or change`;}}
    const isArray = one => {if(Array.isArray(one)){throw `${one} is not the array!`;}}

    const isPercent = (one, len = one.length, checkPercent = parsingPercent(one)) => {
        if(!checkPercent) {throw `"${one}" => ${checkPercent} is not a percent syntax!`}
        if(len !== checkPercent[0].length) {throw `${one} is not the correct percent syntax`;}
    }

    const checker = ([
        newRank=v('newRank'), pastRank=v('pastRank'), change=v('change'), 
        language=v('language'), ratingRatio=v('ratingRatio'), changeRatio=v('changeRatio')
    ]) => {
        isNumber(newRank), isNumber(pastRank);
        isPercent(ratingRatio), isPercent(changeRatio), isChange(change);
        return [newRank, pastRank, change, language, ratingRatio, changeRatio]
    }

    return args => {
        const resultArray = (is6Length(args), checker(args));
        return resultArray;
    }
})();



const Info = class {
    constructor(json) {
        const {title, header, items} = json;
        if(typeof title !== 'string' || !title) {throw "invalid title"}
        if(!Array.isArray(header) || !header.length) {throw "invalid header";}
        this._private = {title, header, items: items.map( (item,idx) => {
            try{
                return itemChecker(item);
            }
            catch(e){
                console.group("ERROR");
                console.error(`index${idx} => ${item} is the wrong data syntax!`);
                console.error(e);
                console.groupEnd()
                return [];
            }
        })};
    }
    get title() {
        return this._private.title;
    }
    get header() {
        return this._private.header;
    }
    get items() {
        return this._private.items;
    }
}


const Renderer = class{
    constructor(parent) {
        if(typeof parent !== 'string' || !parent) {throw "invalid param";}
        this._parent = document.querySelector(parent);
    }
    async render(data) {
        if(!(data instanceof Data)) {throw "invalid data type";}
        this._info = await data.getData();
        this._render();
    }
    clear() {
        this._parent.innerHTML = "";
    }
    _render() {
        throw "_render must overrided";
    }
    get title() {
        const titleString = this._info.title;
        return titleString;
    }
    get header() {
        const headerArr = this._info.header;
        return headerArr;
    }
    get items() {
        const itemsArr = this._info.items;
        return itemsArr;
    }
    get parent() {
        const parentElement = this._parent;
        return parentElement;
    }
}

const TableRenderer = class extends Renderer {
    constructor(parent) {
        super(parent);
    }
    _createElement(tag, content = "") {
        const oneElement = document.createElement(tag);
        oneElement.innerHTML = content;
        return oneElement;
    }
    _createElements(tag, contents) {
        if(!Array.isArray(contents)){throw "contents should be array type!";}
        const _createElement = this._createElement.bind(this);
        const resultArr = contents.map(content => _createElement(tag, content));
        return resultArr;
    }
    _appendChildren(parent, ...children) {
        const resultElement = children.reduce((_parent, child) => (_parent.appendChild(child), _parent), parent);
        return resultElement;
    }
    _render() {
        const parent = this.parent;
        this.clear();
        const table = this._createElement('table');
        this._appendChildren(
            table, 
                this._createElement('caption', this.title),
                this._appendChildren( this._createElement('thead'), ...this._createElements('th', this.header)),
                ...this.items.map(row => this._appendChildren( this._createElement('tr'), ...this._createElements('td', row)))
        );
        parent.appendChild(table);
    }
}






// ===================== 실행부 ============================

const data = new JsonData("75_1.json");
const renderer = new TableRenderer('#data');
renderer.render(data);