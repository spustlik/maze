import * as ex from 'excalibur';
import { PlayCard, isRedCard, suiteStr } from './playCards';

export class CardActor extends ex.Actor {
    card: PlayCard;
    constructor(config: ex.ActorArgs & { card: PlayCard; }) {
        super(config);
        this.card = config.card;
        this.createGraphics(); //maybe in init
    }
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        this.updateGraphics();
    }
    private createGraphics() {
        const c = this.card;
        const a = this;
        function createRect() {
            return new ex.Rectangle({
                width: a.width,
                height: a.height,
                strokeColor: ex.Color.Black,
                color: ex.Color.White
            });
        }
        function createText() {
            return new ex.Text({
                text: `${c.card.toUpperCase()}${suiteStr(c.suite)}`,
                font: new ex.Font({ bold: true, size: 50 }),
                color: isRedCard(c.suite) ? ex.Color.Red : ex.Color.Black,
                //width: r.width
            });
        }

        {
            let g = new ex.GraphicsGroup({
                members: [
                    { graphic: createRect(), offset: ex.vec(0, 0) },
                    { graphic: createText(), offset: ex.vec(10, 10) }
                ]
            });
            this.graphics.add('normal', g);
        }
        {
            let r = createRect();
            r.strokeColor = ex.Color.Blue;
            r.lineWidth = 10;
            r.color = ex.Color.Transparent;
            //let g = new ex.GraphicsGroup({
            //    members: [
            //        { graphic: r, offset: ex.vec(0, 0) },
            //        //{ graphic: createText(), offset: ex.vec(10, 10) }
            //    ]
            //});
            this.graphics.add('hover', r);
        }
        {
            //empty
            let g = createRect();
            g.color = ex.Color.fromHex('#c0c0ff');
            this.graphics.add('x', g);
        }
        {
            //back
            let r = createRect();
            r.color = ex.Color.LightGray;
            let c = new ex.Circle({
                radius: r.width / 4,
                strokeColor: ex.Color.Red,
                color: ex.Color.Orange
            });
            let g = new ex.GraphicsGroup({
                members: [
                    { graphic: r, offset: ex.vec(0, 0) },
                    { graphic: c, offset: ex.vec(r.width / 4, r.height / 4), }
                ]
            });
            this.graphics.add('b', g);
        }
    }
    updateGraphics(hover?: boolean) {
        var g = this.card.special;
        if (!g)
            g = 'normal';
        var std = this.graphics.graphics[g];
        if (!std) {
            console.warn('?graphics ' + g, this.graphics.getNames());
            return;
        }
        if (hover) {
            std = new ex.GraphicsGroup({
                members: [std, this.graphics.graphics['hover']]
            });
        }
        this.graphics.use(std);
    }

    update(game: ex.Engine, delta) {
        super.update(game, delta);
    }
}
