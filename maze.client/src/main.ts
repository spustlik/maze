import * as ex from 'excalibur';
import { createScene  as createSceneHome } from './sceneHome';
import { createScene as createSceneMazeGenerator } from './sceneMazeGenerator';

const game = new ex.Engine({
    width: 800,
    height: 600,
});

//const home = createSceneHome(game);

const sg = createSceneMazeGenerator();
game.addScene('root', sg);

game.start();

