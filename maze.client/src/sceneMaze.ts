import * as ex from 'excalibur';
import { Maze, MazeCell } from './Maze';
import { MazeRaster } from './MazeRaster';
import { StringSource } from './extra/StringSource';

class SceneResources {
    Roads = new ex.ImageSource("src/assets/roads.png")
    MazeTest = new StringSource("src/assets/mazeTest.txt")
    Maze1 = new StringSource("src/assets/maze1.txr")
}

export class MazeScene extends ex.Scene {
    isoMap: ex.IsometricMap;
    maze: Maze;
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
        this.maze = Maze.read(this.resources.MazeTest.data);
        {
            //just pixel helper
            var r = new MazeRaster(this.maze);
            const mazeActor = new ex.Actor({
                pos: ex.vec(5, 5),
                anchor: ex.vec(0, 0),
                width: r.width,
                height: r.height
            });
            mazeActor.graphics.use(r);
            this.add(mazeActor);
        }
        //this.resources.Roads.image.width
        var spriteSheet = ex.SpriteSheet.fromImageSource({
            image: this.resources.Roads,
            grid: { columns: 16, rows: 7, spriteWidth: 100, spriteHeight: 65 }
        });
        this.isoMap = new ex.IsometricMap({
            pos: ex.vec(game.drawWidth / 2, 20),
            tileWidth: 100,
            tileHeight: 51,
            columns: this.maze.Width,
            rows: this.maze.Height
        });
        this.add(this.isoMap);

        for (let tile of this.isoMap.tiles) {
            var c = this.maze.Get({ x: tile.x, y: tile.y });
            if (c == MazeCell.WALL)
                tile.addGraphic(spriteSheet.getSprite(0, 0));
            else //if (c == MazeCell.EMPTY)
                tile.addGraphic(spriteSheet.getSprite(3, 6));
        }

    }

}
export function createMazeScene() {
    const scene = new MazeScene();

    //var maze = Maze.load((47, 49);
    return scene;
}