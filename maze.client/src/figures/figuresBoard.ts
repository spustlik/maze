import * as ex from 'excalibur';
import { ICoordinates, addPoint, pt, ptround, ptrunc, subtractPoint } from "../common/Point";
import { FigDirection, FigDirections, FigureColor, FigureColorX, FigureColors, FigurePos, addPointInDir, oppo } from './figures';
import { MapType } from '../common/common';
import { figuresData, figuresResources } from './figuresResource';

//10x10
export class FiguresBoard {
    private WX = 0;
    private WY = 20;
    private DX = 50;
    private DY = 29;
    
    constructor(private scene: ex.Scene) {
        this.WX = scene.engine.halfDrawWidth;
    }
    tileToWorld(pos: ICoordinates): ex.Vector {
        return ex.vec(
            this.WX + pos.x * this.DX - pos.y * this.DX,
            this.WY + pos.y * this.DY + pos.x * this.DY
        );
    }
    worldToTile(vec: ICoordinates) {
        vec = ptrunc(vec);
        let x = 0.5 +  (vec.x / this.DX + vec.y / this.DY - this.WY / this.DY - this.WX / this.DX) / 2;
        let y = 1 + vec.y / this.DY - this.WY / this.DY - x;
        return ptround(pt(x, y));
    }
    figPosToTileAbs(p: FigurePos): ICoordinates {
        if (p.isGoal)
            return this.boardData.goal[p.goal];
        if (p.isHome)
            return this.boardData.home[p.home];
        //if (p.isPlan)
        //    return this.boardData[p.plan];
        console.error('Unknown fig position', p.color,p);
    }
    figPosToTile(p: FigurePos): ICoordinates {
        let pt = this.figPosToTileAbs(p);
        if (pt) {
            const ci = FigureColors.indexOf(p.color);
            pt = this.rotate90(pt, ci); 
        }
        return pt;
    }
    addTile(pos: ICoordinates, color?: FigureColorX, joints: number = 15) {
        var p = this.tileToWorld(pos);
        var a = new ex.Actor({ pos: p });
        this.scene.add(a);
        if (color) {
            //console.log('addTile', pos.x, pos.y, color, joints);
            a.graphics.use(figuresData.getPlanSprite(color, joints));
        }
        return a;
    }
    tileLine(pt1: ICoordinates, pt2: ICoordinates, color: FigureColorX, jStart: FigDirection[], jMiddle: FigDirection[], jEnd: FigDirection[]) {
        if (pt1.x != pt2.x && pt1.y != pt2.y) {
            console.error(`Invalid line coordinates [${pt1.x},${pt1.y}] [${pt2.x},${pt2.y}]`);
            return;
        }
        let ofs = pt(pt2.x - pt1.x, pt2.y - pt1.y);
        let p = pt1;
        let len = Math.abs(ofs.x + ofs.y);
        ofs = pt(ofs.x / len, ofs.y / len);
        //console.log('drawline', pt1, ofs, len);
        for (var i = 0; i <= len; i++) {
            let j = i == 0 ? jStart : i == len ? jEnd : jMiddle;
            this.addTile(p, color, figuresData.dirsToJoints(j));
            p = addPoint(p, ofs);
        }
    }
    rotate90(p: ICoordinates, cnt: number = 1) {
        for (var i = 0; i < cnt; i++) {
            p = pt(9 - p.y, p.x);
        }
        return p;
    }
    rotateDir(d: FigDirection, cnt: number) {
        let i = FigDirections.indexOf(d) + cnt;
        i = i % FigDirections.length;
        return FigDirections[i];
    }
    public boardData = this._getBoardData();
    private _getBoardData() {
        const pos_home = pt(0, 1);
        const pos_goal = pt(1, 4);
        const pos_start = pt(0, 3);
        const pos_ground = pt(1, 3);
        const pointsInDir = (pt: ICoordinates, dir: FigDirection, len: number): ICoordinates[] => {
            const result: ICoordinates[] = [];
            for (var i = 0; i < len; i++) {
                result.push(pt);
                pt = addPointInDir(pt, dir, 1);
            }
            return result;
        }
        const ground: ICoordinates[][] = [];
        {
            let s: ICoordinates = pos_ground;
            let e = addPointInDir(s, 'S', 2);
            ground.push(pointsInDir(s, 'S', 3));

            s = addPointInDir(e, 'E', 1);
            e = addPointInDir(s, 'E', 2);
            ground.push(pointsInDir(s, 'E', 3));

            s = addPointInDir(e, 'S', 1);
            ground.push(pointsInDir(s, 'S', 2));
        }
        const result = {
            home: [
                pos_home,
                addPointInDir(pos_home, 'S'),
                addPointInDir(pos_home, 'W'),
                addPointInDir(addPointInDir(pos_home, 'S'), 'W')
            ],
            goal: pointsInDir(pos_goal, 'S', 4),
            goalPointer: addPointInDir(pos_goal, 'N', 2),
            start: [pos_start],
            ground: ground
        };
        return result;
    }
    drawColor(c: FigureColor) {
        let ci = FigureColors.indexOf(c);
        const rotate = (p: ICoordinates) => this.rotate90(p, ci);
        const rotateDirs = (dirs: FigDirection[]) => dirs.map(d => this.rotateDir(d, ci));
        const rotTileLine = (pt1: ICoordinates, pt2: ICoordinates, color: FigureColorX, js: FigDirection[], jm: FigDirection[], je: FigDirection[]) => {
            pt1 = rotate(pt1);
            pt2 = rotate(pt2);
            js = rotateDirs(js);
            jm = rotateDirs(jm);
            je = rotateDirs(je);
            this.tileLine(pt1, pt2, color, js, jm, je);
        };
        const dt = this.boardData;
        //home
        rotTileLine(dt.home[0], dt.home[1], c, [], [], []);
        rotTileLine(dt.home[2], dt.home[3], c, [], [], []);

        //goal
        rotTileLine(dt.goal[0], dt.goal[3], c, ['N', 'S'], ['N', 'S'], ['N']);
        {
            //goal pointer
            const po_pos = rotate(dt.goalPointer);
            const po = new ex.Actor({ pos: this.tileToWorld(po_pos), offset: ex.vec(0, -10) });
            po.graphics.use(figuresData.getPoiner(c, this.rotateDir('S', ci)));
            this.scene.add(po);
        }
        //start
        rotTileLine(dt.start[0], dt.start[0], c, ['W', 'S'], [], []);


        //ground
        rotTileLine(dt.ground[0][0], dt.ground[0][2], 'x', ['N', 'S'], ['N', 'S'], ['N', 'E']);
        rotTileLine(dt.ground[1][0], dt.ground[1][2], 'x', ['W', 'E'], ['W', 'E'], ['W', 'S']);
        rotTileLine(dt.ground[2][0], dt.ground[2][1], 'x', ['N', 'S'], [], ['N', 'S', 'W']);
    }

    drawPlan() {
        for (var c of FigureColors) {
            this.drawColor(c);
        }
    }
}