JS에서 인터페이스는 고유 명사

인터페이스 : 사양에 맞는 값과 연결된 속성키의 셋트
어떤 Object 라도 인터페이스의 정의를 충족시킬 ㅅ 있다.
하나의 Object는 여러 개의 인터페이스를 충족시킬 수 있다.

```javascript
const object = {
	test(str) {
		return !!str;
    }
}

const Test = class {
	test(str) {
		return !!str;
    }
}

const test = new Test();
```





덕타입의 어려운 점은 머릿속에서만 개념이기 때문이다.
자바스크립트에서의 인터페이스는 덕타입을 위한 것이다. 

자바스크립트에서 

iterable, iterator 라는 두가지 인터페이스

iterator interface

자바스크립트에서 iterator 인터페이스는 무엇을 요구할까

1. next라는 키를 갖고
2. 이 키의 함수는 인자를 받지 않고 intertor result object를 반환하는 함수가 온다.
3. itrtorresultObject(인터페이스)는 value와 done 이라는 키를 갖고 있다.
4. 이중 dont은 계속 반복할수 있을지 없을지에 따라 불린 값을 반환한다.

(한국 사람이 쓴책은 다 금지이다. 역서를 보아라)

```javascript
const iterator = {
	value : 1,
	next() {
		return {
			done:false,
			value:this.value++
        };
    }
};
```

```javascript
const iterator = {
	data:[1,2,3,4,5],
	next() {
		return {
			done: this.data.length === 0,
			value:this.data.pop()
        };
    }
};
```

```javascript
const Iterator = class {
	constructor() {	
		this.data = [1,2,3,4,5];
    }
	next() {
		return {
			done:false,
			value:this.value++
        };
    }

}

const iterable = {
	[Symbol.iterator]() {
		return new Iterator;	
    }
}
```



```javascript
const loop = (iter, f) => {
	// iterable 이라면 iterator 얻음
	if(typeof iter[Symbol.itrator] == 'function'){
		iter = iter[Symbol.iterator]();
    }

	//IteratorObject가 아니라면 건더뛴다.
	if(typeof iter.next != 'function') return;
	while(true) {
		const v = iter.next();
		if(v.done) return; // 종료처리
		f(v.value);  // 현재 값을 전달함
    }
}
```



```javascript
const iter = {
	[Symbol.iterator](){return this},
	data:[1,2,3,4,5],
	next() {
		return {
			done:this.data.length === 0,
			value:this.data.pop()
        }
    }
}

const [z,...z1] = iter;
```



자유변수, DMZ