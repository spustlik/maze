import * as ex from 'excalibur';


export const uiResources = new class UiResources {
    button = new ex.ImageSource("src/assets/button.png")
    bg = new ex.ImageSource("src/assets/homebg.jpeg")
    font = new ex.ImageSource("src/assets/font.png")
}

export const uiResourceData = new class UiResourceData {
    getBtnGraphics(width: number, height?: number) {
        const W1 = 39;
        const H1 = 39;
        const w = uiResources.button.width;
        const h = uiResources.button.height;
        const W2 = width - W1 * 2;
        if (!height)
            height = h;
        var img = [
            new ex.Sprite({ image: uiResources.button, sourceView: { x: 0, y: 0, width: W1, height: H1 } }),
            new ex.Sprite({
                image: uiResources.button, sourceView: { x: W1, y: 0, width: w - W1 * 2, height: H1 },
                destSize: { width: W2, height: H1 }
            }),
            new ex.Sprite({ image: uiResources.button, sourceView: { x: w - W1, y: 0, width: W1, height: H1 } }),

            new ex.Sprite({
                image: uiResources.button, sourceView: { x: 0, y: H1, width: W1, height: h - H1 * 2 },
                destSize: { width: W1, height: height - H1 * 2 }
            }),
            new ex.Sprite({
                image: uiResources.button, sourceView: { x: W1, y: H1, width: w - W1 * 2, height: h - H1 * 2 },
                destSize: { width: W2, height: height - H1 * 2 }
            }),
            new ex.Sprite({
                image: uiResources.button, sourceView: { x: w - W1, y: H1, width: W1, height: h - H1 * 2 },
                destSize: { width: W1, height: height - H1 * 2 }
            }),

            new ex.Sprite({ image: uiResources.button, sourceView: { x: 0, y: h - H1, width: W1, height: H1 } }),
            new ex.Sprite({
                image: uiResources.button, sourceView: { x: W1, y: h - H1, width: w - W1 * 2, height: H1 },
                destSize: { width: W2, height: H1 }
            }),
            new ex.Sprite({ image: uiResources.button, sourceView: { x: w - W1, y: h - H1, width: W1, height: H1 } }),
        ];
        var members: ex.GraphicsGrouping[] = [
            { graphic: img[0], offset: ex.vec(0, 0) },
            { graphic: img[1], offset: ex.vec(W1, 0) },
            { graphic: img[2], offset: ex.vec(width - W1, 0) },
            { graphic: img[3], offset: ex.vec(0, H1) },
            { graphic: img[4], offset: ex.vec(W1, H1) },
            { graphic: img[5], offset: ex.vec(width - W1, H1) },
            { graphic: img[6], offset: ex.vec(0, height - H1) },
            { graphic: img[7], offset: ex.vec(W1, height - H1) },
            { graphic: img[8], offset: ex.vec(width - W1, height - H1) }
        ];
        return { members, sprites: img };
    };
    _fontSpriteSheet = ex.SpriteSheet.fromImageSource({
        image: uiResources.font,
        grid: { columns: 1, rows: 45, spriteWidth: 10, spriteHeight: 10 }
    });
    Font = new ex.SpriteFont({
        alphabet: '01234567890.- ©][ABCDEFGHIJKLMNOPQRSTUVWXYZ|/',
        caseInsensitive: true,
        spriteSheet: this._fontSpriteSheet,
        spacing:1
    });
}


