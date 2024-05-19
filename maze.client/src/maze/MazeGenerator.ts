import { MazeCell, Maze } from './Maze';
import { RandomGenerator } from './RandomGenerator';
import { PointDirection, ICoordinates, Point, getAroundPoints, getPointInDirection, Rect, IRect, isRectIntersecting, getRectOffset } from './common/Point';

export class MazeGenerator {
    rnd: RandomGenerator;
    pos: ICoordinates;
    end: Point;
    todo: ICoordinates[] = [];
    rects: IRect[] = [];
    constructor(private maze: Maze, seed: number) {
        this.rnd = new RandomGenerator(seed);
        this.pos = new Point(maze.Width / 2, maze.Height - 1);
        this.end = new Point(maze.Width / 2, 0);
        maze.DrawBorder(MazeCell.WALL);
        this.drawGrid();

        //maybe add to NextStep
        this.generateRects();
        this.drawRects();
        //return;
        maze.Set(this.pos, MazeCell.VISITED);
        maze.Set(this.end, MazeCell.VISITED);
        this.pos = new Point(this.pos.x, this.pos.y - 1);
        maze.Set(this.pos, MazeCell.VISITED);
        //this.pos = new Point(this.rnd.next(maze.Width - 1), this.rnd.next(maze.Height - 1));
        //Choose the initial cell, mark it as visited and push it to the stack
        this.todo.push(this.pos);
    }
    generateRects() {
        var sizes = [3, 5, 7];
        var test = 0;
        while (true) {
            var w = sizes[this.rnd.next(sizes.length - 1)];
            var h = sizes[this.rnd.next(sizes.length - 1)];
            var x = this.rnd.next(this.maze.Width - 2 - w, 2);
            x = 1 + Math.trunc(x / 2) * 2;
            var y = this.rnd.next(this.maze.Height - 2 - h, 2);
            y = 1 + Math.trunc(y / 2) * 2;
            var nr = new Rect(x, y, w, h);
            var nr1 = getRectOffset(nr, 1);
            if (this.rects.filter(a => isRectIntersecting(a, nr1)).length > 0) {
                test++;
                //console.log('ignored rect', nr1, result);
            } else {
                test = 0;
                this.rects.push(nr);
            }
            if (test > 10)
                break;
            if (this.rects.length > 100) {
                //console.log('too many', nr, result);
                break;
            }
        }
    }
    drawRects() {
        for (var r of this.rects) {
            this.maze.DrawFillRect(r, MazeCell.UNBREAKABLE);
        }
    }
    drawGrid() {
        for (var y = 2; y < this.maze.Height - 2; y += 2) {
            this.maze.DrawHLine({ x: 1, y }, MazeCell.WALL, this.maze.Width - 2);
        }
        for (var x = 2; x < this.maze.Width - 2; x += 2) {
            this.maze.DrawVLine({ x, y: 1 }, MazeCell.WALL, this.maze.Height - 2);
        }
    }
    NextStep() {
        //While the stack is not empty
        if (this.todo.length == 0)
            return false;
        //Pop a cell from the stack and make it a current cell
        this.pos = this.todo.pop();
        this.maze.Set(this.pos, MazeCell.VISITED);
        var next = getAroundPoints(this.pos, 2)
            .map((a, i) => ({ pt: a, d: i as PointDirection, v: this.maze.Get(a) }))
            .filter(a => this.maze.isIn(a.pt, 1))
            .filter(a => a.v != MazeCell.VISITED && a.v != MazeCell.UNBREAKABLE);

        //If the current cell has any neighbours which have not been visited
        if (next.length > 0) {
            //Push the current cell to the stack
            this.todo.push(this.pos);
            //Choose one of the unvisited neighbours
            var r = this.rnd.next(next.length - 1);
            //Remove the wall between the current cell and the chosen cell
            var wall = getPointInDirection(this.pos, next[r].d);
            this.maze.Set(wall, MazeCell.VISITED);
            //Mark the chosen cell as visited and push it to the stack
            this.maze.Set(next[r].pt, MazeCell.VISITED);
            this.todo.push(next[r].pt);

            //create some loops
            if (this.rnd.next(100) < 20) {
                next = next.splice(r, 1);
                if (next.length > 0) {
                    var loop = next[this.rnd.next(next.length - 1)];
                    var loop2 = getPointInDirection(loop.pt, loop.d);
                    if (this.maze.isIn(loop2, 1)) {
                        this.maze.Set(loop2, MazeCell.VISITED);
                        //this.maze.Set(loop.pt, MazeCell.VISITED);
                    }
                }
            }
        }
        return this.todo.length > 0;
    }
}
