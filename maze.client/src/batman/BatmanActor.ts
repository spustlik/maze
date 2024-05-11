import * as ex from 'excalibur';
import { IsoActor } from "../extra/IsoActor";
import { batmanData } from './BatmanResources';

export class Batman extends IsoActor {
    constructor() {
        super(batmanData.Batman_Sheet);
        this.name = 'BATMAN';
        this.offset = ex.vec(0, -4);
        this.anims = [
            ex.Animation.fromSpriteSheet(this.sheet, [1, 2], 200, ex.AnimationStrategy.Loop),
            ex.Animation.fromSpriteSheet(this.sheet, [3, 4], 200, ex.AnimationStrategy.Loop),
            //ex.Animation.fromSpriteSheet(this.sheet, [0, 7, 0, 0, 0, 0, 0, 7, 0, 7, 0], 500, ex.AnimationStrategy.Loop),
            new ex.Animation({
                strategy: ex.AnimationStrategy.Loop,
                frameDuration: 1000,
                frames: [0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(f => ({ graphic: this.sheet.getSprite(0, f) }))
            })
        ];
        this.moveSpeed = 150;
    }
    moveToIso(rx: number, ry: number) {
        super.moveToIso(rx, ry);
        console.log(`moving #${this.name} to ${this.tilepos} (r:${rx},${ry})`); 
    }
    onMoveDone() {
        setTimeout(() => {
            if (this.isMoving)
                return;
            //boring
            this.setGraphicAnim(2);
        },100);
    }
    update(g: ex.Engine, delta) {
        super.update(g, delta);
    }
}