import * as ex from 'excalibur';

export function loadResources(loader: ex.DefaultLoader, resObj:any) {
    for (var r in resObj) {
        //console.log('loading', r);
        loader.addResource(resObj[r]);
    }
}

export function getScaledGraphics9(
    src: ex.ImageSource,
    width: number,
    height: number,
    W1: number, H1: number
) {
    const w = src.width;
    const h = src.height;
    if (!height)
        height = h;
    const W2 = width - W1 * 2;
    var img = [
        new ex.Sprite({ image: src, sourceView: { x: 0, y: 0, width: W1, height: H1 } }),
        new ex.Sprite({
            image: src, sourceView: { x: W1, y: 0, width: w - W1 * 2, height: H1 },
            destSize: { width: W2, height: H1 }
        }),
        new ex.Sprite({ image: src, sourceView: { x: w - W1, y: 0, width: W1, height: H1 } }),

        new ex.Sprite({
            image: src, sourceView: { x: 0, y: H1, width: W1, height: h - H1 * 2 },
            destSize: { width: W1, height: height - H1 * 2 }
        }),
        new ex.Sprite({
            image: src, sourceView: { x: W1, y: H1, width: w - W1 * 2, height: h - H1 * 2 },
            destSize: { width: W2, height: height - H1 * 2 }
        }),
        new ex.Sprite({
            image: src, sourceView: { x: w - W1, y: H1, width: W1, height: h - H1 * 2 },
            destSize: { width: W1, height: height - H1 * 2 }
        }),

        new ex.Sprite({ image: src, sourceView: { x: 0, y: h - H1, width: W1, height: H1 } }),
        new ex.Sprite({
            image: src, sourceView: { x: W1, y: h - H1, width: w - W1 * 2, height: H1 },
            destSize: { width: W2, height: H1 }
        }),
        new ex.Sprite({ image: src, sourceView: { x: w - W1, y: h - H1, width: W1, height: H1 } }),
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
    return new ex.GraphicsGroup({ members });
}