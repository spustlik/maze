import { MazeCell, Maze } from './Maze';
import { RandomGenerator } from './RandomGenerator';
import { ICoordinates, Point } from './Point';

export const enum Direction {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3
}

export class MazeGenerator {
    rnd: RandomGenerator;
    pos: ICoordinates;
    end: Point;
    todo: ICoordinates[] = [];
    constructor(private maze: Maze, seed: number) {
        this.rnd = new RandomGenerator(seed);
        this.pos = new Point(maze.Width / 2, maze.Height - 1);
        this.end = new Point(maze.Width / 2, 0);
        maze.DrawBorder(MazeCell.WALL);
        this.drawGrid();
        maze.Set(this.pos, MazeCell.VISITED);
        maze.Set(this.end, MazeCell.VISITED);
        this.pos = new Point(this.pos.x, this.pos.y - 1);
        maze.Set(this.pos, MazeCell.VISITED);
        //this.pos = new Point(this.rnd.next(maze.Width - 1), this.rnd.next(maze.Height - 1));
        //Choose the initial cell, mark it as visited and push it to the stack
        this.todo.push(this.pos);
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
        var next = this.getNextPoints(this.pos, 2)
            .map((a, i) => ({ pt: a, d: i as Direction, v: this.maze.Get(a) }))
            .filter(a => this.isInMaze(a.pt) )
            .filter(a => a.v != MazeCell.VISITED);

        //If the current cell has any neighbours which have not been visited
        if (next.length > 0) {
            //Push the current cell to the stack
            this.todo.push(this.pos);
            //Choose one of the unvisited neighbours
            var r = this.rnd.next(next.length - 1);
            //Remove the wall between the current cell and the chosen cell
            var wall = this.getPointInDirection(this.pos, next[r].d);
            this.maze.Set(wall, MazeCell.VISITED);
            //Mark the chosen cell as visited and push it to the stack
            this.maze.Set(next[r].pt, MazeCell.VISITED);
            this.todo.push(next[r].pt);

            //create some loops
            if (this.rnd.next(100) < 20) {
                next = next.splice(r, 1);
                if (next.length > 0) {
                    var loop = next[this.rnd.next(next.length - 1)];
                    var loop2 = this.getPointInDirection(loop.pt, loop.d);
                    if (this.isInMaze(loop2)) {
                        this.maze.Set(loop2, MazeCell.VISITED);
                        //this.maze.Set(loop.pt, MazeCell.VISITED);
                    }
                }
            }
        }
        return this.todo.length > 0;
    }
    isInMaze(pt: ICoordinates): boolean {
        return pt.x >= 1 && pt.y >= 1 && pt.x < this.maze.Width - 1 && pt.y < this.maze.Height - 1;
    }
    getNextPoints(c: ICoordinates, offset = 1): ICoordinates[] {
        var { x, y } = c;
        return [
            { x: x - offset, y },
            { x: x + offset, y },
            { x, y: y - offset },
            { x, y: y + offset }
        ];
        //faster than
        //return [
        //    this.getPointInDirection(c, Direction.Left, offset),
        //    this.getPointInDirection(c, Direction.Right, offset),
        //    this.getPointInDirection(c, Direction.Up, offset),
        //    this.getPointInDirection(c, Direction.Down, offset),
        //];
    }
    getPointInDirection(pos: ICoordinates, d: Direction): ICoordinates {
        const OFFSET_TABLE = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];
        return { x: pos.x + OFFSET_TABLE[d].x, y: pos.y + OFFSET_TABLE[d].y };
    }
}
