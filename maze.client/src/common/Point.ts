export type ICoordinates = { x: number, y: number };
export type IRect = {
    x: number,
    y: number,
    w: number,
    h: number
}
export class Point implements ICoordinates {
    static From(pt: ICoordinates): Point {
        return new Point(pt.x, pt.y);
    }
    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    constructor(
        private _x: number,
        private _y: number
    ) {
        this._x = Math.trunc(_x);
        this._y = Math.trunc(_y);
    }
    toString() {
        return `[${this.x},${this.y}]`;
    }
}

export function pt(x: number, y: number) {
    return new Point(x, y);
}
export function ptround(c:ICoordinates) {
    return pt(Math.round(c.x), Math.round(c.y));
}
export function ptrunc(c: ICoordinates) {
    return pt(Math.trunc(c.x), Math.trunc(c.y));
}
export function addPoint(pt: ICoordinates, add: ICoordinates): ICoordinates {
    return new Point(pt.x + add.x, pt.y + add.y);
}
export function subtractPoint(pt: ICoordinates, sub: ICoordinates): ICoordinates {
    return new Point(pt.x - sub.x, pt.y - sub.y);
}
export function mulPoint(pt: ICoordinates, multiply: number) {
    return new Point(pt.x * multiply, pt.y * multiply);
}
export function isSamePoint(p1: ICoordinates, p2: ICoordinates) {
    return p1.x == p2.x && p1.y == p2.y;
}
//warn: possible conflict with Excalibur Direction
//warn: order is important, see other functions
export const enum PointDirection {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3
}

export function getDirectionVec(d: PointDirection) {
    const dirs: ICoordinates[] = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 }
    ];
    return dirs[d];
}
/**
 * @returns point in direction [d]
 */
export function getPointInDirection(pos: ICoordinates, d: PointDirection): ICoordinates {
    const ofs = getDirectionVec(d);
    return { x: pos.x + ofs.x, y: pos.y + ofs.y };
}

export function getPointsDirection___(src: ICoordinates, dst: ICoordinates) {
    var rx = dst.x - src.x;
    var ry = dst.y - src.y;

}


/**
 * @returns 4 points around [c], [offset] can be specified, it is not controlling bounds
 */
export function getAroundPoints(c: ICoordinates, offset = 1) {
    var { x, y } = c;
    return [
        { x: x - offset, y },
        { x: x + offset, y },
        { x, y: y - offset },
        { x, y: y + offset }
    ];
    //faster than
    //return [
    //    this.getPointInDirection(c, Direction.Left, offset),
    //    this.getPointInDirection(c, Direction.Right, offset),
    //    this.getPointInDirection(c, Direction.Up, offset),
    //    this.getPointInDirection(c, Direction.Down, offset),
    //];
}


export function isInRect(pt: ICoordinates, r: IRect) {
    return pt.x >= r.x && pt.x < r.x + r.w && pt.y >= r.y && pt.y < r.y + r.h;
}

export class Rect implements IRect, IRect2 {
    constructor(
        private _x: number,
        private _y: number,
        private _w: number,
        private _h: number) {
    }
    public static fromPoints(s: ICoordinates, e: ICoordinates): Rect {
        return new Rect(s.x, s.y, e.x - s.x, e.y - s.y);
    }
    public static fromRect2(r: IRect2) {
        return new Rect(r.left, r.top, r.right - r.left, r.bottom - r.top);
    }
    public static fromRect(r: IRect) {
        return new Rect(r.x, r.y, r.w, r.h);
    }
    public get x() { return this._x; }
    public get y() { return this._y; }
    public get w() { return this._w; }
    public get h() { return this._h; }
    public get pos(): ICoordinates { return { x: this.x, y: this.y }; }

    public get left() { return this.x; }
    public get top() { return this.y; }
    public get right() { return this.x + this.w; }
    public get bottom() { return this.y + this.h; }
    toString() {
        return `[${this.x},${this.y},w=${this.w},h=${this.h}]`;
    }
}

export function getRectSize(r: IRect): ICoordinates {
    return { x: r.w, y: r.h };
}
type IRect2 = {
    top: number,
    left: number,
    right: number,
    bottom: number
}
export function isRectIntersecting2(r1: IRect, r2: IRect): boolean {
    var a1 = Rect.fromRect(r1);
    var a2 = Rect.fromRect(r2);
    if (a1.left < a2.right && a1.right > a2.left &&
        a1.top > a2.bottom && a1.bottom < a2.top)
        return true;
    return false;
}

export function isRectIntersecting(A: IRect, B: IRect): boolean {
    function valueInRange(value: number, min: number, max: number) {
        return (value >= min) && (value <= max);
    }

    var xOverlap = valueInRange(A.x, B.x, B.x + B.w) ||
        valueInRange(B.x, A.x, A.x + A.w);

    var yOverlap = valueInRange(A.y, B.y, B.y + B.h) ||
        valueInRange(B.y, A.y, A.y + A.h);

    return xOverlap && yOverlap;
}

export function getRectOffset(r: IRect, offset: number): IRect {
    return new Rect(r.x - offset, r.y - offset, r.w + offset * 2, r.h + offset * 2);
}