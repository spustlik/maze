import * as ex from 'excalibur';
import { MazeCell, Maze } from './Maze.js';

const SIZE = 6;
export class MazeRaster extends ex.Raster {
    constructor(public maze: Maze) {
        super();
        this.width = maze.Width * SIZE;
        this.height = maze.Height * SIZE;

    }
    clone(): ex.Graphic {
        return new MazeRaster(this.maze);
    }

    execute(ctx: CanvasRenderingContext2D): void {
        for (var y = 0; y < this.maze.Height; y++) {
            for (var x = 0; x < this.maze.Width; x++) {
                var v = this.maze.Get({ x, y });
                if (v == MazeCell.EMPTY)
                    ctx.fillStyle = 'green';
                else if (v == MazeCell.WALL)
                    ctx.fillStyle = 'black';
                else
                    ctx.fillStyle = 'orange';
                ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
            }
        }
    }
}

