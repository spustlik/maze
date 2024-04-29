import * as ex from 'excalibur';
import { Maze, MazeCell } from './Maze';
import { MazeRaster } from './MazeRaster';
import { StringSource } from './extra/StringSource';
import { getAroundPoints } from './common/Point';
import { replaceAll } from './common/utils';

class SceneResources {
    Roads = new ex.ImageSource("src/assets/roads.png")
    Batman = new ex.ImageSource("src/assets/batman.png")
    MazeTest = new StringSource("src/assets/mazeTest.txt")
    Maze1 = new StringSource("src/assets/maze1.txt")
    MazeTest2 = new StringSource("src/assets/mazeTest2.txt")
}

type SpriteGrid = {
    columns: number
    rows: number
    spriteWidth: number
    spriteHeight: number
}
class IsoActor extends ex.Actor {
    protected sheet: ex.SpriteSheet;
    protected anims: ex.Animation[];
    public tilepos = ex.vec(0, 0);
    public zoom = 2;
    public moveSpeed = 100;
    constructor(sprite: ex.ImageSource, spriteGrid: SpriteGrid) {
        super({
            x: 20, y: 20,
            width: 24, height: 24,
            z: 20000
        });
        this.sheet = ex.SpriteSheet.fromImageSource({
            image: sprite,
            grid: spriteGrid,
        });
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
}

class Batman extends IsoActor {
    constructor(sprite: ex.ImageSource) {
        super(sprite, { columns: 1, rows: 8, spriteWidth: 24, spriteHeight: 32 });
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

    public moveToIso(isoMap: ex.IsometricMap, rx: number, ry: number) {
        var newpos = this.tilepos.add(ex.vec(rx, ry));
        this.tilepos = newpos;
        //console.log('moving', rx, ry, this.tilepos);
        var pt = isoMap.tileToWorld(this.tilepos);
        let speed = this.moveSpeed;
        if (rx == 0 && ry == 0)
            speed = Number.MAX_SAFE_INTEGER;
        this.actions
            .callMethod(() => {
                if (rx == 1 || ry == 1) {
                    this.graphics.use(this.anims[0]);
                } else {
                    this.graphics.use(this.anims[1]);
                }
                this.scaleFlipX((rx == 0 && ry == 1) || (rx == 0 && ry == -1));
            })
            .moveTo(pt, speed)
            .callMethod(() => {
                this.onMoveDone();
            })
    }
    onMoveDone() {
        setTimeout(() => {
            console.log(`all is done ${this.actions.getQueue().isComplete()}`, this.actions.getQueue());
            if (this.actions.getQueue().isComplete) {
                this.graphics.use(this.anims[2]);
            }
        }, 0);
    }
    update(g: ex.Engine, delta) {
        super.update(g, delta);
    }
}

export class MazeScene extends ex.Scene {
    isoMap: ex.IsometricMap;
    resources: SceneResources;
    batman: Batman;
    constructor() {
        super();
    }

    onPreLoad(loader: ex.DefaultLoader) {
        super.onPreLoad(loader);
        this.resources = new SceneResources();
        for (var r in this.resources) {
            loader.addResource(this.resources[r]);
        }
    }
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        //const maze = Maze.read(this.resources.Maze1.data);
        const maze = Maze.read(this.resources.MazeTest2.data);
        this.isoMap = new ex.IsometricMap({
            pos: ex.vec(game.drawWidth / 2, 20),
            tileWidth: 100,
            tileHeight: 50,
            columns: maze.Width,
            rows: maze.Height,
            //renderFromTopOfGraphic: true
        });
        this.isoMap.transform.scale = ex.vec(0.5, 0.5);

        this.addMazeMap(maze); //why it cannot be added later? iso is changing transformation?

        this.add(this.isoMap);
        this.roadsTile(maze);
        this.addBatman();

        this.batman.moveToIso(this.isoMap, 0, 0);
    }
    update(game: ex.Engine, delta) {
        super.update(game, delta);
        if (game.input.keyboard.wasPressed(ex.Keys.W))
            return this.moveBatman(-1, 0);
        if (game.input.keyboard.wasPressed(ex.Keys.A))
            return this.moveBatman(0, 1);
        if (game.input.keyboard.wasPressed(ex.Keys.S))
            return this.moveBatman(1, 0);
        if (game.input.keyboard.wasPressed(ex.Keys.D))
            return this.moveBatman(0, -1);

        //    if (game.input.keyboard.wasPressed(ex.Keys.Digit1))
        //        return this.batman.scaleFlipX(true);
        //    if (game.input.keyboard.wasPressed(ex.Keys.Digit2))
        //        return this.batman.scaleFlipX(false);
    }
    moveBatman(x: number, y: number) {
        this.batman.moveToIso(this.isoMap, x, y);
    }
    addBatman() {
        this.batman = new Batman(this.resources.Batman);
        this.add(this.batman);
        return this.batman;
    }
    roadsTile(maze: Maze) {
        var spriteSheet = ex.SpriteSheet.fromImageSource({
            image: this.resources.Roads,
            grid: { columns: 1, rows: 29, spriteWidth: 100, spriteHeight: 65 }
        });
        function getSprite(s: string) {
            //     [3]
            // [1] [0] [2]
            //     [4]

            ///WARNING !!!
            s = replaceAll(s, "2", "1");

            if (s.startsWith("0"))
                return spriteSheet.getSprite(0, 13);
            s = s.substring(1);
            var map = {
                //zatacky
                "0101": 28,
                "1010": 25,
                "0110": 23,
                "1001": 27,
                //odbocky
                "0111": 1,
                "1110": 2,
                "1101": 4,
                "1011": 3,
                //rovne
                "1100": 26,
                "0011": 24,
                //krizovatka
                "1111": 0,
                //slepka
                "1000": 6,
                "0100": 7,
                "0010": 5,
                "0001": 8,
                //samostatna
                "0000": 22
            }
            if (map[s] != undefined)
                return spriteSheet.getSprite(0, map[s]);
            console.log('missing', s, map[s], map);
            return spriteSheet.getSprite(0, 13);
        }

        for (let tile of this.isoMap.tiles) {
            var pos = { x: tile.x, y: tile.y };
            var c = maze.Get(pos);
            var points = getAroundPoints(pos).map(p => maze.Get(p) ?? MazeCell.VISITED);
            var ptstr = c + points.join("");
            //if (pos.x < 3 && pos.y < 3) console.log(ptstr, points);
            tile.addGraphic(getSprite(ptstr));
        }
    }
    simpleTile(maze: Maze) {
        var spriteSheet = ex.SpriteSheet.fromImageSource({
            image: this.resources.Roads,
            grid: { columns: 1, rows: 28, spriteWidth: 100, spriteHeight: 65 }
        });
        for (let tile of this.isoMap.tiles) {
            var c = maze.Get({ x: tile.x, y: tile.y });
            if (c == MazeCell.WALL)
                tile.addGraphic(spriteSheet.getSprite(0, 22));
            else //if (c == MazeCell.EMPTY)
                tile.addGraphic(spriteSheet.getSprite(0, 13));
        }
    }
    addMazeMap(maze: Maze) {
        var r = new MazeRaster(maze, 4);
        const mazeActor = new ex.Actor({
            pos: ex.vec(5, 5),
            anchor: ex.vec(0, 0),
            width: r.width,
            height: r.height
        });
        mazeActor.graphics.use(r);
        this.add(mazeActor);
        return mazeActor;
    }

}
export function createMazeScene() {
    const scene = new MazeScene();

    //var maze = Maze.load((47, 49);
    return scene;
}