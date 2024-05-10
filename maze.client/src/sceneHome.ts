import * as ex from 'excalibur';
import { createBreakoutScene } from './sceneBreakout';
import { createMazeGeneratorScene } from './sceneMazeGenerator';
import { createMazeScene } from './sceneMaze';
import { createButton, createImgButton, createSpriteButton } from './extra/ui';
import { loadResources } from './extra/extra';
import { uiResourceData, uiResources } from './extra/uiResources';
import { createTestScene } from './sceneTests';
import { text } from 'stream/consumers';



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
        { key: 'tests', title: 'Tests', create: () => createTestScene() },
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

            const btn = createImgButton(def.title, {
                pos: ex.vec(20, 40 + i * 100),
                height: 90,
                width: 400,
                colorHightlightFg: ex.Color.White,
                click: () => this.gotoScene(game, def)
            });
            //console.log('button created', btn2.height, def.title);
            this.add(btn);
        }

        this.add(new ex.Label({
            pos: ex.vec(30, game.drawHeight - 30),
            text: "Created using AI Microsoft Bing - Copilot - Dall-E3",
            scale: ex.vec(1.6, 1.6),
            spriteFont: uiResourceData.Font,
            //color:ex.Color.Red
        }));
    }

    override onActivate(ctx: ex.SceneActivationContext) {
        console.log('onActivate-home');

        window.addEventListener('hashchange', (h: HashChangeEvent) => {
            console.log('hash changed', window.location.hash);
            this.gotoSceneByHash(ctx.engine);
        });

        if (window.location.hash) {
            this.gotoSceneByHash(ctx.engine);
        }

    }
    gotoSceneByHash(engine: ex.Engine) {
        var s = window.location.hash;
        if (s.startsWith('#'))
            s = s.substring(1);
        if (engine.currentSceneName == s)
            return false;
        var found = this.scenes.filter(a => a.key == s)[0];
        if (!found)
            return false;
        this.gotoScene(engine, found);
        return true;
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
        let homeBtn = createSpriteButton({
            pos: ex.vec(game.drawWidth - 65, 5),
            click: () => {
                window.location.hash = '';
                game.goToScene('root');
            },            
            sprite: uiResourceData.ButtonCloseSpriteSheet.getSprite(0, 0),
            spriteHover: uiResourceData.ButtonCloseSpriteSheet.getSprite(0,1)
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