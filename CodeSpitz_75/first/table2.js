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

const Item = (_=>{
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

    return class extends Array {
        constructor(args) {
            is6Length(args);
            super(...checker(args));
        }
    }
})();



const Info = class {
    constructor(json) {
        const {title, header, items} = json;
        if(typeof title !== 'string' || !title) {throw "invalid title"}
        if(!Array.isArray(header) || !header.length) {throw "invalid header";}
        this._private = {title, header, items: items.map(item => {
            try{
                return new Item(item)
            }
            catch(e){
                console.group("ERROR");
                console.error(`${item} is the wrong data syntax!`);
                console.error(e);
                console.groupEnd()
                return [];
            }
        })};
    }
    get title() {return this._private.title;}
    get header() {return this._private.header;}
    get items() {return this._private.items;}
}


const Renderer = class{
    async render(data) {
        if(!(data instanceof Data)) {throw "invalid data type";}
        this._info = await data.getData();
        this._render();
    } 
    _render() {
        throw "_render must overrided";
    }
    get title() {return this._info.title}
    get header() {return this._info.header}
    get items() {return this._info.items.map(o=>o);}
}

const TableRenderer = class extends Renderer {
    constructor(parent) {
        if(typeof parent !== 'string' || !parent) {throw "invalid param";}
        super();
        this._parent = parent;
    }
    _render() {
        const parent = document.querySelector(this._parent);
        if(!parent) {throw "invalid parent";}
        parent.innerHTML = "";
        const [table, caption] = "table,caption".split(",").map(v=>document.createElement(v));
        caption.innerHTML = this.title;
        table.appendChild(caption);
        table.appendChild(
            this.header.reduce(
                (thead, data) => (thead.appendChild(document.createElement("th")).innerHTML = data, thead),
                document.createElement("thead")
            )
        );
        parent.appendChild(
            this.items.reduce(
                (table, row) => (table.appendChild(
                    row.reduce(
                        (tr, data) =>(tr.appendChild(document.createElement("td")).innerHTML = data, tr),
                        document.createElement("tr"))
                ), table),table)
        );
    }
}






// ===================== 실행부 ============================

const data = new JsonData("75_1.json");
const renderer = new TableRenderer('#data');
renderer.render(data);