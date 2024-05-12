export type PlayCardSuite = 's' | 'd' | 'c' | 'h';
export type PlayCardSpecial = null | 'x' | 'b'; //empty slot, back of card
export type PlayCardNumber = 'a' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'j' | 'q' | 'k';

export const suites = 's,d,c,h'.split(',') as PlayCardSuite[];
export const cards = 'a,2,3,4,5,6,7,8,9,10,j,q,k'.split(',') as PlayCardNumber[];
export interface PlayCardLike {
    suite: PlayCardSuite
    card: PlayCardNumber
    special: PlayCardSpecial
}
let _idcounter = 1;
export class PlayCard implements PlayCardLike {
    public static Empty = () => new PlayCard(undefined as any as PlayCardSuite, undefined as any as PlayCardNumber, 'x');

    public id: number
    constructor(
        public suite: PlayCardSuite = 's',
        public card: PlayCardNumber = 'a',
        public special: PlayCardSpecial = null) {
        this.id = (_idcounter++);
    }
    public toString() {
        return ctos(this, true);
    }
    public isSame(c: PlayCard) {
        return c.suite == this.suite && c.card == this.card;
    }
}

export function getPreviousCard(c: PlayCard): PlayCardNumber | undefined {
    return cards[cards.indexOf(c.card) - 1];
}
export function getNextCard(c: PlayCard): PlayCardNumber | undefined {
    const i = cards.indexOf(c.card);
    if (i >= 0)
        return cards[i + 1]; // K-> undefined
}
export function isRedCard(suite: PlayCardSuite) {
    return suite == 'h' || suite == 'd';
}

export function suiteStr(s: PlayCardSuite) {
    const map = {
        s: '♠', d: '♦', c: '♣', h: '♥'
    }
    return map[s];
}
export function ctos(c: PlayCard, showFlipped: boolean = false) {
    if (c.special == "x")
        return "*";
    let s = `${c.card.toUpperCase()}${suiteStr(c.suite)}`
    if (c.special == "b" && showFlipped)
        return "!" + s;
    return s;
}