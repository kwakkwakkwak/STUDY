const log = (v) => {
    for(const v_key in v){
        console.log(` ${v_key} => ${JSON.stringify(v[v_key])}`)
    }
}
 
const htmlParser = htmlStr => {
    const words = htmlStr, 
          len = htmlStr.length,
          stacks = [],
          root = makeTag({name:'ROOT', type:'NODE', children:[]});   
    let cursor = 0, 
        mainStack = root,
        isTagStart = false,
        isTextStart = false,
        isClosed = false,
        text = "";
    
    while(cursor < len) {
        const word = words[cursor];
        switch(word) {
            // < 은 새로운 태그를 생성한다.
            case '<':
                ({text, isTagStart} = ltSign(text, mainStack)); break;
            // '/'유무에 따라 태그를 마무리 할수 있다.
            // '/'가 있을 때에도 /> 와 같은 형태일때는 메인 스택을 팝할 필요가 없다.
            case '>':
                ({isClosed, isTagStart, mainStack, text} = gtSign(isClosed, isTagStart, text, mainStack, stacks)); break;                
            // 태그를 마무리 한다. 
            case '/':
                isClosed = true;
            default:
                text += word; break;
        }
        cursor++;
    }

    if(text) {
        const textNode = makeTag({name:text, type:'TEXT', children:null});
        mainStack.children.push(textNode);
    }
    return root;
}

   
const makeTag = ({name, type, children}) => {
    const result = Object.create(null);
    result.name = name;
    result.type = type;
    result.children = children && children.slice();

    return result;
}

const ltSign = (text, mainStack) => {
    if(text) {
        const textNode = makeTag({name:text, type:'TEXT', children:null});
        mainStack.children.push(textNode);
    }
    return {text:"", isTagStart:true}
}

const gtSign = (isClosed, isTagStart, text, mainStack, stacks) => {
    switch(isClosed) {
        case true:
            if(text[text.length-1] === '/') {
                mainStack.children.push(makeTag({name:text.substring(0,text.length-1), type:'NODE', children:null}))
            } else {
                mainStack = stacks.pop();
            }
            isClosed = false;
           
            break;
            
        case false:
            const tag = makeTag({name:text, type:'NODE', children:[]})
            mainStack.children.push(tag);
            stacks.push(mainStack);
            isTagStart = false;
            mainStack = tag;
            break;
    }
    return { isClosed, isTagStart, mainStack, text : "" }
}


const test1 = '<div>a<div>b</div>c</div>';
const test2 = 'abc<div1>div1_text<div1_1>div1_1_text</div1_1>div1_text2<p>ptag</p></div1>def';
const test3 = '<div>1<img/><p>2</p><abc/>3s</div>';
const result1 = htmlParser(test1);
const result2 = htmlParser(test2);
const result3 = htmlParser(test3);