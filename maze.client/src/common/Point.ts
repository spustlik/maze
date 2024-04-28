export type ICoordinates = { x: number, y: number };

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
    public Add(a: ICoordinates): Point {
        return new Point(this.x + a.x, this.y + a.y);
    }
}

//warn: possible conflict with Excaibur Direction
//warn: order of is importyant, see other functions
export const enum PointDirection {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3
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

/**
 * @returns point in direction [d], it is not controlling bounds
 */
export function getPointInDirection(pos: ICoordinates, d: PointDirection): ICoordinates {
    const OFFSET_TABLE = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 }
    ];
    return { x: pos.x + OFFSET_TABLE[d].x, y: pos.y + OFFSET_TABLE[d].y };
}
