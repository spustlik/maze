import { PlayCard, ctos, getNextCard, isRedCard } from "./playCards";
import { NextRandom, delayAsync, insertItem, lastItem, max, orderBy, removeItem } from "../common/common";
import { getDeckCards, getShuffledCards } from "./deck";


type PlayStack = PlayCard[];
type CardStackType = 'column' | 'goal' | 'packet';

export type CardPos = {
    stack: CardStackType
    stackindex: number // position of stack
    cardindex: number //position of card in stack
}
export function ptos(x: CardPos) {
    return `${x.stack}: ${x.stackindex} ${x.cardindex}`;
}
export function isSamePos(p1: CardPos, p2: CardPos) {
    return p1 != p2 && p1.stack != p2.stack && p1.stackindex != p2.stackindex && p1.cardindex != p2.cardindex;
}

export type PlayCardWithPos = {
    card: PlayCard
    pos: CardPos
}


/*
packet click
- if first (empty) card, rotate packet
- only top card
- to goal (suitable - i.e. same suite, next card,or empty && ACE)
- to column (first suitable - i.e. empty column && KING, color!=color && next card)
? which action? if exists "to column", use it, else to "goal"
column click
- to goal (same as packet)
- to column (same as packet, must be another column, ideally next right)
- move pack of card(s) to column (flipped card(s)), if starts with KING, it can be moved to empty column
? which action? if exists "to column", use it, else to "goal"
x to pack - NO
goal click
- to column (same as packet)
x to pack - NO
*/

function createCard(card: PlayCard, stack: CardStackType, stackIndex: number, index: number): PlayCardWithPos {
    return { card, pos: { stack, stackindex: stackIndex, cardindex: index } };
}

export class DeskBoard {
    private columns: PlayStack[] = []
    private goals: PlayStack[] = []
    public packet: PlayStack = []
    public cards: PlayCardWithPos[] = []
    private _lastPacketCard: PlayCard;
    public packetRotates = 0;

