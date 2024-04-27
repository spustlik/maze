export type TMazeCell = number;

export class Maze {
    private data: TMazeCell[];
    constructor(
        public Width: number,
        public Height: number
    ) {
        this.data = new Array(Width * Height);
    }

    public Get(x: number, y: number): TMazeCell {
        return this.data[x + y * this.Width];
    }

    public Set(x: number, y: number, value: TMazeCell) {
        this.data[x + y * this.Width] = value;
    }
}