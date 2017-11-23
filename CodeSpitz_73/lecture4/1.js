const data = [
    { a: [1, 2, 3, 4], b: '-' },
    [5, 6, 7],
    8,
    9
];

const next = () => {
    let result = data;
    let v;
    while (v = result.shift()) {
        switch (true) {
            case Array.isArray(v):
                result.unshift(...v);
                break;
            case v && typeof v === "object":
                for (let one in v) {
                    result.unshift(v[one]);
                }
                break;
            default:
                return { value: v, done: false }
        }
    }
}

const next = () => {
    let v;
    while (v = data.shift()) {
        switch (true) {
            case Array.isArray(v):
                data.unshift(...v);
                break;
            case v && typeof v === 'object':
                for (let k in v) data.unshift(v[k]);
                break;
            default: return { value: v, done: false };
        }
    }
    return { done: true };
};

const a = {
    [Symbol.iterator]() {
        return this;
    },
    next
};


const data = [
    { a: [1, 2, 3, 4], b: '-' },
    [5, 6, 7],
    8, 7
];


const Compx = class {
    constructor(data) { this.data = data; }
    *gene() {
        const data = JSON.parse(JSON.stringify(this.data));
        let v;
        while (v = data.shift()) {
            if (v instanceof Object) {
                if (!Array.isArray(v)) v = Object.values(v);
                data.unshift(...v);
            } else yield v;
        }
    }
}

const a = new Compx(data);
console.log([...a.gene()]);
console.log([...a.gene()]);

const Compx = class {
    constructor(data) {
        this.data = data;
    }
    *gen() {
        const data = JSON.parse(JSON.stringify(this.data));
        let v;
        while (v = data.shift()) {
            if (v instanceof Object) {
                if (!Array.isArray(v)) v = Object.values(v);
                data.unshift(...v);
            } else yield v;
        }
    }
};
const data = [
    { a: [1, 2, 3, 4], b: '-' },
    [5, 6, 7],
    8, 7
];
const a = new Compx(data);
console.log([...a.gen()]);
console.log([...a.gen()]);