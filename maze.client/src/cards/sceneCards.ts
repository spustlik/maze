import * as ex from 'excalibur';
import { DeskBoard, PlayCardWithPos } from './Klondike1GameBoard';
import { CardActor } from './cardActor';
import { PlayCard } from './playCards';


class CardsScene extends ex.Scene {
    board: DeskBoard
    onInitialize(game: ex.Engine) {
        super.onInitialize(game);
        this.board = new DeskBoard();
        var rnd = new ex.Random(1234);
        this.board.init((max) => ex.randomIntInRange(0, max, rnd));
        //this.createActors();
        //this.updateActors();

        {
            let a = this.addCardActor(new PlayCard('s', '9'));
            a.pos = ex.vec(100, 100);
        }
        {
            let a = this.addCardActor(new PlayCard('d', '7'));
            a.pos = ex.vec(300, 100);
            a.z = 99;
        }
        {
            let a = this.addCardActor(new PlayCard('c', 'a'));
            a.pos = ex.vec(300, 140);
            a.z = 100;
        }

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
                let actor = this.findActors(x => x.card == c.card)[0];
                if (!actor) {
                    actor = this.addCardActor(c.card);
                }
            });
    }
    private addCardActor(card: PlayCard) {
        let actor = new CardActor({
            card: card,
            width: 100, height: 150,
            anchor: ex.vec(0, 0),
            offset: ex.vec(0, 0)
        });

        //pointerenter is thru z-index
        actor.collider.useBoxCollider(actor.width, actor.height, ex.vec(0, 0));
        actor.pointer.useColliderShape = true;
        actor.pointer.useGraphicsBounds = false;

        //pointerenter is thru z-index, 
        //pointermove works but leave is not right called
        //actor.pointer.useGraphicsBounds = true;
        
        actor.events.on('pointermove', (evt) => {
        //    actor.graphics.use('hover');
        //    evt.cancel(); //not working
        });
        actor.events.on('pointerenter', (evt) => {
            actor.graphics.use('hover');
            evt.cancel(); //not working
        });
        actor.events.on('pointerleave', (evt) => {
            actor.graphics.use('normal');
            // this is working ok, but not helping: 
            //evt.cancel();
        });
        actor.events.on('pointerdown', (evt: ex.PointerEvent) => {
            console.log('pointer down', actor,evt);
            this.onCardClick(actor, card, evt);
            evt.cancel();
        });
        this.add(actor);
        return actor;
    }

    updateActors() {
        for (let ac of this.findActors(x => true)) {
            this.setCardPos(ac);
            ac.graphics.use(ac.card.special || 'normal');
        }
    }
    setCardPos(actor: CardActor) {
        const CARDCOLS = 10;
        const CARDWIDTH = this.engine.drawWidth / CARDCOLS;
        const CARDHEIGHT = CARDWIDTH * 1.5;
        const SPEED = 500;
        const card = actor.card;
        const pos = this.board.getCardWithPos(card)?.pos;

        function move(vec: ex.Vector) {
            if (!actor.motion.vel.equals(ex.Vector.Zero)) {
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
    onCardClick(actor: ex.Actor, card: PlayCard, evt: ex.Input.PointerEvent) {
        let cp = this.board.getCardWithPos(card);
        console.log('card click', card, cp, actor);
        this.board.cardClick(cp);
        this.updateActors();
    }
}

export function createCardsScene() {
    const scene = new CardsScene();
    return scene;
}