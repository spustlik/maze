﻿import { ICoordinates } from "../common/Point";
import * as ex from 'excalibur';
import { FiguresBoard } from "./figuresBoard";
import { FigureColor, FigurePos } from "./figures";


export class FigureActor extends ex.Actor {
    constructor(color: FigureColor, index: number, args?: ex.ActorArgs) {
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
    public get position() { return this._position; }
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
            let newPos = this.board.tileToWorld(this.tilepos);
            if (this.pos.equals(ex.Vector.Zero)) {
                this.pos = newPos;
            } else {
                this.actions
                    .moveTo(newPos, 500);
            }
            //this.z = this.pos.y;
            this.z = 1 + Math.max(this._tilepos.x, this._tilepos.y);
        }
    }
}