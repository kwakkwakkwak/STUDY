const Table =(_=>{
    // static private
    const Private = Symbol();
    return class Table{
        constructor(parent) {
            if(typeof parent !== 'string' || !parent) {
                throw "invalid param";
            }
            this[Private] = {parent};   // 이 클래스만이 안다.

        }
        // load(url) {
        //     fetch(url).then(res => {
        //         return res.json();      // json()은 promise 리턴할 것이다.
        //     }).then(json=> {
        //         this._render();
        //     })
        // }
        async load(url) {
            const response = await fetch(url);
            if(!response.ok){throw "invalid response";}
            const json = await response.json();

            // 해체가능한 코드를 통해서 1차방어를 하고 있다.
            const {title, header, items} = json;
            // validation : 입력의 무게를 아는게 중요하다.
            if(!items.length) {throw "no items";}

            Object.assign(this[Private], {title, header, items});
            this._render();
        }
        // 메서드라서 굳이 인자를 받지 않는다.
        // 검증이 끝난 값을 사용하면 되니까, 굳이 인자로 받을 필요 없다.
        _render() {
            // 부모, 데이터 체크 => 부모체크는 load가 비동기이며, 렌더링 하는 시점에 부모 얻는 시점을 뒤로 미루는게 유리하다.
            //                  부모가 없으면 아래 로직은 필요가 없다.
            const fields = this[Private], parent = document.querySelector(fields.parent);
            if(!parent){throw "invalid parent";}
            if(!fields.items || !fields.items.length) {     // 이 체크 로직은 로드쪽에 있어야 한다. 렌더링은 체크 없이~
                parent.innerHTML = "no data";               // 데이터 정책이 양쪽에 있으면.. 데이터에 반응하는 로직과 데이터 벨리데이션과 어긋남
                return;
            } else parent.innerHTML = "";

            // 테이블 생성
            const table = document.createElement('table');
            const caption = document.createElement('caption');
            caption.innerHTML = fields.title;
            table.appendChild(caption);

            // 캡션을 타이틀로
            // table.appendChild(
            //     fields.header.reduce((thead, data) => {
            //         const th = document.createElement('th');
            //         th.innerHTML = data;
            //         thead.appendChild(th);
            //         return thead;
            //     }, document.createElement('thead'))
            // )
            // 헤더를 티헤드로
            // 아이템을 tr로
            // 부모에 테이블 삽입
            parent.appendChild(
                fields.items.reduce((table, row)=> {
                    table.appendChild(
                        row.reduce((tr, data) => {
                            const td = document.createElement('td');
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
table.load("71_1.json");    // load가 비동기이기 때문에 바로 render()을 바로 호출하지 않는다.