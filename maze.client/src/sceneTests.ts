import * as ex from 'excalibur';
import { loadResources } from './extra/extra';
import { uiResourceData, uiResources } from './extra/uiResources';
import { batmanData, batmanResources } from './batman/BatmanResources';
import { BatmanMob, MobType } from './batman/BatmanMobActor';
import { ModalDialog, createImgButton } from './extra/ui';

class TestSceneUi extends ex.Scene {
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        let btn = createImgButton("Show dialog", {
            pos: ex.vec(100, 100), click: () => {
                this.showDialog();
            }
        });
        this.add(btn);
        this.showDialog();
    }
    async showDialog() {
        var dlg = new ModalDialog(this, {
            text: "Test text of dialog",
            buttons: [
                { text: 'OK', click: () => true },
                { text: 'Cancel', click: () => false }
            ],
            fontScale: 3
        });
        console.log('dialog created', dlg.id);
        this.add(dlg);
        let r = await dlg.showModal();
        console.log('dialog result', r);
    }
}

class TestFontScene extends ex.Scene {
    async onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        let loader = new ex.DefaultLoader();
        let fontImage = new ex.ImageSource("src/assets/font.png");
        loader.addResource(fontImage);
        await game.start(loader);
        let fontSpriteSheet = ex.SpriteSheet.fromImageSource({
            image: fontImage,
            grid: { columns: 1, rows: 45, spriteWidth: 10, spriteHeight: 10 }
        });
        let font = new ex.SpriteFont({
            alphabet: '01234567890.- ©][ABCDEFGHIJKLMNOPQRSTUVWXYZ|/',
            caseInsensitive: true,
            spriteSheet: fontSpriteSheet,
            scale: ex.vec(4, 4)
        });
        let lbl = new ex.Label({
            pos: ex.vec(10, 10),
            anchor:ex.vec(0,0),
            text: '-brown fox jumps over the lazy dog',
            spriteFont: font
        });
        this.add(lbl);
    }
}

class TestFontScene2 extends ex.Scene {
    font1: ex.SpriteFont;
    font2: ex.SpriteFont;
    async onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        let loader = new ex.DefaultLoader();
        let fontImage = new ex.ImageSource("src/assets/font.png");
        loader.addResource(fontImage);
        await game.start(loader);

        let fontSpriteSheet = ex.SpriteSheet.fromImageSource({
            image: fontImage,
            grid: { columns: 1, rows: 45, spriteWidth: 10, spriteHeight: 10 }
        });

