import { ICoordinates } from "./Point";

function trunc(c: ICoordinates): ICoordinates {
    return { x: Math.trunc(c.x), y: Math.trunc(c.y) };
}

export type TMazeCell = number;

export const MazeCell = {
    WALL: 0,
    EMPTY: null,
    VISITED: 1
}
export class Maze {
    private data: TMazeCell[];
    constructor(
        public Width: number,
        public Height: number
    ) {
        if (this.Width % 2 == 0)
            this.Width--;
        if (this.Height % 2 == 0)
            this.Height--;
        this.data = new Array(Width * Height);
    }

    public Get(c: ICoordinates): TMazeCell {
        c = trunc(c);
        if (c.x < 0 || c.y < 0 || c.x > this.Width || c.y > this.Height)
            return MazeCell.EMPTY;
        return this.data[c.x + c.y * this.Width];
    }

    public Set(c: ICoordinates, value: TMazeCell) {
        c = trunc(c);
        if (c.x < 0 || c.y < 0 || c.x > this.Width || c.y > this.Height)
            return false;
        this.data[c.x + c.y * this.Width] = value;
    }

    public DrawBorder(v: TMazeCell) {
        this.DrawHLine({ x: 0, y: 0 }, v);
        this.DrawHLine({ x: 0, y: this.Height - 1 }, v);
        this.DrawVLine({ x: 0, y: 0 }, v);
        this.DrawVLine({ x: this.Width - 1, y: 0 }, v);
    }
    public DrawFillRect(s: ICoordinates, e: ICoordinates, v: TMazeCell = MazeCell.WALL) {
        for (var y = s.y; y < e.y; y++) {
            this.DrawHLine({ x: s.x, y }, v, e.x - s.x);
        }
    }
    public DrawHLine(s: ICoordinates, v: TMazeCell = MazeCell.WALL, width?: number) {
        if (width == null)
            width = this.Width;
        for (var x = 0; x < width; x++) {
            this.Set({ x: s.x + x, y: s.y }, v);
        }
    }
    public DrawVLine(s: ICoordinates, v: TMazeCell = MazeCell.WALL, height?: number) {
        if (height == null)
            height = this.Height;
        for (var y = 0; y < height; y++) {
            this.Set({ x: s.x, y: s.y + y }, v);
        }
    }

    dump() {
        var r: string[] = [];
        for (var y = 0; y < this.Height; y++) {
            var s = '';
            for (var x = 0; x < this.Width; x++) {
                var b = this.Get({ x, y });
                if (b == null)
                    s += ' ';
                else
                    s += b;
            }
            r.push(s);
        }
        return r;
    }
    save() {
        var lines = this.dump();
        return `# ${this.Width} x ${this.Height}\n`
            + lines.join('\n');
    }
    static read(s: string): Maze {
        var lines = s.split('\n');
        lines = lines.filter(l => !l.startsWith('#'));
        var r = new Maze(lines[0].length, lines.length);
        for (var y = 0; y < r.Height; y++) {
            for (var x = 0; x < r.Width; x++) {
                var c = lines[x + y * r.Width];
                if (c != ' ')
                    r.Set({ x, y }, Number(c));
            }
        }
        return r;
    }
}