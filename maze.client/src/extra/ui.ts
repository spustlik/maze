import * as ex from 'excalibur';
import { uiResourceData, uiResources } from './uiResources';

type ClickEvent = () => any;

function measureText(f: ex.SpriteFont | ex.Font, text: string) {
    return f.measureText(text).scale(f.scale);
}
export function createImgButton(text: string,
    args: {
        pos: ex.Vector,
        click: ClickEvent,
        width?: number,
        height?: number,
        font?: ex.Font,
        fontScale?: number,
        colorFg?: ex.Color
        colorHightlightFg?: ex.Color,
        valign?: boolean,
        halign?: boolean
    }) {
    const btn = new ex.ScreenElement({
        x: args.pos.x,
        y: args.pos.y,
        name: text
    });

    const COLOR_FG = args.colorFg ?? ex.Color.Black;
    const COLOR_FGHL = args.colorHightlightFg ?? COLOR_FG;
    const width = args.width ?? 240;
    if (!args.fontScale)
        args.fontScale = 2;
    var { members, sprites } = uiResourceData.getBtnGraphics(width, args.height);
    var g = new ex.GraphicsGroup({ members });
    btn.graphics.add(g);

    let fnt = args.font ?? uiResourceData.Font;
    //args.font ?? new ex.Font({ bold: true, size: args.fontSize ?? 20 })
    let measure = measureText(fnt, text);
    //console.log('measure: ' + text, measure.dimensions);

    let x = 40;
    let y = 30;
    let h = args.height ?? sprites[0].height;
    if (args.valign) {
        y = h / 2 - measure.height;
    }
    if (args.halign) {
        x = width / 2 - measure.width;
    }
    var lbl = new ex.Label({
        pos: ex.vec(x, y),
        color: COLOR_FG,
        text: text,
        spriteFont: fnt instanceof ex.SpriteFont ? fnt : null,
        scale: ex.vec(args.fontScale, args.fontScale),
        font: fnt instanceof ex.Font ? fnt : null
    });
    btn.addChild(lbl);

    btn.on('pointerenter', () => { lbl.color = COLOR_FGHL; lbl.opacity = 0.5; });
    btn.on('pointerleave', () => { lbl.color = COLOR_FG; lbl.opacity = 1; });
    btn.on('pointerdown', () => { lbl.offset = ex.vec(3 / args.fontScale, 3 / args.fontScale); });
    btn.on('pointerup', () => { lbl.offset = ex.vec(0, 0); args.click(); });
    return btn;
}

export function createSpriteButton(args: {
    pos: ex.Vector,
    click: ClickEvent,
    sprite: ex.Sprite,
    spriteHover: ex.Sprite
}) {
    const btn = new ex.ScreenElement({
        x: args.pos.x,
        y: args.pos.y
    });

    btn.graphics.use(args.sprite);

    btn.on('pointerenter', () => { btn.graphics.use(args.spriteHover); });
    btn.on('pointerleave', () => { btn.graphics.use(args.sprite); });
    btn.on('pointerdown', () => { });
    btn.on('pointerup', () => { args.click(); });
    return btn;
}

export function createButton(text: string,
    args: {
        pos: ex.Vector,
        click: ClickEvent,
        width?: number,
        height?: number,
        font?: ex.Font,
        fontSize?: number,
        colorBg?: ex.Color,
        colorHightlightBg?: ex.Color,
        colorFg?: ex.Color
        colorHightlightFg?: ex.Color,
    }) {
    const btn = new ex.ScreenElement({
        x: args.pos.x,
        y: args.pos.y,
    });

    const COLOR_BG = args.colorBg ?? ex.Color.fromHex('8080FF');
    const COLOR_BGHL = args.colorHightlightBg ?? ex.Color.fromHex('d0d0FF');
    const COLOR_FG = args.colorFg ?? ex.Color.Black;
    const COLOR_FGHL = args.colorHightlightFg ?? COLOR_FG;

    const r = new ex.Rectangle({
        width: args.width ?? 170,
        height: args.height ?? 40,
        color: COLOR_BG,
    });

    const t = new ex.Text({
        color: COLOR_FG,
        text: text,
        font: args.font ?? new ex.Font({ bold: true, size: args.fontSize ?? 20 })
    });

    var g = new ex.GraphicsGroup({
        members: [
            { graphic: r, offset: ex.vec(0, 0) },
            { graphic: t, offset: ex.vec(10, 10) },
        ]
    })
    btn.graphics.add(g);
    btn.on('pointerenter', () => { r.color = COLOR_BGHL; t.color = COLOR_FGHL; });
    btn.on('pointerleave', () => { r.color = COLOR_BG; t.color = COLOR_FG; });
    btn.on('pointerup', () => args.click());
    return btn;
}

export type UiButtonArgs = {
    text: string,
    click: ClickEvent
}

export class ModalDialog extends ex.ScreenElement {
    private _resolve: (r: any) => void;
    constructor(scene: ex.Scene, args: {
        text: string,
        buttons: UiButtonArgs[],
        fontScale?: number
    }) {
        const game = scene.engine;
        super({ width: game.drawWidth, height: game.drawHeight });
        this.z = 99999;

        let backdrop = new ex.ScreenElement({ width: this.width, height: this.height, opacity: 0.6, color: ex.Color.Black })
        this.addChild(backdrop);

        const fnt = uiResourceData.GetFont({ scale: args.fontScale });
        var textMeasure = measureText(fnt, args.text);

        const frame_padding = ex.vec(80, 60);
        const width = this.width - 2 * frame_padding.x

        let lbl = new ex.Label({
            x: 10 + width / 2 - textMeasure.width / 2,
            y: 60,
            anchor: ex.vec(0, 0),
            width: textMeasure.width,
            height: textMeasure.height,
            text: args.text,
            spriteFont: fnt,
        });
        console.log('lbl', lbl.pos, lbl.width, lbl.height);

        const BTN_MARGINX = 40;
        const BTNS_H = 90;
        const BTNS_MARGINY = 20;
        let btns = new ex.ScreenElement({
            pos: ex.vec(0, lbl.pos.y + lbl.height + BTNS_MARGINY),
            width: width,
            height: BTNS_H,
            name: 'buttons'
        });
        const btn_w = (width - BTN_MARGINX) / args.buttons.length - BTN_MARGINX;
        for (let i = 0; i < args.buttons.length; i++) {
            let btn = createImgButton(args.buttons[i].text,
                {
                    pos: ex.vec(BTN_MARGINX + (BTN_MARGINX + btn_w) * i, 0),
                    width: btn_w,
                    height: BTNS_H,
                    valign: true, halign: true,
                    click: () => this._buttonClick(args.buttons[i]),
                });
            btn.name = 'btn_' + i;
            btns.addChild(btn);
        }

        let total_height = btns.pos.y + btns.height + frame_padding.y;
        const frame = new ex.ScreenElement({
            pos: frame_padding.add(ex.vec(0, total_height / 2)),
            width: width,
            height: total_height
        });
        this.addChild(frame);
        let { members, sprites } = uiResourceData.getBtnGraphics(frame.width, frame.height);
        frame.graphics.add(new ex.GraphicsGroup({ members }));

        frame.addChild(lbl);
        frame.addChild(btns);

    }
    private _buttonClick(btn: UiButtonArgs) {
        let r = btn.click();
        this._resolve(r);
    }

    public showModal() {
        let p = new Promise((resolve, reject) => {
            this._resolve = resolve;
        });
        p.then(() => {
            this.scene.remove(this);
        });
        return p;
    }
}
