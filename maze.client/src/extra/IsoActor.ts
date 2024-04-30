import * as ex from 'excalibur';
import { ICoordinates, Point } from '../common/Point';

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
        this.sheet = sheet;
        this.anims = [
            ex.Animation.fromSpriteSheet(this.sheet, [0], 200, ex.AnimationStrategy.Loop),
        ];
    }
    scaleFlipX(flip: boolean) {
        if (flip)
            this.scale = ex.vec(-this.zoom, this.zoom);
        else
            this.scale = ex.vec(this.zoom, this.zoom);
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
        this.actions
            .callMethod(() => this.setMoving(rx, ry))
            .moveTo(pt, speed)
            .callMethod(() => {
                this.isMoving = false;
                this.onMoveDone();
            });
    }
    setMoving(rx: number, ry: number) {
        if (rx == 1 || ry == 1) {
            this.graphics.use(this.anims[0]);
        } else {
            this.graphics.use(this.anims[1]);
        }
        this.scaleFlipX((rx == 0 && ry == 1) || (rx == 0 && ry == -1));
    }
    onMoveDone() {
    }
}