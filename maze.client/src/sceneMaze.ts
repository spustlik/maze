import * as ex from 'excalibur';
import { Maze, MazeCell, getBuilding } from './Maze';
import { MazeRaster } from './MazeRaster';
import { Point, getAroundPoints, subtractPoint } from './common/Point';
import { Batman } from './batman/BatmanActor';
import { BatmanMob } from './batman/BatmanMobActor';
import { batmanData, batmanResources } from './batman/BatmanResources';
import { IIsoScene, IsoActor } from './extra/IsoActor';
import { IsoHelper, IsoTileKind } from './batman/IsoHelper';
import { loadResources } from './extra/extra';


export class MazeScene extends ex.Scene implements IIsoScene {
    isoMap: ex.IsometricMap;
    batman: Batman;
    mazeMap: ex.Actor;
    rnd = new ex.Random(1234);
    constructor() {
        super();
    }

    onPreLoad(loader: ex.DefaultLoader) {
        console.log('onPreload-maze');
        super.onPreLoad(loader);
        loadResources(loader, batmanResources);
    }
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        //const maze = Maze.read(batmanResources.Maze1.data);
        //const maze = Maze.read(batmanResources.MazeT.data);
        //const maze = Maze.read(batmanResources.MazeTest2.data);
        const maze = Maze.read(batmanResources.MazeTest3.data);

        this.isoMap = new ex.IsometricMap({
            pos: ex.vec(game.drawWidth / 2, 20),
            tileWidth: 100,
            tileHeight: 50,
            columns: maze.Width,
            rows: maze.Height,
            //renderFromTopOfGraphic: true
        });
        //possible error, tileToWorld is not working ... this.isoMap.transform.scale = ex.vec(0.5, 0.5);
        this.isoMap.events.on('pointerdown', (evt: ex.PointerEvent) => {
            var tile = this.isoMap.getTileByPoint(evt.worldPos);
            if (tile)
                this.onTileClicked(tile, Point.From(tile));
        });
        this.add(this.isoMap);

        this.roadsTile(maze);
        //this.simpleTile(maze);

        this.batman = new Batman();
        this.add(this.batman);
        this.batman.moveToIso(0, 0);
        this.batman.moveToIso(1, 1);

        this.createMobs();
        this.addMazeMap(maze); //iso is changing transformation, zindex??
    }
    onTileClicked(tile: ex.IsometricTile, tilepos: Point) {
        console.log('tile clicked', tilepos);
        //var dir = getPointsDirection(this.batman.tilepos, tilepos);
        var ofs = subtractPoint(tilepos, this.batman.tilepos);
        this.batman.moveToIso(ofs.x, ofs.y);
    }
    update(game: ex.Engine, delta) {
        super.update(game, delta);
        this.camera.move(this.batman.pos, 0);
        if (game.input.keyboard.wasPressed(ex.Keys.Num7))
            return this.batman.moveToIso(-1, 0);
        if (game.input.keyboard.wasPressed(ex.Keys.Num1))
            return this.batman.moveToIso(0, 1);
        if (game.input.keyboard.wasPressed(ex.Keys.Num3))
            return this.batman.moveToIso(1, 0);
        if (game.input.keyboard.wasPressed(ex.Keys.Num9))
            return this.batman.moveToIso(0, -1);

        if (game.input.keyboard.wasPressed(ex.Keys.NumSubtract))
            return this.batman.offset = ex.vec(0, this.batman.offset.y - 1);
        if (game.input.keyboard.wasPressed(ex.Keys.NumAdd))
            return this.batman.offset = ex.vec(0, this.batman.offset.y + 1);
        if (game.input.keyboard.wasPressed(ex.Keys.NumMultiply)) {
            console.log('offset ' + this.batman.offset);
        }
    }
    roadsTile(maze: Maze) {
        var isoHelp = new IsoHelper(this.isoMap);
        isoHelp.setTilesKind(maze);
        for (let tile of this.isoMap.tiles) {
            let tilepos = ex.vec(tile.x, tile.y);
            var c = maze.Get(tilepos);
            if (c == MazeCell.WALL || c == MazeCell.VISITED) {
                //roads
                var points = getAroundPoints(tilepos).map(p => maze.Get(p) ?? MazeCell.VISITED);
                var ptstr = c + points.join("");
                tile.addGraphic(batmanData.getTileSprite(ptstr));
            } else {
                //buildings
                tile.addGraphic(batmanData.Roads_Water);
                var bld = new ex.Actor({
                    pos: this.isoMap.tileToWorld(tilepos).add(ex.vec(0,-20))
                });
                //probably error in ex ?!?
                //bld.pos = bld.pos.scale(this.isoMap.transform.scale);//. apply(bld.pos);

                var bi = getBuilding(c);
                if (bi>=0) {
                    var bc = bi % batmanData.Buildings_Sheet.columns;
                    var br = Math.trunc(bi / batmanData.Buildings_Sheet.columns);
                } else {
                    var bc = ex.randomIntInRange(0, batmanData.Buildings_Sheet.columns - 1, this.rnd);
                    var br = ex.randomIntInRange(0, batmanData.Buildings_Sheet.rows - 1, this.rnd);
                }
                //console.log('building', tilepos, c, bi, br, bc);
                let spr = batmanData.Buildings_Sheet.getSprite(bc, br);
                bld.graphics.use(spr);
                bld.z = 99999;
                this.add(bld);
            }
        }
    }
    simpleTile(maze: Maze) {
        var spriteSheet = batmanData.Roads_Sheet
        for (let tile of this.isoMap.tiles) {
            var c = maze.Get({ x: tile.x, y: tile.y });
            if (c == MazeCell.WALL)
                tile.addGraphic(spriteSheet.getSprite(0, 22));
            else //if (c == MazeCell.EMPTY)
                tile.addGraphic(spriteSheet.getSprite(0, 13));
        }
    }
    addMazeMap(maze: Maze) {
        var r = new MazeRaster(maze, this, 4);
        const mazeActor = new ex.ScreenElement(
            {
                pos: ex.vec(5, 5),
                anchor: ex.vec(0, 0),
                width: r.width,
                height: r.height,
                opacity: 0.7
            }
        );
        mazeActor.z = 999999;
        // screenElement or update(): this.mazeMap.pos = this.camera.pos.sub(ex.vec(game.halfDrawWidth, game.halfDrawHeight)).add(ex.vec(10, 10));
        mazeActor.graphics.use(r);
        this.add(mazeActor);
        this.mazeMap = mazeActor;
    }
    createMobs() {
        var isoHelp = new IsoHelper(this.isoMap);
        const MOBS = 6;
        const TRIES = 10;
        for (var i = 0; i < MOBS; i++) {
            var mob = new BatmanMob(i);
            for (let t = 0; t < TRIES; t++) {
                mob.tilepos = ex.vec(ex.randomIntInRange(2, 15, this.rnd), ex.randomIntInRange(2, 15, this.rnd));
                let k = isoHelp.getKind(mob.tilepos);
                if (k == IsoTileKind.ROAD) {
                    break;
                }
            }
            this.add(mob);
            mob.moveToIso(0, 0);
        }
    }

}
export function createMazeScene() {
    const scene = new MazeScene();
    return scene;
}