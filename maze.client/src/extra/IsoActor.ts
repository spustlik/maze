import * as ex from 'excalibur';
import { MyMoveToIso } from './moveToAction';

export interface IIsoScene {
    isoMap: ex.IsometricMap
}
export class IsoActor extends ex.Actor {
    protected sheet: ex.SpriteSheet;
    protected anims: ex.Animation[];
    isMoving: boolean;
    protected get isoMap(): ex.IsometricMap { return (this.scene as unknown as IIsoScene).isoMap; }
    public tilepos = ex.vec(0, 0);
    public zoom = 2;
    public moveSpeed = 100;
    constructor(sheet: ex.SpriteSheet) {
        super({
            x: 20, y: 20,
            width: 24, height: 24,
            z: 20000
        });
        //this.name = (this as any).constructor.name;
        this.sheet = sheet;
        this.anims = [
            ex.Animation.fromSpriteSheet(this.sheet, [0], 200, ex.AnimationStrategy.Loop),
        ];
    }

    moveToIso(rx: number, ry: number) {
        this.isMoving = true;
        var newpos = this.tilepos.add(ex.vec(rx, ry));
        //console.log(`moving #${this.id} from ${this.tilepos} to ${newpos} (r:${rx},${ry})`);
        this.tilepos = newpos;
        var pt = this.isoMap.tileToWorld(this.tilepos);
        let speed = this.moveSpeed;
        if (rx == 0 && ry == 0)
            speed = Number.MAX_SAFE_INTEGER;
        this.actions.getQueue().add(new MyMoveToIso(this, ex.vec(rx, ry), pt, speed));
        /*
        this.actions
            .callMethod(() => this.setMoving(rx, ry))
            //.runAction(new MyMoveToAction(pt,speed))
            .moveTo(pt, speed)
            .callMethod(() => {
                setTimeout(() => {
                    this.isMoving = !this.actions.getQueue().isComplete();
                    this.onMoveDone();
                });
            });
        */

    }
    _lastAnim: number;
    setGraphicAnim(i: number) {
        if (this._lastAnim == i)
            return;
        this._lastAnim = i;
        this.graphics.use(this.anims[i]);
    }
    scaleFlipX(flip: boolean) {
        var scale = flip ? ex.vec(-this.zoom, this.zoom) : ex.vec(this.zoom, this.zoom);
        if (this.scale.equals(scale))
            return;
        this.scale = scale;
    }
    setMoving(rx: number, ry: number) {
        if (rx > 0 || ry > 0) {
            this.setGraphicAnim(0);
        } else {
            this.setGraphicAnim(1);
        }
        this.scaleFlipX((rx == 0 && ry > 0) || (rx == 0 && ry < 0));
    }
    onMoveDone() {
    }
}