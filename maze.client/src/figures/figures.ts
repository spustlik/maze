import { ICoordinates, Point, PointDirection, addPoint, mulPoint, pt } from "../common/Point";
import { MapType } from "../common/common";

export type FigureColor = 'R' | 'G' | 'B' | 'Y';
export type FigureColorX = FigureColor | 'x';
export type FigDirection = 'N' | 'E' | 'S' | 'W';

export const FigureColors = 'R,G,B,Y'.split(',') as FigureColor[];
export const FigDirections = 'N,E,S,W'.split(',') as FigDirection[];

export function colorToStr(c: FigureColor) {
    const MAP: MapType<FigureColor, string> = { R: 'Red', G: 'Green', B: 'Blue', Y: 'Yellow' };
    return MAP[c];
}
export function figDirToPointDir(dir: FigDirection): PointDirection {
    const MAP: MapType<FigDirection, PointDirection> = {
        'N': PointDirection.Up,
        'E': PointDirection.Right,
        'S': PointDirection.Down,
        'W': PointDirection.Left
    };
    return MAP[dir];
}
export function addPointInDir(p: ICoordinates, dir: FigDirection, len: number = 1): ICoordinates {
    var DOFS: MapType<FigDirection, ICoordinates> = {
        'S': pt(1, 0),
        'W': pt(0, 1),
        'N': pt(-1, 0),
        'E': pt(0, -1)
    };
    let ofs = DOFS[dir];
    return addPoint(p, mulPoint(ofs, len));
}

export function oppo(d: FigDirection) {
    var OPOS: MapType<FigDirection, FigDirection> = {
        'S': 'N',
        'W': 'E',
        'N': 'S',
        'E': 'W'
    };
    let opo = OPOS[d];
    return opo;
}

export class FigurePos {
    static readonly endOfPlan = 9 * 4;
    constructor(
        public readonly color: FigureColor,
        position?:number
    ) {
        this._position = position ?? 0;
    }
    _position: number = 0;

    get isHome() { return this.home != undefined; }
    get isGoal() { return this.goal != undefined; }
    get isPlan() { return this.plan != undefined; }
    get home() { return (this._position >= 50 && this._position < 100) ? this._position - 50 : undefined; }
    set home(v: number) { this._position = 50 + v; }
    get goal() { return (this._position >= 100) ? this._position - 100 : undefined; }
    set goal(v: number) { this._position = 100 + v; }
    get plan() { return (this._position < 50) ? this._position : undefined; }
    set plan(v: number) { this._position = v; }
    equals(p: FigurePos): unknown {
        return this._position == p._position;
    }
    toString() {
        let s = `FIG:${this.color},`;
        if (this.isHome)
            s += `home:${this.home}`;
        else if (this.isGoal)
            s += `goal:${this.goal}`;
        else if (this.isPlan)
            s += `plan:${this.plan}`;
        else
            s += `?:${this._position}`;
        return s;
    }
}

