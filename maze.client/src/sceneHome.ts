import * as ex from 'excalibur';
import { createBreakoutScene } from './sceneBreakout';
import { createMazeGeneratorScene } from './sceneMazeGenerator';
import { createMazeScene } from './sceneMaze';
import { createButton, createImgButton } from './extra/ui';
import { loadResources } from './extra/extra';
import { uiResources } from './extra/uiResources';



type SceneDef = {
    key: string,
    title: string,
    create: (game: ex.Engine) => ex.Scene
};
export class HomeScene extends ex.Scene {
    scenes: SceneDef[] = [
        { key: 'breakout', title: 'Breakout', create: (g) => createBreakoutScene(g) },
        { key: 'mazegen', title: 'Maze generator', create: () => createMazeGeneratorScene() },
        { key: 'maze', title: 'Maze', create: () => createMazeScene() },
    ];

    constructor() {
        super();
    }

    async onInitialize(game: ex.Engine) {
        console.log('onInitialize-home');
        super.onInitialize(game);

        //onLoad is not called?!?
        var loader = new ex.DefaultLoader();
        console.log('loading res-home');
        loadResources(loader, uiResources);
        await game.start(loader);

        var bg_a = new ex.Actor({ x: 0, y: 0, anchor: ex.vec(0, 0) });
        var ratio = uiResources.bg.image.width / uiResources.bg.image.height;
        var bg_g = new ex.Sprite({ image: uiResources.bg, destSize: { width: game.drawWidth, height: game.drawWidth * ratio } });
        bg_a.graphics.use(bg_g);
        this.add(bg_a);

        for (var i = 0; i < this.scenes.length; i++) {
            const def = this.scenes[i];

            const btn2 = createImgButton(def.title, {
                pos: ex.vec(20, 60 + i * 120),
                height: 100,
                width: 300,
                colorHightlightFg: ex.Color.White,
                click: () => this.gotoScene(game, def)
            });
            //console.log('button created', btn2.height, def.title);
            this.add(btn2);
        }

    }

    override onActivate(ctx: ex.SceneActivationContext) {
        console.log('onActivate-home');

        if (window.location.hash) {
            var s = window.location.hash;
            if (s.startsWith('#'))
                s = s.substring(1);
            if (ctx.engine.currentSceneName != s) {
                var found = this.scenes.filter(a => a.key == s)[0];
                //console.log('init', s, found);
                if (found) {
                    this.gotoScene(ctx.engine, found);
                    return;
                }
            }
        }
        //var sp = new ex.Actor({ pos: ex.vec(10, 10), name: 'debug sprite' });
        //var spr = uiResources.button.toSprite();
        //sp.graphics.use(spr);
        //this.add(sp);
        //console.log('sprite', spr.width, spr.height);
    }

    gotoScene(game: ex.Engine, def: SceneDef) {
        if (!game.scenes[def.key]) {
            this.createScene(game, def);
        }
        game.goToScene(def.key);
        window.location.hash = def.key;
    }
    createScene(game: ex.Engine, def: SceneDef) {
        const instance = def.create(game);

        var homeBtn = createButton('X', {
            pos: ex.vec(game.drawWidth - 45, 5),
            click: () => {
                window.location.hash = '';
                game.goToScene('root');
            },
            width: 40,
            height: 40,
        });
        instance.add(homeBtn);

        game.addScene(def.key, instance);
    }
}
export function createScene(game: ex.Engine) {
    const homeScene = new HomeScene();
    game.addScene('root', homeScene);
    return homeScene;
}