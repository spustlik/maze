import * as ex from 'excalibur';

type ClickEvent = () => void;

export function createButton(pos: ex.Vector, text: string, click: ClickEvent, width?: number, height?: number) {
    const btn = new ex.ScreenElement({
        x: pos.x,
        y: pos.y,
    });

    const C1 = ex.Color.fromHex('8080FF');
    const C2 = ex.Color.fromHex('d0d0FF');
    const CF = ex.Color.Black;

    const r = new ex.Rectangle({
        width: width ?? 170,
        height: height ?? 40,
        color: C1,

    });

    const t = new ex.Text({
        color: CF,
        text: text,
        font: new ex.Font({ bold: true, size: 20 })
    });

    var g = new ex.GraphicsGroup({
        members: [
            { graphic: r, offset: ex.vec(0, 0) },
            { graphic: t, offset: ex.vec(10, 5) },
        ]
    })
    btn.graphics.add(g);
    btn.on('pointerenter', () => r.color = C2);
    btn.on('pointerleave', () => r.color = C1);
    btn.on('pointerup', () => click());
    return btn;
}