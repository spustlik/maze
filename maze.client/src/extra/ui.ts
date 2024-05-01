import * as ex from 'excalibur';
import { uiResourceData, uiResources } from './uiResources';

type ClickEvent = () => void;

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

export function createImgButton(text: string,
    args: {
        pos: ex.Vector,
        click: ClickEvent,
        width?: number,
        height?: number,
        font?: ex.Font,
        fontSize?: number,
        colorFg?: ex.Color
        colorHightlightFg?: ex.Color,
    }) {
    const btn = new ex.ScreenElement({
        x: args.pos.x,
        y: args.pos.y,
    });

    const COLOR_FG = args.colorFg ?? ex.Color.Black;
    const COLOR_FGHL = args.colorHightlightFg ?? COLOR_FG;
    const width = args.width ?? 170;

    const t = new ex.Text({
        color: COLOR_FG,
        text: text,
        font: args.font ?? new ex.Font({ bold: true, size: args.fontSize ?? 20 })
    });

    var { members, sprites } = uiResourceData.getBtnGraphics(width, args.height);

    var g = new ex.GraphicsGroup({
        members: members.concat([
            { graphic: t, offset: ex.vec(10, 10) },
        ])
    });
    btn.graphics.add(g);

    /*
    btn.graphics.add(new ex.GraphicsGroup({
        members: sprites.map((s, i) => ({ graphic: s, offset: ex.vec(10, i * 60) }))
    }));
    */
    btn.on('pointerenter', () => { t.color = COLOR_FGHL; });
    btn.on('pointerleave', () => { t.color = COLOR_FG; });
    btn.on('pointerup', () => args.click());
    return btn;
}