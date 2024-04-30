import * as ex from 'excalibur';
import { IsoActor } from '../extra/IsoActor';
import { batmanData } from './BatmanResources';
import { Point, addPoint, getDirectionVec } from '../common/Point';
import { IsoHelper, IsoTileKind } from './IsoHelper';

export enum MobType {
    Dogman = 0,
    ChinaHead = 1,
    Armchair = 2,
    Dog = 3,
    Man = 4,
    Head = 5
}
export class BatmanMob extends IsoActor {
    mobtype: number;
    constructor(mobtype: MobType) {
        super(batmanData.Mobs_Sheet);
        this.mobtype = mobtype;
        this.anims = batmanData.getMobAnimations(mobtype);
        this.moveSpeed = 150;
        if (mobtype == MobType.ChinaHead)
            this.moveSpeed = 250;
    }
    update(game: ex.Engine, delta) {
        super.update(game, delta);
        if (!this.isMoving) {
            var h = new IsoHelper(this.isoMap);
            if (ex.randomIntInRange(0, 100) < 20)
            {
                var dir = ex.randomIntInRange(0, 3);
                var r = getDirectionVec(dir);
                var newpos = addPoint(Point.From(this.tilepos), r);
                var nk = h.getKind(newpos);
                if (nk == IsoTileKind.ROAD)
                    this.moveToIso(r.x, r.y);
            }
        }
    }
}