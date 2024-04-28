const RNDCONST = 0x100000000; // 4294967296;
//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function sfc32(a: number, b: number, c: number, d: number) {
    return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        const t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / RNDCONST;
    }
}

export function generateRandomSeed() {
    const r = () => Math.random();
    const now = Date.now();
    const prng = sfc32(now * r(), now * r(), now * r(), now * r());
    return Math.floor(prng() * RNDCONST);
}



export class RandomGenerator {
    public gen: () => number;
    constructor(seed: number) {
        const shift = 24;
        const mask = 0xfff;
        const gen = sfc32(
            (seed << 0 * shift) & mask,
            (seed << 1 * shift) & mask,
            (seed << 2 * shift) & mask,
            (seed << 3 * shift) & mask
        );
        this.gen = gen;
    }
    public next(maxIncl: number, minIncl?: number) {
        if (!minIncl)
            minIncl = 0;
        const r = this.gen();
        //const r = Math.random();
        return Math.floor(minIncl + r * (maxIncl - minIncl + 1));
    }
    public possibility(...options: number[]) {
        var s = options.reduce((prev, current) => prev + current, 0);
        var rand = this.next(s - 1);
        var c = 0;
        for (var i = 0; i < options.length; i++) {
            var o = options[i];
            if (rand < o) {
                return i;
            }
            c += o;
        }
        return -1;
    }
}


