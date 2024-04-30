import * as ex from 'excalibur';
import { MazeCell, Maze } from './Maze.js';
import { ICoordinates, isSamePoint } from './common/Point.js';

abstract class CellRaster extends ex.Raster {
    constructor(private c_width: number, private c_height: number, private cellSize=6){
        super();
        this.width = c_width * cellSize;
        this.height = c_height * cellSize;
    }
    clone(): ex.Graphic { return null; }
    execute(ctx: CanvasRenderingContext2D): void {
        //console.log('execute');
        for (var y = 0; y < this.c_height; y++) {
            for (var x = 0; x < this.c_width; x++) {
                var c = this.getPixelStyle({ x, y });
                ctx.fillStyle = c;
                ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }
    abstract getPixelStyle(pos: ICoordinates): string | CanvasGradient | CanvasPattern;
}
export class MazeRaster1 extends CellRaster {
    constructor(public maze: Maze, cellSize: number = 6) {
        super(maze.Width,maze.Height, cellSize);
        this.opacity = 0.6;
    }
    getPixelStyle(pos: ICoordinates): string | CanvasGradient | CanvasPattern {
        var v = this.maze.Get(pos);
        if (v == MazeCell.EMPTY)
            return 'green';
        else if (v == MazeCell.WALL)
            return 'black';
        else if (v == MazeCell.UNBREAKABLE)
            return 'red';
        else
            return 'orange';
    }
}

export class MazeRaster extends MazeRaster1 {
    constructor(
        public maze: Maze,
        cellSize: number = 6,
        private scene: ex.Scene
    ) {
        super(maze, cellSize);
        this.opacity = 1;
    }
    getPixelStyle(pos: ICoordinates): string | CanvasGradient | CanvasPattern {
        var tileActors = this.scene.actors.filter(a => a['tilepos']);
        var found = tileActors.filter(a => isSamePoint(pos, a['tilepos']))[0];
        if (!found)
            return super.getPixelStyle(pos);
        return 'blue';
    }
}

