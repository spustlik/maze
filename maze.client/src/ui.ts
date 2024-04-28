import * as ex from 'excalibur';

type ClickEvent = () => void;

export function createButton(text: string,
    args: {
        pos: ex.Vector,
        click: ClickEvent,
        width?: number,
        height?: number,
        font?: ex.Font,
        fontSize?: number
    }) {
    const btn = new ex.ScreenElement({
        x: args.pos.x,
        y: args.pos.y,
    });

    const C1 = ex.Color.fromHex('8080FF');
    const C2 = ex.Color.fromHex('d0d0FF');
    const CF = ex.Color.Black;

    const r = new ex.Rectangle({
        width: args.width ?? 170,
        height: args.height ?? 40,
        color: C1,
    });

    const t = new ex.Text({
        color: CF,
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
    btn.on('pointerenter', () => r.color = C2);
    btn.on('pointerleave', () => r.color = C1);
    btn.on('pointerup', () => args.click());
    return btn;
}