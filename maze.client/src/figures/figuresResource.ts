import * as ex from 'excalibur';
import { StringSource } from '../extra/StringSource';
import { FigDirection, FigureColor, FigureColorX, FigureColors } from './figures';
import { MapType } from '../common/common';

const path = "src/assets/figures/";
export const figuresResources = new class BatmanResources {
    _Font = new ex.FontSource(path + "PLUMP-webfont.woff", "pleasantly_plumpnormal", { size: 20 });

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
    //PlanMap = new StringSource(path + "plan.txt")
    _Selection = new ex.ImageSource(path + "selection.png")
}
export const figuresData = new class FiguresData {
    _Figures_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources.Figures,
        grid: { columns: 4, rows: 1, spriteWidth: 47, spriteHeight: 56 }
    });
    getFont(args?: ex.FontOptions & ex.GraphicOptions & ex.RasterOptions) {
        let opts: ex.FontOptions & ex.GraphicOptions & ex.RasterOptions = {
            family: 'pleasantly_plumpnormal',
            color: ex.Color.White,
            //tint: ex.Color.Blue,
            shadow: { blur: 5, color: ex.Color.Black, offset: ex.vec(0, 0) }
        };
        opts = Object.assign(opts,args)
        return figuresResources._Font.toFont(opts);
    }
    Font = this.getFont();
    FontBig = this.getFont({ scale: ex.vec(3, 3) });

    getFigure(color: FigureColor) {
        const MAP: MapType<FigureColor, number> = { B: 0, G: 1, R: 2, Y: 3 };
        let i = MAP[color];
        return this._Figures_Sheet.getSprite(i, 0);
    }
    _Dice_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Dice,
        grid: { columns: 3, rows: 2, spriteWidth: 100, spriteHeight: 86 }
    });
    getDiceNumber(n: number) {
        n = n - 1;
        return this._Dice_Sheet.getSprite(n % 3, Math.trunc(n / 3));
    }
    _Pointer_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Pointer,
        grid: { columns: 4, rows: 4, spriteWidth: 33, spriteHeight: 37 }
    });
    getPoiner(color: FigureColor, direction: FigDirection) {
        const col_map: MapType<FigureColor, number> = { B: 0, R: 1, Y: 2, G: 3 };
        const dir_map: MapType<FigDirection, number> = { W: 0, S: 1, E: 2, N: 3 };
        const d = dir_map[direction];
        const c = col_map[color];
        return this._Pointer_Sheet.getSprite(d, c);
    }
    _Plan_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Plan,
        grid: { columns: 8, rows: 10, spriteWidth: 50, spriteHeight: 31 }
    });
    dirsToJoints(dirs: FigDirection[]): number {
        dirs.sort();
        const s = dirs.join('');
        const combs = [
            'ENSW', 'ENW', 'ENS', 'EN', 'ESW', 'EW', 'ES', 'E',
            'NSW', 'NW', 'NS', 'N', 'SW', 'W', 'S', ''
        ];
        const i = combs.findIndex(x => x == s);
        if (i < 0)
            console.error(`joints ${s} not found`);
        return i;
    }
    getPlanSprite(type: FigureColorX, joints: number) {
        //5 types (gray,yellow,green,red,blue)
        //  N E
        // W S
        const type_map: MapType<FigureColorX, number> = { x: 0, Y: 1, G: 2, R: 3, B: 4 };
        const t = type_map[type];
        return this._Plan_Sheet.getSprite(joints % 8, t * 2 + Math.trunc(joints / 8));
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
    getAnim(index: number, delay: number) {
        return ex.Animation.fromSpriteSheet(this._Anim_Sheets[index], ex.range(0, 8 * 4 - 1), delay, ex.AnimationStrategy.End);
    }
    _selection_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Selection,
        grid: { columns: 4, rows: 2, spriteWidth: 79, spriteHeight: 49 }
    });
    selectionAnim = ex.Animation.fromSpriteSheet(this._selection_Sheet, ex.range(0, 5), 40, ex.AnimationStrategy.Loop);
    getExColor(color: FigureColor): ex.Color {
        const MAP: MapType<FigureColor, ex.Color> = {
            R: ex.Color.Red,
            G: ex.Color.Green,
            B: ex.Color.Blue,
            Y: ex.Color.Yellow
        };
        return MAP[color];
    }
}