        this.font1 = this.createFont(fontSpriteSheet);
        this.font2 = this.createFont(fontSpriteSheet);
        this.font2.scale = ex.vec(2, 2);
    }

    createFont(spriteSheet: ex.SpriteSheet) {
        return new ex.SpriteFont({
            alphabet: '01234567890.- ©][ABCDEFGHIJKLMNOPQRSTUVWXYZ|/',
            caseInsensitive: true,
            spriteSheet,
        });
    }
    onActivate(ctx: ex.SceneActivationContext) {
        const text = 'brown fox jumps over the lazy dog';
        let m1 = this.font1.measureText(text);
        console.log('font 1', m1.dimensions); //330,10, OK
        let m2 = this.font2.measureText(text);
        console.log('font 2', m2.dimensions); //330,10, should be 660,20
    }
}
class TestScenePointerEvents extends ex.Scene {
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        let a = this.addActor(ex.vec(100, 100), ex.Color.Red);
        a.z = 10;
        let b = this.addActor(ex.vec(130, 130), ex.Color.Blue);
        b.z = 20;
    }
    private addActor(pos: ex.Vector, c: ex.Color) {
        let a = new ex.Actor({ width: 200, height: 100, pos: pos, anchor: ex.vec(0, 0), opacity: 0.8 });
        let r = new ex.Rectangle({ width: a.width, height: a.height, strokeColor: ex.Color.Green, lineWidth: 5, color: c });
        a.graphics.use(r);
        this.add(a);
        a.pointer.useGraphicsBounds = true;
        a.events.on('pointerenter', (ev) => {
            r.color = ex.Color.Black;
            ev.cancel();
        });
        a.events.on('pointerleave', (ev) => {
            r.color = c;
            ev.cancel();
        });
        a.events.on('pointerdown', (ev) => {
            console.log('pointer down on ' + a.id);
            ev.cancel();
        });
        return a;
    }
}
class TestSceneIso extends ex.Scene {
    isoMap: ex.IsometricMap;
    bm1: BatmanMob;
    constructor() {
        super();
    }
    onPreLoad(loader: ex.DefaultLoader) {
        console.log('onPreload-test');
        super.onPreLoad(loader);
        loadResources(loader, uiResources);
        loadResources(loader, batmanResources);
    }
    async onInitialize(game: ex.Engine) {
        console.log('onInitialize-test');
        super.onInitialize(game);

        this.isoMap = new ex.IsometricMap({
            pos: ex.vec(game.drawWidth / 2, 20),
            tileWidth: 100,
            tileHeight: 50,
            columns: 30,
            rows: 30,
            //renderFromTopOfGraphic: true
        });

        var t = new ex.Label({
            pos: ex.vec(30, 60),
            text: uiResourceData.Font.alphabet,
            spriteFont: uiResourceData.Font
        });
        this.add(t);

        var s = new ex.Actor({
            pos: ex.vec(20, 20),
            name: 'SPRITE',
            scale: ex.vec(2, 2)
        });
        s.graphics.use(batmanData.Mobs_Sheet.getSprite(0, 13));
        this.add(s);

        var s2 = new ex.Actor({
            pos: ex.vec(20, 20),
            name: 'SPRITE2',
            scale: ex.vec(2, 2)
        });
        s2.graphics.use(batmanData.Mobs_Sheet.getSprite(0, 9));
        this.add(s2);

        this.bm1 = new BatmanMob(MobType.Dog);
        this.bm1.name = 'BM1';
        this.add(this.bm1);
        var pt = this.isoMap.tileToWorld(this.bm1.tilepos);
        this.bm1.pos = pt;
    }
    onActivate(ctx: ex.SceneActivationContext) {

    }
    onPreUpdate() {
        let s1 = this.actors.find(a => a.name == 'SPRITE');
        let s2 = this.actors.find(a => a.name == 'SPRITE2');
        if (!s1.actions.getQueue().hasNext()) {
            const Q = 21;
            s1.pos = ex.vec(0, 0);
            for (let i = 0; i < 20; i++) {
                s1.actions
                    .moveTo(ex.vec(i * Q, i * Q), 150)
                    .callMethod(() => {
                        s1.graphics.use(batmanData.Mobs_Sheet.getSprite(0, i % 4));
                    });;
                //s1.actions.runAction(new MyMoveTo(s1, i * Q, i * Q, 150));

                /*
                s1.actions
                    .callMethod(() => {
                        //console.log('set graphics')
                        //s1.graphics.use(batmanData.Mobs_Sheet.getSprite(0, i %4));
                    });
                    */

            }
        }
        //kreslo
        if (!s2.actions.getQueue().hasNext()) {
            //s2.pos = ex.Vector.Zero;
            for (let i = 0; i < 10; i++) {
                let target = this.isoMap.tileToWorld(ex.vec(i, 0));
                s2.actions.moveTo(target, 150);
                //s2.actions.runAction(new MyMoveTo(s2, target.x, target.y, 150));
            }
            s2.actions.callMethod(() => {
                let target = this.isoMap.tileToWorld(ex.vec(0, 0));
                s2.pos = target;
            })
        }
        {
            let bm = this.bm1;
            if (!bm.actions.getQueue().hasNext()) {
                //this.bm1.tilepos = ex.vec(0, 0);
                const W = 4;
                if (bm.tilepos.y == 0 && bm.tilepos.x <= W) {
                    bm.moveToIso(1, 0);
                } else if (bm.tilepos.x >= W && bm.tilepos.y <= W) {
                    bm.moveToIso(0, 1);
                } else if (bm.tilepos.y >= W && bm.tilepos.x > 0) {
                    bm.moveToIso(-1, 0);
                } else if (bm.tilepos.x == 0 && bm.tilepos.y > 0) {
                    bm.moveToIso(0, -1);
                } else {
                    console.log('unknown pos', bm.tilepos);
                }
            }
        }
    }
}
export function createTestScene() {
    //var scene = new TestFontScene();
    var scene = new TestSceneUi();
    //var scene = new TestScenePointerEvents();
    return scene;
}