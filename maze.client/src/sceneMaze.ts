import * as ex from 'excalibur';
import { Maze, MazeCell } from './Maze';
import { MazeRaster } from './MazeRaster';
import { StringSource } from './extra/StringSource';
import { getAroundPoints } from './common/Point';
import { point } from 'excalibur/build/dist/Util/DrawUtil';

class SceneResources {
    Roads = new ex.ImageSource("src/assets/roads.png")
    MazeTest = new StringSource("src/assets/mazeTest.txt")
    Maze1 = new StringSource("src/assets/maze1.txt")
}

export class MazeScene extends ex.Scene {
    isoMap: ex.IsometricMap;
    resources: SceneResources;
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
        const maze = Maze.read(this.resources.MazeTest.data);
        this.addPixelHelper(maze);
        this.isoMap = new ex.IsometricMap({
            pos: ex.vec(game.drawWidth / 2, 20),
            tileWidth: 100,
            tileHeight: 51,
            columns: maze.Width,
            rows: maze.Height
        });
        //this.isoMap.transform.scale = ex.vec(0.5, 0.5);

        this.add(this.isoMap);
        //this.simpleTile(maze);
        this.roadsTile(maze);

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
            if (s.startsWith("0"))
                return spriteSheet.getSprite(0, 13);
            var map = {
                //zatacky
                "10101": 28,
                "11010": 25,
                "10110": 23,
                "11001": 27,
                //odbocky
                "10111": 1,
                "11110": 2,
                "11101": 4,
                "11011": 3,
                //rovne
                "11100": 26,
                "10011": 24,
                //krizovatka
                "11111": 0,
                //slepka
                "11000": 6,
                "10100": 7,
                "10010": 5,
                "10001": 8,
            }
            if (map[s]!=undefined)
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
    addPixelHelper(maze: Maze) {
        var r = new MazeRaster(maze, 5);
        const mazeActor = new ex.Actor({
            pos: ex.vec(5, 5),
            anchor: ex.vec(0, 0),
            width: r.width,
            height: r.height
        });
        mazeActor.graphics.use(r);
        this.add(mazeActor);

    }

}
export function createMazeScene() {
    const scene = new MazeScene();

    //var maze = Maze.load((47, 49);
    return scene;
}