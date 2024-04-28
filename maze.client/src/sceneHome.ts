import * as ex from 'excalibur';
import { createBreakoutScene } from './sceneBreakout';
import { createMazeGeneratorScene } from './sceneMazeGenerator';
import { createMazeScene } from './sceneMaze';
import { createButton } from './ui';


type SceneDef = {
    key: string,
    title: string,
    create: () => ex.Scene
};
export class HomeScene extends ex.Scene {
    scenes :SceneDef[] = [
        { key: 'breakout', title: 'Breakout', create: () => createBreakoutScene() },
        { key: 'mazegen', title: 'Maze generator', create: () => createMazeGeneratorScene() },
        { key: 'maze', title: 'Maze', create: () => createMazeScene() },
    ];

    constructor() {
        super();
    }

    onInitialize(game:ex.Engine) {
        super.onInitialize(game);
        for (var i = 0; i < this.scenes.length; i++) {
            const def = this.scenes[i];
            const btn = createButton(def.title, {
                pos: ex.vec(20, 40 + i * 80),
                click: () => {
                    if (!game.scenes[def.key]) {
                        var s = this.createScene(game, def);
                    }
                    game.goToScene(def.key);
                }
            });
            this.add(btn);
        }
    }

    createScene(game:ex.Engine, s:SceneDef) {
        const instance = s.create();

        var homeBtn = createButton('X', {
            pos: ex.vec(5, 5),
            click: () => {
                game.goToScene('root');
            },
            width: 40,
            height: 40
        });
        instance.add(homeBtn);

        game.addScene(s.key, instance);
    }
}
export function createScene(game: ex.Engine) {
    const homeScene = new HomeScene();
    game.addScene('root', homeScene);
    return homeScene;
}