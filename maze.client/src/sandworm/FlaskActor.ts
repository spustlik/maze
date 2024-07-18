import * as ex from 'excalibur';
import { resources } from './resources';
import { Flask } from './Flask';
import { SandwormScene } from './sandwormScene';

export class FlaskActor extends ex.Actor {
    public readonly flask: Flask;
    private get parentScene(): SandwormScene { return this.scene as SandwormScene; }
    constructor(flask: Flask) {
        super({ anchor: ex.vec(0.5, 0), name: 'flask#' + flask.index, width: resources.flacon.width, height: resources.flacon.height });
        this.flask = flask;
        const fa = new ex.Actor({ anchor: this.anchor, z: 1 });
        fa.graphics.use(resources.flacon);
        this.addChild(fa);
        this.on('pointerdown', (ev) => this.doOnClick(ev));
    }

    doOnClick(ev: ex.Input.PointerEvent): void {
        this.parentScene.onFlaskClick(this.flask, ev);
    }

    private colorActors: ex.Actor[] = [];
    updateVisual() {
        for (let ci = 0; ci < Flask.MAX; ci++) {
            const color = this.flask.Colors[ci];
            let ca = this.colorActors[ci];

            if (color == undefined && ca == undefined)
                continue;

            if (color == undefined) {
                this.removeChild(ca);
                this.colorActors[ci] = undefined;
                continue;
            }
            if (ca == undefined) {
                ca = new ex.Actor({ anchor: this.anchor, name: 'sand#' + ci });
                this.addChild(ca);
                this.colorActors[ci] = ca;                
            }
            ca.graphics.opacity = 1;
            ca.graphics.use(resources.getFlaconState(ci, resources.getSandColor(color)));
        }
    }
    updatePosition() {
        this.pos = this.getPosition();
        this.rotation = 0;
    }
    getPosition() {
        const START_X = 60;
        const START_Y = 50;
        const MARGIN_X = 20;
        const MARGIN_Y = 50;
        const COLUMNS = this.parentScene.board.Count / 2;
        this.updateVisual();
        const w = this.width;
        const h = this.height;
        const fx = START_X + (this.flask.index % COLUMNS) * (w + MARGIN_X);
        const fy = START_Y + Math.trunc(this.flask.index / COLUMNS) * (h + MARGIN_Y);
        return ex.vec(fx, fy);
    }

    animSelectionAsync(opts: { select: boolean; anim: boolean; }) {
        const POSY = opts.select ? -30 : 0;
        const pos = this.getPosition();
        const SPEED = opts.anim ? 300 : 10;

        return this.actions
            .moveTo(ex.vec(pos.x, pos.y + POSY), SPEED)
            .toPromise();
    }
    animNotPourAsync() {
        const SPEED = 300;
        return this.actions
            .repeat(rb => {
                rb
                    .moveBy(ex.vec(-10, 0), SPEED)
                    .moveBy(ex.vec(10, 0), SPEED)
                    .moveBy(ex.vec(10, 0), SPEED)
                    .moveBy(ex.vec(-10, 0), SPEED);
            }, 3)
            .toPromise();
    }
    animPourStartAsync(fdst: FlaskActor) {
        const SPEED = 500;
        const SPEEDR = 3;
        return this.actions
            .runAction(new ex.ParallelActions([
                new ex.MoveTo(this, fdst.pos.x, fdst.pos.y - 20, SPEED),
                new ex.RotateTo(this, Math.PI / 2, SPEEDR, ex.RotationType.Clockwise)
            ]))
            .toPromise();
    }
    animPourEndAsync() {
        const pos = this.getPosition();
        const SPEED = 500;
        const SPEEDR = 3;
        return this.actions
            //.delay(300)
            .rotateTo(0, SPEEDR, ex.RotationType.CounterClockwise)
            .moveTo(pos, SPEED)
            .toPromise();
    }
}
