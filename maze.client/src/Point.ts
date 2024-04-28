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
