import * as ex from 'excalibur';
import { Maze } from './Maze.js';

const game = new ex.Engine({
    width: 800,
    height: 600,
});


var maze = new Maze(30, 30);
maze.Set(1, 1, 1);
maze.Set(3, 2, 1);
class MazeRaster extends ex.Raster {
    constructor(public maze: Maze) {
        super();
    }
    clone(): ex.Graphic {
        return new MazeRaster(this.maze);
    }

    execute(ctx: CanvasRenderingContext2D): void {
        const SIZE = 5;
        for (var y = 0; y < this.maze.Height; y++) {
            for (var x = 0; x < this.maze.Width; x++) {
                var v = this.maze.Get(x, y);
                if (v > 0)
                    ctx.fillStyle = 'green';
                else
                    ctx.fillStyle = 'orange';
                ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
            }
        }
    }
}

const mazer = new MazeRaster(maze);
mazer.rasterize();


const actor = new ex.Actor({
    pos: game.screen.center,
    width: 3,
    height: 5
});

actor.graphics.use(mazer);
game.currentScene.add(actor);

game.start();

