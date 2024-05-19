import { ICoordinates } from "../common/Point";
import * as ex from 'excalibur';
import { FiguresBoard } from "./figuresBoard";
import { FigureColor, FigurePos } from "./figures";
import { figuresData } from "./figuresResource";


export class FigureActor extends ex.Actor {
    constructor(color: FigureColor, index: number,) {
        super({
            //see resetgr offset: ex.vec(-5, -17)
        });
        this.position = new FigurePos(color);
        this.position.home = index;
        this.name = `player_${color}_${index}`;
        this.resetGraphics();
    }
    private _isDirty: boolean = true;
    public get isDirty() { return this._isDirty; }
    private _tilepos: ICoordinates;
    public get tilepos() { return this._tilepos; }
    private _position: FigurePos;
    public get position() { return this._position; }
    public set position(p: FigurePos) {
        this._position = p;
        this._isDirty = true;
    }
    public get board() { return ((this.scene as any).board as FiguresBoard); }

    resetGraphics() {
        this.graphics.offset = ex.vec(-5, -17);
        this.graphics.use(figuresData.getFigure(this.position.color));
    }
    update(game: ex.Engine, delta: number) {
        super.update(game, delta);
        if (this.isDirty) {
            this._isDirty = false;
            this._tilepos = this.board.figPosToTile(this._position);
            let newPos = this.board.tileToWorld(this.tilepos);
            if (this.pos.equals(ex.Vector.Zero)) {
                //if pos=Zero, do not animate move
                this.pos = newPos;
            } else {
                this.actions
                    .moveTo(newPos, 500);
            }
            //this.z = this.pos.y;
            this.z = 1 + Math.max(this._tilepos.x, this._tilepos.y);
        }
    }
    die(p: FigurePos) {
        let die = figuresData.getDieAnim(this.position.color);
        die.anim.events.on('end', () => {
            if (p != null && !this.position.equals(p)) {
                this.position = p;
                this.pos = ex.Vector.Zero; // do not move
            }
            this.resetGraphics();
        });
        this.graphics.offset = die.offset;
        this.graphics.use(die.anim);
    }
}
