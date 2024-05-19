import * as ex from 'excalibur';
import { getScaledGraphics9 } from './extra';


export const uiResources = new class UiResources {
    button = new ex.ImageSource("src/assets/button.png")
    buttonClose = new ex.ImageSource("src/assets/buttonclose.png")
    bg = new ex.ImageSource("src/assets/homebg.jpeg")
    font = new ex.ImageSource("src/assets/font.png")
}

class UiResourceData {
    getBtnGraphics(width: number, height?: number) {
        const W1 = 39;
        const H1 = 39;
        return getScaledGraphics9(uiResources.button, width, height, W1, H1);
    };
    _fontSpriteSheet = ex.SpriteSheet.fromImageSource({
        image: uiResources.font,
        grid: { columns: 1, rows: 45, spriteWidth: 10, spriteHeight: 10 }
    });
    Font = this.GetFont({});

    ButtonCloseSpriteSheet = ex.SpriteSheet.fromImageSource({
        image: uiResources.buttonClose,
        grid: { columns: 1, rows: 2, spriteWidth: 60, spriteHeight: 62 /*uiResources.buttonClose.height / 2*/ }
    });


    public GetFont(args: { scale?: number }) {
        return new ex.SpriteFont({
            alphabet: '01234567890.- ©][ABCDEFGHIJKLMNOPQRSTUVWXYZ|/',
            caseInsensitive: true,
            spriteSheet: this._fontSpriteSheet,
            scale: args.scale ? ex.vec(args.scale, args.scale) : null,
            spacing: 1
        });
    }
}

export const uiResourceData = new UiResourceData();