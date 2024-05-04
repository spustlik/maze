import * as ex from 'excalibur';
import { IsoActor } from '../extra/IsoActor';
import { batmanData } from './BatmanResources';
import { Point, PointDirection, addPoint, getDirectionVec } from '../common/Point';
import { IsoHelper, IsoTileKind } from './IsoHelper';

export enum MobType {
    Dogman = 0,
    ChinaHead = 1,
    Armchair = 2,
    Dog = 3,
    Man = 4,
    PirateHead = 5
}
export class BatmanMob extends IsoActor {
    mobtype: number;
    constructor(mobtype: MobType) {
        super(batmanData.Mobs_Sheet);
        this.mobtype = mobtype;
        this.anims = batmanData.getMobAnimations(mobtype);
        this.offset = ex.vec(0, -4);
        this.moveSpeed = 150;
        if (mobtype == MobType.ChinaHead)
            this.moveSpeed = 250;
    }
    update(game: ex.Engine, delta) {
        super.update(game, delta);
    }

    _lastdir: PointDirection
    onPreUpdate() {
        if (!this.isMoving) {
            // skace:-(
            //this.moveToIso(1, 0);
            //return;

            return;

            var h = new IsoHelper(this.isoMap);
            //if (ex.randomIntInRange(0, 100) < 20)
            {
                // try go in last direction, else random, but always on ROAD
                const tryDir = (d: PointDirection) => {
                    var r = getDirectionVec(d);
                    var newpos = addPoint(Point.From(this.tilepos), r);
                    var nk = h.getKind(newpos);
                    if (nk == IsoTileKind.ROAD) {
                        this.moveToIso(r.x, r.y);
                        return true;
                    }
                    return false;
                }
                if (this._lastdir != undefined && tryDir(this._lastdir))
                    return;
                this._lastdir = ex.randomIntInRange(0, 3);
                tryDir(this._lastdir);
            }
        }
    }
}