    private dump(nolog: boolean = false) {
        const data = {
            packet: this.packet.map(c => c + ' ' + ptos(this.getCardWithPos(c).pos)),
            columns: this.columns,
            goals: this.goals,
            cards: this.cards,
            //ppacket: this.packet.map(c => this.getCardPos(c)),
            pstacks: this.columns.map(s => s.map(x => this.getCardWithPos(x).pos)),
            pgoals: this.goals.map(g => g.map(x => this.getCardWithPos(x).pos)),
        };
        let str = "";
        for (let g = 0; g < this.goals.length; g++) {
            str += `goal #${g}: `;
            if (this.goals[g].length == 0)
                str += '(empty)';
            else
                str += lastItem(this.goals[g]).toString();
            str += "\n";
        }
        //str += "columns:\n";
        let maxlen = max(...this.columns.map(a => a.length));
        for (let col = 0; col < this.columns.length; col++) {
            for (let i = 0; i < maxlen; i++) {
                let c = this.columns[col][i];
                if (c) {
                    str += ctos(this.columns[col][i]) + ' ';
                } else {
                    str += '   ';
                }
            }
            str += "\n";
        }
        str += `packet reversed (cnt=${this.packet.length}):\n`;
        for (let i = this.packet.length - 1; i >= Math.max(0, this.packet.length - 5); i--) {
            str += this.packet[i].toString() + " ";
        }
        str += "\n";
        if (!nolog)
            console.log('dump', "\n" + str, JSON.parse(JSON.stringify(data)));
        return data;
    }
    constructor() {
        for (let i = 0; i < 7; i++) {
            this.columns.push([]);
        }
        for (let i = 0; i < 4; i++) {
            this.goals.push([PlayCard.Empty()]);
        }
        this.packet.push(PlayCard.Empty());
    }
    public init(rnd: NextRandom) {
        let deck = getDeckCards();
        deck = getShuffledCards(rnd, deck, 100);
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                const x = deck.pop();
                if (x) {
                    if (j < i)
                        x.special = 'b';
                    this.addCardToList(x, 'column', i);
                }
            }
        }

        deck.forEach(c => this.addCardToList(c, 'packet', 0));
        this.initPositions();
        this.dump();
    }
    private initPositions() {
        //goals - all, empty cards
        this.cards.push(...this.goals.map((g, gi) => g.map((x, i) => createCard(x, 'goal', gi, i))).flat());
        //columns - all
        this.cards.push(...this.columns.map((s, si) => s.map((x, i) => createCard(x, 'column', si, i))).flat());
        //packet - but visible only last 3
        this.cards.push(...this.packet.map((c, i) => createCard(c, 'packet', 0, i)));
        this.fixPacket();
    }
    public getCardWithPos(card: PlayCard): PlayCardWithPos {
        const r = this.cards.find(x => x.card == card);
        if (!r)
            throw new Error(`Card ${card} not found`);
        return r;
    }
    private addCardToList(card: PlayCard, stack: CardStackType, stackindex: number) {
        let list: PlayStack;
        switch (stack) {
            case 'column': list = this.columns[stackindex]; break;
            case 'goal': list = this.goals[stackindex]; break;
            case 'packet': list = this.packet; break;
            default:
                throw new Error('Unknown stack type');
        }
        list.push(card);

        const r: PlayCardWithPos = {
            card,
            pos: { stack: stack, stackindex: stackindex, cardindex: list.length - 1 }
        };
        return r;
    }

    private removeCard(x: PlayCardWithPos) {
        switch (x.pos.stack) {
            case 'column': {
                if (removeItem(this.columns[x.pos.stackindex], x.card) != null) {
                    //llog(`column ${x.pos.index} removed card ${x.card}`, this.stacks[x.pos.index].length);
                }
                this.fixColumn(x.pos.stackindex);
                return
            }
            case 'packet': {
                removeItem(this.packet, x.card);
                return
            }
            case 'goal': {
                removeItem(this.goals[x.pos.stackindex], x.card);
                return
            }
        }
    }
    private moveCard(c: PlayCardWithPos, nstack: CardStackType, nsindex: number) {
        //console.log('moveCard', { c, nstack, nindex });
        this.removeCard(c);
        const newcard = this.addCardToList(c.card, nstack, nsindex); //not needed to push to this.cards, because it already exists
        c.pos = newcard.pos;
        //TODO: move animation
    }
    public cardClick(x: PlayCardWithPos) {
        switch (x.pos.stack) {
            case 'column': {
                this.columnCardClick(x);
                return
            }
            case 'packet': {
                this.packetCardClick(x);
                return
            }
            case 'goal': {
                //todo:find suitable column
                //other movements must be done by d&d
                return
            }
        }
    }
    public packetRotate() {
        const last = lastItem(this.packet);
        if (last && last.special == null && last.isSame(this._lastPacketCard)) {
            this.packetRotates++;
        } else if (this.packet.indexOf(this._lastPacketCard) < 0) {
            this._lastPacketCard = last;
        }
        // get next 3 cards
        const last3 = this.packet.splice(Math.max(this.packet.length - 3, 0) + 1, 3);
        insertItem(this.packet, 1, ...last3);
        this.fixPacket();
        console.log('packetRotate', this.packet.map(c => c.isSame(this._lastPacketCard) ? '{' + c + '}' : c).join('; '));
        this.checkGameOver();
    }
    public packetCardClick(x: PlayCardWithPos) {
        if (x.card.special == 'x') {
            this.packetRotate();
            return;
        }
        const c = this.getCardWithPos(lastItem(this.packet));
        const goalStack = this.getGoalStackForCard(c.card);
        if (goalStack) {
            //this.addCardToList(x.card, )
            this.removeGoalStackEmpty(goalStack.goalstack);
            this.moveCard(c, 'goal', goalStack.index);
        }
        else {
            const stpos = this.getNextColumnForCard(c.card);
            if (stpos) {
                //first or single
                this.ensureColumnFirst(stpos);
                this.moveCard(c, 'column', stpos.index);
                this.fixColumn(stpos.index);
            } else {
                this.packetRotate();
                return;
            }
            //other movements must be done by d&d
        }
        this.fixPacket();
        //console.log('packet', this.dump(true).packet);
    }

    columnCardClick(c: PlayCardWithPos) {
        if (c.card.special == 'x')
            return;
        if (c.card.card == 'k' && c.card.special == null) {
            //click to columns with not backed KING, move it to empty stack
            let emptyColumns = this.columns
                .map((x, i) => ({ index: i, column: x }))
                .filter(x => x.column.length == 1 && x.column[0].special == 'x');
            if (emptyColumns.length > 0) {
                const cstack = this.columns[c.pos.stackindex];
                this.ensureColumnFirst(emptyColumns[0]);
                const movePack = cstack.splice(c.pos.cardindex);
                //removeItem(emptyStacks, emptyStacks[0]);
                movePack.forEach(x => {
                    this.moveCard(this.getCardWithPos(x), 'column', emptyColumns[0].index);
                });
            }
            return;
        }
        if (lastItem(this.columns[c.pos.stackindex]) != c.card)
            return; // only last cards in stack can be clicked
        let goalSuiteStack = this.getGoalStackForCard(c.card);
        console.log('found goal for suite ' + c.card.suite, { s: goalSuiteStack, goals: this.goals });
        if (goalSuiteStack) {
            //this.removeCard(x);
            //goalSuiteStack.push(x.card);
            this.removeGoalStackEmpty(goalSuiteStack.goalstack);
            this.moveCard(c, 'goal', goalSuiteStack.index);
            //this.dump();
            return;
        }
        //if not possible to add to goal, try add to another stack
        //TODO: first to right?
        let stack = this.getNextColumnForCard(c.card);
        if (stack) {
            //first or single
            this.moveCard(c, 'column', stack.index);
            return;
        }
        console.warn('Cannot find suitable goal stack');
    }
    getNextColumnForCard(c: PlayCard): { column: PlayStack, index: number } {
        function isNextCardInColumn(s: PlayStack, c: PlayCard): boolean {
            //llog('isNextInStack', s, c);
            let last = lastItem(s);
            if (last && last.special == 'x' && c.card == 'k')
                return true; //KING to empty stack
            if (!last || last.special == 'x')
                return false;
            if (isRedCard(last.suite) == isRedCard(c.suite)) //red to black and otherwise
                return false;
            if (getNextCard(c) != last.card)
                return false;
            return true;
        }

        let possibleColumns = this.columns
            .map((s, i) => ({ column: s, index: i }))
            .filter(x => isNextCardInColumn(x.column, c));
        //console.warn('possiblestacks', possibleStacks);
        return possibleColumns[0];
    }

    getGoalStackForCard(c: PlayCard): { goalstack: PlayStack, index: number, first: PlayCard } {
        let goalData = this.goals
            .map((x, i) => ({ goalstack: x, index: i, first: x[0] }));
        if (c.card == 'a' && c.special == null) {
            // only A can be added first
            let emptyStack = goalData.find(x => x.first.special == 'x'); // where first card of goal is empty
            return emptyStack;
        }

        let goalSuiteStack = goalData
            .find(x => x.first.special == null && x.first.suite == c.suite);
        if (!goalSuiteStack) {
            return;
        }
        //console.log('getGoalStackForCard', { x, goalSuiteStack });
        //check, if it is possible to add it to goal
        let last = lastItem(goalSuiteStack.goalstack);
        if (!last || last.suite != c.suite || last.special != null || getNextCard(last) != c.card)
            return;
        if (c.card == 'k') {
            this.checkGameOver();
        }
        return goalSuiteStack;
    }
    removeGoalStackEmpty(goalstack: PlayStack) {
        if (!goalstack || goalstack.length == 0)
            return;
        if (goalstack[0].special == 'x')
            goalstack.splice(0); //remove empty card
    }
    public isGameOver(): boolean {
        //TODO: check if there is no more possible moves ?
        //TODO: packet rotates
        if (this.packetRotates >= 3)
            return true;
        return this.goals.every(g => lastItem(g)?.card == 'k');
    }
    public checkGameOver() {
        if (this.isGameOver()) {
            //TODO: emit some event
            throw new Error('Game over');
        }
    }
    private fixColumn(index: number) {
        const s = this.columns[index];
        console.log('fixing stack ' + index, s);
        if (s.length == 0) {
            const c = PlayCard.Empty();
            const cp = this.addCardToList(c, 'column', index);
            this.cards.push(cp);
        } else {
            if (s.length > 0) {
                s[s.length - 1].special = null; //flip last card
            }
        }
    }
    private fixPacket() {
        this.packet.forEach((pc, i) => {
            const r = this.getCardWithPos(pc);
            if (r.pos.cardindex != i) {
                //this.moveCard(r, r.pos.stack, newi);
                r.pos.cardindex = i;
                //TODO: animation
            }
        });
        if (this.packet.length == 0) {
            console.log('empty packet');
            const c = this.addCardToList(PlayCard.Empty(), 'packet', 0);
            c.pos.cardindex = 2;
            this.cards.push(c);
        }
    }
    private ensureColumnFirst(a: { column: PlayStack, index: number }) {
        if (a.column.length == 1 && a.column[0].special == 'x') {
            a.column.splice(0, 1);
            const cp = this.cards.find(x =>
                x.pos.stack == 'column'
                && x.pos.stackindex == a.index
                && x.pos.cardindex == 0
                && x.card.special == 'x');
            removeItem(this.cards, cp);
        }
    }

    public async trySolveAsync(delay: number) {
        console.log('trysolve');
        const log = (s: string, ...args: any[]) => {
            console.log(s, args);
        };
        let packetDeals = 3 * this.packet.length;
        while (!this.isGameOver()) {
            await delayAsync(delay);
            //try packet -> goal
            const lastPacket = lastItem(this.packet);
            if (lastPacket) {
                if (this.getGoalStackForCard(lastPacket)) {
                    log('packet->goal', this.dump(true));
                    this.packetCardClick(this.getCardWithPos(lastPacket));
                    //log('packet->goal done', this.dump(true));
                    continue;
                }
            }
            //try stack -> goal
            const goalings = this.columns
                .map(x => ({ c: lastItem(x), s: x }))
                .filter(x => x.c)
                .map(x => Object.assign(x, { g: this.getGoalStackForCard(x.c) }))
                .filter(x => x.g);
            const shortest = orderBy(goalings, st => st.s.length)[0];
            if (shortest) {
                log('stack->goal', this.dump(false));
                this.removeGoalStackEmpty(shortest.g!.goalstack);
                this.columnCardClick(this.getCardWithPos(shortest.c));
                continue;
            }

            //try packet rotate
            if (lastPacket && packetDeals > 0) {
                //log('deal packet', packetDeals);
                this.packetRotate();
                packetDeals--;
                continue;
            }
            console.warn('no more deals...');
            break;
        }
    }

}

