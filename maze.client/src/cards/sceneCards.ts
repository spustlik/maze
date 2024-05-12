import * as ex from 'excalibur';
import { DeskBoard, PlayCardWithPos } from './Klondike1GameBoard';
import { PlayCard, isRedCard, suiteStr } from './playCards';


class CardActor extends ex.Actor {
    card: PlayCardWithPos;
    constructor(config: ex.ActorArgs & { card: PlayCardWithPos }) {
        super(config);
        this.card = config.card;
    }
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        const c = this.card.card;
        function createRect() {
            return new ex.Rectangle({
                width: 100,
                height: 150,
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
            this.graphics.add('NORMAL', g);
        }
        {
            let g = createRect();
            g.color = ex.Color.fromHex('#c0c0ff');
            this.graphics.add('x', g);
        }
        {
            let r = createRect();
            r.color = ex.Color.LightGray;
            let c = new ex.Circle({
                radius: r.width / 2,
                //strokeColor: ex.Color.Orange,
                color: ex.Color.Orange
            });
            let g = new ex.GraphicsGroup({
                members: [
                    { graphic: r, offset: ex.vec(0, 0) },
                    { graphic: c, offset: ex.vec(0, 0), }
                ]
            });
            this.graphics.add('b', g);
        }
    }
    update(game: ex.Engine, delta) {
        super.update(game, delta);
        this.graphics.use(this.card.card.special || 'NORMAL');
    }
}

class CardsScene extends ex.Scene {
    board: DeskBoard
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        this.board = new DeskBoard();
        var rnd = new ex.Random(1234);
        this.board.init((max) => ex.randomIntInRange(0, max, rnd));
        this.createActors();
        this.updateActors();
    }
    update(game: ex.Engine, delta) {
        super.update(game, delta);
    }
    findActors(predicate: (a: CardActor) => boolean) {
        return this.actors.filter(x => x instanceof CardActor && x.card).filter(predicate) as CardActor[];
    }
    createActors() {
        this.board.cards
            .forEach(c => {
                let actor = this.findActors(x => x.card == c)[0];
                if (!actor) {
                    actor = new CardActor({ card: c });
                    actor.events.on('pointerdown', (evt: ex.PointerEvent) => {
                        this.onCardClick(actor, c, evt);
                    })
                    //actor.offset = ex.vec(0, 0);
                    actor.anchor = ex.vec(0, 0);
                    this.add(actor);
                }
            });
    }
    updateActors() {
        for (let ac of this.findActors(x => true)) {
            this.setCardPos(ac);
        }
    }
    setCardPos(actor: CardActor) {
        const CARDCOLS = 10;
        const CARDWIDTH = this.engine.drawWidth / CARDCOLS;
        const CARDHEIGHT = CARDWIDTH * 1.5;
        const SPEED = 500;
        const card = actor.card;
        const pos = card.pos;

        function move(vec: ex.Vector) {
            if (!actor.motion.vel.equals(ex.Vector.Zero))
            {
                //postpone
                //console.log('postponing move');
                actor.actions.callMethod(() => move(vec));
                return;
            }
            if (actor.pos.equals(vec))
                return;
            actor.actions
                .callMethod(() => actor.z = 999)
                .moveTo(vec, SPEED)
                .callMethod(() => actor.z = pos.cardindex)
                //.callMethod(()=>console.log('card moved '+card.card));
            /*
            ex.coroutine(this, function* () {
                let elapsed = 0;
                actor.z = 999;

                while()
            })*/
        }
        switch (pos.stack) {
            case 'column': {
                    move(ex.vec(CARDWIDTH * pos.stackindex, CARDHEIGHT + 20 + pos.cardindex * 20));
                break;
            }
            case 'goal': {
                move(ex.vec(CARDWIDTH * pos.stackindex, 0));
                break;
            }
            case 'packet': {
                let last3 = Math.max(this.board.packet.length - 3, 0);

                //console.log('last 3: '+last3);
                if (pos.cardindex >= last3) {
                    move(ex.vec(CARDCOLS * CARDWIDTH - CARDWIDTH * 1.5 - (pos.cardindex - last3) * 20, 0));
                } else {
                    actor.pos = ex.vec(CARDCOLS * CARDWIDTH - CARDWIDTH * 1.5, 0);
                    actor.z = pos.cardindex;
                }
                break;
            }
            default:
                throw "Unknown stack type " + pos.stack;
        }
    }
    onCardClick(actor: ex.Actor, card: PlayCardWithPos, evt: ex.Input.PointerEvent) {
        console.log('card click', card, actor);
        this.board.cardClick(card);
        this.updateActors();
    }
}

export function createCardsScene() {
    const scene = new CardsScene();
    return scene;
}