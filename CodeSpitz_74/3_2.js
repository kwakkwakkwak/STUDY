class Stack {
    constructor({name, type, attributes = null, children = null}) {
        this.name = name;
        this.type = type;
        this.children = children && children.slice();
        this.attributes = attributes;
    }
}
// [<htmltagname ] 여기까지가 그것.

function makeTag(target, cursor) {
    let currentCursor = cursor + 1;
    let word = target[currentCursor];
    let result = "";
    let text = "";

    while(word !== " " && word !== "/" && word !== ">") {
        text += word;
        word = target[++currentCursor]; 
    }

    result = new Stack({name:text, type:"NODE", attributes:{}, children:[]});
    return [result, currentCursor];
}

function parsingAttributes(stack, target, cursor) {
    let isOddDoubleQuote = false;
    let word = target[cursor];
    let attrName = "", attrValue = "";
    const attributes = stack.attributes;
    
    while(word !== ">" && word !== "/") {
        if(word !== " " && word !== "=" && word !== '"') {    
            if(isOddDoubleQuote) {
                attrValue += word;
            } else {
                attrName += word;
            }
        }

        if(word === '"') {
            isOddDoubleQuote = !isOddDoubleQuote;
            if(isOddDoubleQuote === false && attrName && attrValue) {
                attributes[attrName] = attrName !== 'style' ? attrValue : parsingStyle(attrValue);
                attrName = "";
                attrValue = "";
            }
        }
        word = target[++cursor];
    }
    return cursor;            
}  

const parsingStyle = styleStr => {
    const result = {};
    return result;
}

const htmlParser = htmlStr => {
    const target = htmlStr,
          stacks = [],
          ROOT = new Stack({name:"ROOT", type:"NODE", attributes:{}, children:[]}),
          len = target.length;

    let cursor = 0,
        text = "",
        word = "",
        stack = "",
        mainStack = ROOT,
        isTagStart = false,
        isTagClose = false;

    while(cursor < len) {
        word = target[cursor];

        // 1_1. < 없음 : <가 있기 전까지의 내용들을 전부 text로 저장했다가 < 를 만나거나 끝나면 그대로 text로 생성
        // 1_2. < 있을 경우 tag와 attribute 생성 2가지로 나뉨
        
        if(word === "<") {

            isTagStart = true;
            isTagClose = false;
              
            [stack, cursor] = makeTag(target, cursor);
            cursor = parsingAttributes(stack, target, cursor);
        }
        word = target[cursor];

        if(word === '/') {
            isTagClose = true;
        }

        if(word === ">") {
            mainStack.children.push(stack);
            if(target[cursor-1] === "/") {
            } else {
                if(isTagClose) {
                    mainStack = stacks.pop();
                } else {
                    stacks.push(mainStack);
                    mainStack = stack;
                }
            }
        }
        cursor++;
        
    }
    return ROOT;
}


const test1 = '<div id="test1" class="testclass1" style="width:100px">a<div>b</div>c</div><img/>';
// const test2 = 'abc<div1>div1_text<div1_1>div1_1_text</div1_1>div1_text2<p>ptag</p></div1>def';
// const test3 = '<div>1<img/><p>2</p><abc/>3s</div>';
const result1 = htmlParser(test1);
console.log(result1);
// const result2 = htmlParser(test2);
// const result3 = htmlParser(test3);