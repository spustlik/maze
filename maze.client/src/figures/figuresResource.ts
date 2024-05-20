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
    _D10 = new ex.ImageSource(path + "d10.png")
    _D11 = new ex.ImageSource(path + "d11.png")
    _Plan = new ex.ImageSource(path + "plan.png")
    PlanGlow = new ex.ImageSource(path + "plan_glow.png")
    _Pointer = new ex.ImageSource(path + "pointer.png")
    //PlanMap = new StringSource(path + "plan.txt")
    _Selection = new ex.ImageSource(path + "selection.png")
    //_Gui = new ex.ImageSource(path + "gui.png")
    Gui_Gray_Up = new ex.ImageSource(path + "gui_gray_up.png")
    Gui_Gray_Down = new ex.ImageSource(path + "gui_gray_down.png")
}
class FiguresData {
    private _figures_Sheet = ex.SpriteSheet.fromImageSource({
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
        opts = Object.assign(opts, args)
        return figuresResources._Font.toFont(opts);
    }
    Font = this.getFont();
    FontBig = this.getFont({ scale: ex.vec(3, 3) });

    getFigure(color: FigureColor) {
        const MAP: MapType<FigureColor, number> = { B: 0, G: 1, R: 2, Y: 3 };
        let i = MAP[color];
        return this._figures_Sheet.getSprite(i, 0);
    }
    private _dice_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Dice,
        grid: { columns: 3, rows: 2, spriteWidth: 100, spriteHeight: 86 }
    });
    getDiceNumber(n: number) {
        n = n - 1;
        return this._dice_Sheet.getSprite(n % 3, Math.trunc(n / 3));
    }
    private _pointer_Sheet = ex.SpriteSheet.fromImageSource({
        image: figuresResources._Pointer,
        grid: { columns: 4, rows: 4, spriteWidth: 33, spriteHeight: 37 }
    });
    getPoiner(color: FigureColor, direction: FigDirection) {
        const col_map: MapType<FigureColor, number> = { B: 0, R: 1, Y: 2, G: 3 };
        const dir_map: MapType<FigDirection, number> = { W: 0, S: 1, E: 2, N: 3 };
        const d = dir_map[direction];
        const c = col_map[color];
        return this._pointer_Sheet.getSprite(d, c);
    }
    private _plan_Sheet = ex.SpriteSheet.fromImageSource({
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
        return this._plan_Sheet.getSprite(joints % 8, t * 2 + Math.trunc(joints / 8));
    }
    private _sheet(color:FigureColor, opts: ex.SpriteSheetGridOptions & { offset?: ex.Vector, delay?: number }) {
        return { color, sheet: ex.SpriteSheet.fromImageSource(opts), ofs: opts.offset, delay: opts.delay ?? 50 };
    }
    private _dieAnim_Sheets = [
        //blue - deflation
        this._sheet('B', { image: figuresResources._D1, grid: { columns: 8, rows: 4, spriteWidth: 47, spriteHeight: 56 }, offset: ex.vec(-5, -17) }),
        //blue - fireflies
        this._sheet('B', { image: figuresResources._D7, grid: { columns: 8, rows: 4, spriteWidth: 60, spriteHeight: 62 }, offset: ex.vec(2, -16) }),
        //blue - inflation
        this._sheet('B', { image: figuresResources._D8, grid: { columns: 8, rows: 4, spriteWidth: 78, spriteHeight: 87 }, offset: ex.vec(0, -5) }),

        //green - acid
        this._sheet('G', { image: figuresResources._D2, grid: { columns: 8, rows: 4, spriteWidth: 47, spriteHeight: 56 }, offset: ex.vec(-5, -17) }),
        //green - hole fall
        this._sheet('G', { image: figuresResources._D10, grid: { columns: 8, rows: 4, spriteWidth: 80, spriteHeight: 80 }, offset: ex.vec(1, -16), delay:15 }),
        //green - twist down
        this._sheet('G', { image: figuresResources._D11, grid: { columns: 8, rows: 4, spriteWidth: 80, spriteHeight: 80 }, offset: ex.vec(1, -16), delay: 20 }),

        //yellow - skeleton
        this._sheet('Y', { image: figuresResources._D3, grid: { columns: 8, rows: 4, spriteWidth: 80, spriteHeight: 67 }, offset: ex.vec(0, -11) }),
        //yellow - disintegration
        this._sheet('Y', { image: figuresResources._D5, grid: { columns: 8, rows: 4, spriteWidth: 80, spriteHeight: 70 }, offset: ex.vec(1, -11) }),

        //red - melt
        this._sheet('R', { image: figuresResources._D4, grid: { columns: 8, rows: 4, spriteWidth: 56, spriteHeight: 60 }, offset: ex.vec(-1, -14) }),

        //nakrajet na kousky, asi vodorovne, kazdy odjede na jinou stranu
        //rozpadne se jako sklo
        //teleport do nebe, teoreticky i UFO
        //teleport ala SG kruhy
        //teleport ala StarTrek - particles, nebo halo eff
        //ohen, spadne popel
        //twist do tycky
        //voda se roztece, pozor stejne jako RED

    ];

    getDieAnim(c: FigureColor) {
        let copts = this._dieAnim_Sheets.filter(a => a.color == c);
        let r = ex.randomIntInRange(0, copts.length-1);
        let opts = copts[r];
        opts = this._dieAnim_Sheets[5];
        //console.log('getDieAnim', c, r, copts.length, opts);
        let a = ex.Animation.fromSpriteSheet(opts.sheet, ex.range(0, 8 * 4 - 1), opts.delay, ex.AnimationStrategy.End);
        return { anim: a, offset: opts.ofs };
    }
    private _selection_Sheet = ex.SpriteSheet.fromImageSource({
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
    /*
    private gs(src: ex.SourceView) {
        let s = figuresResources._Gui.toSprite();
        //TODO: use ex.SpriteSheet.fromImageSourceWithSourceViews
        s.sourceView = src;
        return s;
    }
    gui = {
        radio: this.gs({ x: 1, y: 2, width: 23, height: 4 * 25 }),
        redUp: this.gs({ x: 29, y: 2, width: 60, height: 32 }),
        redDown: this.gs({ x: 29, y: 37, width: 60, height: 32 }),
        greenFrame: this.gs({ x: 95, y: 5, width: 55, height: 56 }),
        grayUp: this.gs({ x: 153, y: 3, width: 45, height: 34 }),
        grayDown: this.gs({ x: 153, y: 39, width: 45, height: 34 }),
        greenUp: this.gs({ x: 137, y: 182, width: 43, height: 33 }),
    }*/
}

export const figuresData = new FiguresData();