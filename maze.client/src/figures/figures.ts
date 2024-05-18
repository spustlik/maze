import { ICoordinates, Point, PointDirection, addPoint, mulPoint, pt } from "../common/Point";
import { MapType } from "../common/common";
import * as ex from 'excalibur';
import { FiguresBoard } from "./figuresBoard";

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
    constructor(
        public readonly color: FigureColor
    ) {
    }
    private _position: number;
    get isHome() { return this.home != undefined; }
    get isGoal() { return this.goal != undefined; }
    get isPlan() { return this.plan != undefined; }
    get home() { return (this._position >= 50 && this._position < 100) ? this._position - 50 : undefined; }
    set home(v: number) { this._position = 50 + v; }
    get goal() { return (this._position >= 100) ? this._position - 100 : undefined; }
    set goal(v: number) { this._position = 100 + v; }
    get plan() { return (this._position < 50) ? this._position : undefined; }
    set plan(v: number) { this._position = v; }
    toString() {
        return this.isHome ? 'home:' + this.home
            : this.isPlan ? 'plan:' + this.plan
                : this.isGoal ? 'goal:' + this.goal
                    : '?' + this._position;
    }
}

export class FigureActor extends ex.Actor {
    constructor(color:FigureColor,index:number, args?: ex.ActorArgs) {
        super(args);
        this.position = new FigurePos(color);
        this.position.home = index;
        this.name = `player_${color}_${index}`;

    }
    private _isDirty: boolean = true;
    public get isDirty() { return this._isDirty; }
    private _tilepos: ICoordinates;
    public get tilepos() { return this._tilepos; }
    private _position: FigurePos;
    public get position() { return this._position }
    public set position(p: FigurePos) {
        this._position = p;
        this._isDirty = true;
    }
    public get board() { return ((this.scene as any).board as FiguresBoard); }

    update(game: ex.Engine, delta: number) {
        super.update(game, delta);
        if (this.isDirty) {
            this._isDirty = false;
            this._tilepos = this.board.figPosToTile(this._position);
            this.pos = this.board.tileToWorld(this.tilepos);
            this.z = this.pos.y;
        }
    }
}