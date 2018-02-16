
const Block = (_ => {
    const s = v => v.split(',').map(v => v.split('|').map(v => v.split('')));
    const c = (c, b) => class extends Block { constructor() { super(c, b); } };
    const Block = class {
        static block() {
            return new (this.blocks[parseInt(Math.random() * this.blocks.length)]);
        }
        constructor(color, blocks) {
            Object.assign(this, { color: '#' + color, blocks: s(blocks), rotate: 0 });
        }
        left() {
            if (--this.rotate < 0) this.rotate = 3;
        }
        right() {
            if (++this.rotate > 3) this.rotate = 0;
        }
        get block() {
            return this.blocks[this.rotate];
        }
    }
    Block.blocks = [
        '00C3ED-1|1|1|1,1111,1|1|1|1,1111',
        'FBD72B-11|11,11|11,11|11,11|11',
        'B84A9C-010|111,10|11|10,111|010,01|11|01',
        '00FF24-011|110,10|11|01,011|110,10|11|01',
        'FF1920-110|011,01|11|10,110|011,01|11|10',
        '2900FC-100|111,11|10|10,111|001,01|01|11',
        'FD7C31-001|111,10|10|11,111|100,11|01|01'
    ].map(v => c(...v.split('-')));
    return Block;
})();