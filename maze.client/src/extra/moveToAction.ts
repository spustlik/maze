import * as ex from 'excalibur';
import { IsoActor } from './IsoActor';

//copy of ex.MoveTo action, refactored
class MyMoveTo implements ex.Action {
    id: number
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
        this.id == new ex.MoveTo(this.entity, destx, desty, speed).id;
        this._tx = entity.get(ex.TransformComponent);
        this._motion = entity.get(ex.MotionComponent);
        this._end = new ex.Vector(destx, desty);
        this._speed = speed;
    }

    protected start() {
        this._started = true;
        this._start = new ex.Vector(this._tx.pos.x, this._tx.pos.y);
        this._distance = this._start.distance(this._end);
        this._dir = this._end.sub(this._start).normalize();
    }

    public update(_delta: number): void {
        if (!this._started) {
            this.start();
        }
        const m = this._dir.scale(this._speed);
        this._motion.vel = ex.vec(m.x, m.y);

        if (this.isComplete(this.entity)) {
            this._tx.pos = ex.vec(this._end.x, this._end.y);
            this._motion.vel = ex.vec(0, 0);
        }
    }

    public isComplete(entity: ex.Entity): boolean {
        if (this._stopped)
            return true;
        const tx = entity.get(ex.TransformComponent);
        const distance = tx.pos.distance(this._start);
        if (distance >= this._distance) //not using magic multiplier 0.9
            return true;
        return false;
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

export class MyMoveToIso extends MyMoveTo {
    constructor(
        public entity: IsoActor,
        private rel: ex.Vector,
        dest: ex.Vector,
        speed: number
    ) {
        super(entity, dest.x, dest.y, speed);
    }
    public start() {
        super.start();
        this.entity.setMoveGraphic(this.rel.x, this.rel.y);
    }
    public update(_delta: number): void {
        super.update(_delta);
        if (this.isComplete(this.entity)) {
            this.entity.isMoving = false;
            this.entity.onMoveDone();
        }
    }
}

