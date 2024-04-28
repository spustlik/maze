import * as ex from 'excalibur';
import { createScene as createSceneBreakout } from './sceneBreakout';
import { createScene as createSceneMazeGenerator } from './sceneMazeGenerator';
import { createButton } from './ui';


export function createScene(game: ex.Engine) {
    const homeScene = new ex.Scene();
    var scenes = [
        { key: 'breakout', title: 'Breakout', create: () => createSceneBreakout() },
        { key: 'mazegen', title: 'Maze generator', create: () => createSceneMazeGenerator() },
    ];
    for (var i = 0; i < scenes.length; i++) {
        const s = scenes[i];
        const btn = createButton(ex.vec(20, 40 + i * 80), s.title, () => {
            const instance = s.create();
            game.addScene(s.key, instance);
            game.goToScene(s.key);
        });
        homeScene.add(btn);
    }
    game.addScene('root', homeScene);
    return homeScene;
}