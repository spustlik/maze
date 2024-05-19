import * as ex from 'excalibur';
import { generateRandomSeed } from './common/RandomGenerator';
import { MazeRaster } from './maze/MazeRaster';
import { Maze } from './maze/Maze';
import { MazeGenerator } from './maze/MazeGenerator';

export function createMazeGeneratorScene() {
    const scene = new ex.Scene();
    const HEIGHT = 600;
    const WIDTH = 800;

    var maze = new Maze(47, 49);
    const mazer = new MazeRaster(maze, scene);
    console.log('mazerscene', mazer.scene);
    const actor = new ex.Actor({
        pos: ex.vec(WIDTH / 2, HEIGHT / 2),
        width: mazer.width,
        height: mazer.height
    });
    actor.graphics.use(mazer);
    scene.add(actor);

    var seed = generateRandomSeed();
    seed = 1236; //debug purposes
    var generator = new MazeGenerator(maze, seed);
    mazer.rasterize();


    var start = new Date();
    if (true) {
        //FAST:
        while (generator.NextStep()) { }
        console.log('generated', (new Date()).getTime() - start.getTime());
        mazer.rasterize();
        console.log('result', maze.save());
    } else {    
        //SLOW: animated
        var timer = new ex.Timer({ interval: 0, repeats: true });
        timer.on(() => {
            if (!generator.NextStep()) {
                timer.stop();
                //18455
                console.log('generated', (new Date()).getTime() - start.getTime());
            }
            mazer.rasterize();
        });
        scene.addTimer(timer);
        timer.start();
    }
    return scene;
}