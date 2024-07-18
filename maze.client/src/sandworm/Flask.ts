export class Flask {
    static MAX = 4;
    public readonly Colors: number[] = [];
    get IsEmpty() { return this.Colors.length == 0; }
    get IsFull() { return this.Colors.length == Flask.MAX; }
    constructor(public readonly index: number) {
    }
    Peek() {
        if (this.IsEmpty)
            return undefined;
        return this.Colors[this.Colors.length - 1];
    }
    Pop(): number {
        if (this.IsEmpty)
            return undefined;
        return this.Colors.pop();
    }
    Push(c: number) {
        if (this.IsFull)
            throw new Error(`Cannot push more colors (${c}) to Flask ${this.Colors}`);
        this.Colors.push(c);
    }
}

export class Board {
    private _flasks: Flask[] = [];
    public get Flasks(): Flask[] { return this._flasks; }
    public get Count() { return this.Flasks.length; };
    constructor(count: number) {
        for (var i = 0; i < count; i++) {
            this._flasks.push(new Flask(i))
        }
    }
    randomSwap(rnd: ex.Random) {
        const cnt = this.Count * 2 * Flask.MAX;

        for (var i = 0; i < cnt; i++) {
            do {
                var s1 = rnd.integer(0, this.Count - 1);
                var f1 = this.Flasks[s1];
            } while (f1.IsEmpty);
            do {
                var s2 = rnd.integer(0, this.Count - 1);
                var f2 = this.Flasks[s2];
            } while (f2.IsEmpty || s2 == s1);
            const c1 = rnd.integer(0, f1.Colors.length - 1);
            const c2 = rnd.integer(0, f2.Colors.length - 1);
            const c = f1.Colors[c1];
            f1.Colors[c1] = f2.Colors[c2];
            f2.Colors[c2] = c;
        }
    }
    canPour(fs: Flask, fd: Flask) {
        if (fs.IsEmpty)
            return false;
        if (fd.IsEmpty)
            return true;
        if (fd.Colors.length >= Flask.MAX)
            return false;
        const ls = fs.Peek();
        const ld = fd.Peek();
        return ls == ld;
    }
    doPour(fs: Flask, fd: Flask) {
        while (this.canPour(fs, fd)) {
            const c = fs.Pop();
            fd.Push(c);
        }
    }
    dump() {
        let s = '';
        for (var i = 0; i < this.Flasks.length; i++) {
            const f = this.Flasks[i];
            s += `#${i}:`;
            s += f.Colors;
            s += `\n`;
        }
        console.log(s);
    }
}
