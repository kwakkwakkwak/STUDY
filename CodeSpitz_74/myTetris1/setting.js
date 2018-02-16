const SET = {
    appSize: {
        width:'500px',
        height:'500px'
    },
    display: {
        rows:20,
        cols:10
    },
    stage: {
        max: 10,
        // max, inc(증가량)
        count: {max:10, inc:3},
        // min, max
        speed: {min:500, max:100}
    }
}

const freeze = SET => {
    for(one in SET) {
        const target = SET[one];
        if(typeof target === 'object') freeze(target);
        Object.freeze(target);
    }
    Object.freeze(SET);
}

freeze(SET);