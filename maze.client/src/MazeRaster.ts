import * as ex from 'excalibur';
import { MazeCell, Maze } from './Maze.js';

export class MazeRaster extends ex.Raster {
    constructor(public maze: Maze, private cellSize: number = 6) {
        super();
        this.width = maze.Width * cellSize;
        this.height = maze.Height * cellSize;
        this.opacity = 0.6;

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
                else if (v == MazeCell.UNBREAKABLE)
                    ctx.fillStyle = 'red';
                else
                    ctx.fillStyle = 'orange';
                ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }
}

