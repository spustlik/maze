import { NextRandomInt } from "../common/common";
import { PlayCard, cards, suites } from "./playCards";

export function GetDeckCards() {
    //52 cards (13*4)
    const result: PlayCard[] = [];
    suites.forEach(suite => {
        cards.forEach(card => {
            result.push(new PlayCard(suite, card));
        })
    });
    return result;
}

export function GetShuffledCards(nextRnd: NextRandomInt, cards: PlayCard[], count: number = 1) {
    const r: PlayCard[] = cards.concat([]);
    for (let c = 0; c < count; c++) {
        for (let i = 0; i < r.length; i++) {
            const a = nextRnd(r.length - 1);
            const b = nextRnd(r.length - 1);
            const swap = r[b];
            r[b] = r[a];
            r[a] = swap;
        }
    }
    console.log('shuffled #' + count, cards, r.map(x=>x.toString()));
    return r;
}