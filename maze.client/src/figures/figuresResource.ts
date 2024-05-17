import * as ex from 'excalibur';
import { StringSource } from '../extra/StringSource';
import { FigDirection, FigureColor } from './figures';

const path = "src/assets/figures/";
export const figuresResources = new class BatmanResources {
    Font = new ex.FontSource(path + "PLUMP-webfont.woff", "pleasantly_plumpnormal", { size: 20 });

    Figures = new ex.ImageSource(path + "figs.png")
    _Dice = new ex.ImageSource(path + "dice.png")
    _D1 = new ex.ImageSource(path + "d1.png")
    _D2 = new ex.ImageSource(path + "d2.png")
    _D3 = new ex.ImageSource(path + "d3.png")
    _D4 = new ex.ImageSource(path + "d4.png")
    _D5 = new ex.ImageSource(path + "d5.png")
    //D6 = new ex.ImageSource(path + "d6.png")
    _D7 = new ex.ImageSource(path + "d7.png")
    _D8 = new ex.ImageSource(path + "d8.png")
    _Plan = new ex.ImageSource(path + "plan.png")
    PlanGlow = new ex.ImageSource(path + "plan_glow.png")
    _Pointer = new ex.ImageSource(path + "pointer.png")
    PlanMap = new StringSource(path + "plan.txt")
}
export const figuresData = new class FiguresData {
    _Figures_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources.Figures,
        grid: { columns: 4, rows: 1, spriteWidth: 47, spriteHeight: 56 }
    });
    getFigure(color: number) {
        return this._Figures_Sheet.getSprite(color, 0);
    }
    _Dice_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Dice,
        grid: { columns: 3, rows: 2, spriteWidth: 100, spriteHeight: 86 }
    });
    getDiceNumber(n: number) {
        return this._Dice_Sheet.getSprite(n % 3, Math.trunc(n / 2));
    }
    _Pointer_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Dice,
        grid: { columns: 4, rows: 4, spriteWidth: 33, spriteHeight: 67 }
    });
    getPoiner(color: number, direction: FigDirection) {
        //color = blue,red, yellow,green
        //direction = W,S,E,N
        const dir_map = { 'W': 0, 'S': 1, 'E': 2, 'N': 3 };
        var d = dir_map[direction];
        return this._Pointer_Sheet.getSprite(d, color);
    }
    _Plan_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Plan,
        grid: { columns: 8, rows: 10, spriteWidth: 50, spriteHeight: 31 }
    });
    getPlanSprite(type: FigureColor | 'x', joints: number) {
        //5 types (gray,yellow,green,red,blue)
        //  N E
        // W S
        //16 joints (
        //NWES, NWE, NES, NE, ESW, EW, ES, E
        //NWS, NW, NS, N, WS, W, S, 0
        const type_map = { 'x': 0, 'Y': 1, 'G': 2, 'R': 3, 'B': 4 };
        var t = type_map[type];
        let row = t * 2;
        return this._Plan_Sheet.getSprite(joints % 8, row + Math.trunc(joints / 8));
    }
    _Anim_Sheets = [
        //blue
        ex.SpriteSheet.fromImageSource({ image: figuresResources._D1, grid: { columns: 8, rows: 4, spriteWidth: 47, spriteHeight: 56 } }),
        ex.SpriteSheet.fromImageSource({ image: figuresResources._D7, grid: { columns: 8, rows: 4, spriteWidth: 60, spriteHeight: 62 } }),
        ex.SpriteSheet.fromImageSource({ image: figuresResources._D8, grid: { columns: 8, rows: 4, spriteWidth: 78, spriteHeight: 87 } }),
        //green
        ex.SpriteSheet.fromImageSource({ image: figuresResources._D2, grid: { columns: 8, rows: 4, spriteWidth: 47, spriteHeight: 56 } }),
        //yellow
        ex.SpriteSheet.fromImageSource({ image: figuresResources._D3, grid: { columns: 8, rows: 4, spriteWidth: 80, spriteHeight: 67 } }),
        ex.SpriteSheet.fromImageSource({ image: figuresResources._D5, grid: { columns: 8, rows: 4, spriteWidth: 80, spriteHeight: 70 } }),
        //red
        ex.SpriteSheet.fromImageSource({ image: figuresResources._D4, grid: { columns: 8, rows: 4, spriteWidth: 56, spriteHeight: 60 } }),
    ];
    getAnim(index:number,delay:number) {
        ex.Animation.fromSpriteSheet(this._Anim_Sheets[index], ex.range(0,8*4-1), delay, ex.AnimationStrategy.End);

    }

}
