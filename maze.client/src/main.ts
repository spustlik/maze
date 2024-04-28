import * as ex from 'excalibur';
import { createScene  as createSceneHome } from './sceneHome';
import { createMazeGeneratorScene as createSceneMazeGenerator } from './sceneMazeGenerator';

const game = new ex.Engine({
    width: 800,
    height: 600,
});

const home = createSceneHome(game);
game.addScene('root', home);

//const sg = createSceneMazeGenerator();
//game.addScene('root', sg);

game.start();

