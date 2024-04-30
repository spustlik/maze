import * as ex from 'excalibur';
import { Maze, MazeCell } from './Maze';
import { MazeRaster } from './MazeRaster';
import { getAroundPoints } from './common/Point';
import { Batman } from './batman/BatmanActor';
import { BatmanMob } from './batman/BatmanMobActor';
import { batmanData, batmanResources } from './batman/BatmanResources';
import { IIsoScene } from './extra/IsoActor';
import { IsoHelper, IsoTileKind } from './batman/IsoHelper';


export class MazeScene extends ex.Scene implements IIsoScene {
    isoMap: ex.IsometricMap;
    batman: Batman;
    mazeMap: MazeRaster;
    constructor() {
        super();
    }

    onPreLoad(loader: ex.DefaultLoader) {
        super.onPreLoad(loader);
        batmanData.load(loader);
    }
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        //const maze = Maze.read(this.resources.Maze1.data);
        const maze = Maze.read(batmanResources.MazeTest2.data);
        this.mazeMap = this.addMazeMap(maze); //why it cannot be added later? iso is changing transformation?

        this.isoMap = new ex.IsometricMap({
            pos: ex.vec(game.drawWidth / 2, 20),
            tileWidth: 100,
            tileHeight: 50,
            columns: maze.Width,
            rows: maze.Height,
            //renderFromTopOfGraphic: true
        });
        //this.isoMap.transform.scale = ex.vec(0.5, 0.5);

        this.add(this.isoMap);
        this.roadsTile(maze);
        //this.simpleTile(maze);

        this.batman = new Batman();
        this.add(this.batman);
        this.batman.moveToIso(0, 0);
        this.batman.moveToIso(1, 1);


        var rnd = new ex.Random(1234);
        for (var i = 0; i <= 5; i++) {
            var mob = new BatmanMob(i);
            mob.tilepos = ex.vec(ex.randomIntInRange(2, 15, rnd), ex.randomIntInRange(2, 15, rnd));
            //mob.tilepos = ex.vec(2 + i, 2 + i);
            this.add(mob);
            mob.moveToIso(0, 0);
        }
    }
    update(game: ex.Engine, delta) {
        super.update(game, delta);
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
        this.mazeMap.rasterize();
    }
    roadsTile(maze: Maze) {
        var isoHelp = new IsoHelper(this.isoMap);
        for (let tile of this.isoMap.tiles) {
            var pos = { x: tile.x, y: tile.y };
            var c = maze.Get(pos);
            var points = getAroundPoints(pos).map(p => maze.Get(p) ?? MazeCell.VISITED);
            var ptstr = c + points.join("");
            //if (pos.x < 3 && pos.y < 3) console.log(ptstr, points);
            tile.addGraphic(batmanData.getTileSprite(ptstr));
            if (c == MazeCell.WALL)
                isoHelp.setTileKind(tile, IsoTileKind.WALL);
            if (c == MazeCell.UNBREAKABLE)
                isoHelp.setTileKind(tile, IsoTileKind.CITY);
            if (c == MazeCell.VISITED)
                isoHelp.setTileKind(tile, IsoTileKind.ROAD);
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
        var r = new MazeRaster(maze, 4, this);
        const mazeActor = new ex.Actor({
            pos: ex.vec(5, 5),
            anchor: ex.vec(0, 0),
            width: r.width,
            height: r.height
        });
        mazeActor.graphics.use(r);
        this.add(mazeActor);
        return r;
    }

}
export function createMazeScene() {
    const scene = new MazeScene();

    //var maze = Maze.load((47, 49);
    return scene;
}