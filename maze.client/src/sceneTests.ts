import * as ex from 'excalibur';
import { loadResources } from './extra/extra';
import { uiResourceData, uiResources } from './extra/uiResources';

class TestScene extends ex.Scene {
    constructor() {
        super();
    }
    onPreLoad(loader: ex.DefaultLoader) {
        console.log('onPreload-test');
        super.onPreLoad(loader);
        loadResources(loader, uiResources);
    }
    async onInitialize(game: ex.Engine) {
        console.log('onInitialize-test');
        super.onInitialize(game);

        /*
        //draw font sprites
        for (var i = 0; i < uiResourceData._fontSpriteSheet.rows; i++) {
            var ft = new ex.Actor({
                pos: ex.vec(30 + 12 * i, 30),
                width: 100,
                height: 100
            });
            ft.graphics.use(uiResourceData._fontSpriteSheet.getSprite(0, i));
            this.add(ft);
        }
        */

        var t = new ex.Label({
            pos: ex.vec(30, 60),
            text: uiResourceData.Font.alphabet,
            spriteFont: uiResourceData.Font
        });
        this.add(t);

        var s = new ex.Actor({
            pos: ex.vec(20, 20),
            name:'SPRITE'
        });
        s.graphics.use();
        this.add(s);
        this.actors.find(a=>a.name=='SPRITE')
    }
}
export function createTestScene(g: ex.Engine) {
    var scene = new TestScene();
    return scene;
}