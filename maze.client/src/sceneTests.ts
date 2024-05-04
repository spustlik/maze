import * as ex from 'excalibur';
import { loadResources } from './extra/extra';
import { uiResourceData, uiResources } from './extra/uiResources';
import { batmanData, batmanResources } from './batman/BatmanResources';

let MYACTIONID = 9999;
class MyMoveTo implements ex.Action {
    id = MYACTIONID++;
    private _tx: ex.TransformComponent;
    private _motion: ex.MotionComponent;
    public x: number;
    public y: number;
    private _start: ex.Vector;
    private _end: ex.Vector;
    private _dir: ex.Vector;
    private _speed: number;
    private _distance: number;
    private _started = false;
    private _stopped = false;
    constructor(
        public entity: ex.Entity,
        destx: number,
        desty: number,
        speed: number
    ) {
        this._tx = entity.get(ex.TransformComponent);
        this._motion = entity.get(ex.MotionComponent);
        this._end = new ex.Vector(destx, desty);
        this._speed = speed;
    }

    public update(_delta: number): void {
        if (!this._started) {
            this._started = true;
            this._start = new ex.Vector(this._tx.pos.x, this._tx.pos.y);
            this._distance = this._start.distance(this._end);
            this._dir = this._end.sub(this._start).normalize();
        }
        const m = this._dir.scale(this._speed);
        this._motion.vel = ex.vec(m.x, m.y);

        if (this.isComplete(this.entity)) {
            this._tx.pos = ex.vec(this._end.x, this._end.y);
            this._motion.vel = ex.vec(0, 0);
        }
    }

    public isComplete(entity: ex.Entity): boolean {
        const tx = entity.get(ex.TransformComponent);
        return this._stopped || new ex.Vector(tx.pos.x, tx.pos.y).distance(this._start) >= this._distance;
    }

    public stop(): void {
        this._motion.vel = ex.vec(0, 0);
        this._stopped = true;
    }

    public reset(): void {
        this._started = false;
        this._stopped = false;
    }
}



class TestScene extends ex.Scene {
    isoMap: ex.IsometricMap;
    constructor() {
        super();
    }
    onPreLoad(loader: ex.DefaultLoader) {
        console.log('onPreload-test');
        super.onPreLoad(loader);
        loadResources(loader, uiResources);
        loadResources(loader, batmanResources);
    }
    async onInitialize(game: ex.Engine) {
        console.log('onInitialize-test');
        super.onInitialize(game);

        /*
        //draw font sprites
        for (var i = 0; i < uiResourceData._fontSpriteSheet.rows; i++) {
            var ft = new ex.Actor({
                pos: ex.vec(30 + 12 * i, 30),
                width: 100,
                height: 100
            });
            ft.graphics.use(uiResourceData._fontSpriteSheet.getSprite(0, i));
            this.add(ft);
        }
        */

        this.isoMap = new ex.IsometricMap({
            pos: ex.vec(game.drawWidth / 2, 20),
            tileWidth: 100,
            tileHeight: 50,
            columns: 30,
            rows: 30,
            //renderFromTopOfGraphic: true
        });

        var t = new ex.Label({
            pos: ex.vec(30, 60),
            text: uiResourceData.Font.alphabet,
            spriteFont: uiResourceData.Font
        });
        this.add(t);

        var s = new ex.Actor({
            pos: ex.vec(20, 20),
            name: 'SPRITE',
            scale: ex.vec(2, 2)
        });
        s.graphics.use(batmanData.Mobs_Sheet.getSprite(0, 13));
        this.add(s);

        var s2 = new ex.Actor({
            pos: ex.vec(20, 20),
            name: 'SPRITE2',
            scale: ex.vec(2, 2)
        });
        s2.graphics.use(batmanData.Mobs_Sheet.getSprite(0, 9));
        this.add(s2);
    }
    onActivate(ctx: ex.SceneActivationContext) {

    }
    onPreUpdate() {
        var s1 = this.actors.find(a => a.name == 'SPRITE');
        var s2 = this.actors.find(a => a.name == 'SPRITE2');
        if (!s1.actions.getQueue().hasNext()) {
            const Q = 21;
            s1.pos = ex.vec(0, 0);
            for (var i = 0; i < 20; i++) {
                //s1.actions
                //    .moveTo(ex.vec(i * Q, i * Q), 150)
                //    .callMethod(() => {
                //        s1.graphics.use(batmanData.Mobs_Sheet.getSprite(0, i %4));
                //    });                    ;
                s1.actions.runAction(new MyMoveTo(s1, i * Q, i * Q, 150));
                s1.actions
                    .callMethod(() => {
                        //console.log('set graphics')
                        s1.graphics.use(batmanData.Mobs_Sheet.getSprite(0, i %4));
                    });
            }
        }
        if (!s2.actions.getQueue().hasNext()) {
            //s2.pos = ex.Vector.Zero;
            for (var i = 0; i < 10; i++) {
                var target = this.isoMap.tileToWorld(ex.vec(i, 0));
                //s.actions.moveTo(target, 150);
                s2.actions.runAction(new MyMoveTo(s2, target.x, target.y, 150));
            }
            
        }
    }
}
export function createTestScene() {
    var scene = new TestScene();
    return scene;
}