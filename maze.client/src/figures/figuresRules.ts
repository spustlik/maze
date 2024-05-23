import { FigureColor, FigureColors, FigurePos } from './figures';
import { FigureActor } from "./figureActor";

export type FigureMove = {
    target: 'START' | 'PLAN' | 'GOAL'
    current: FigurePos
    newPosition: FigurePos
    enemy?: FigureActor
}

export class FiguresRules {
    players: FigureActor[] = [];
    constructor() { }
    getColorFigures(c: FigureColor) {
        return this.players.filter(p => p.position.color == c);
    }
    canUseDice(c: FigureColor, dice: number): boolean {
        return this.getColorFigures(c)
            .map(pl => this.canPlayerUseDice(pl, dice))
            .filter(n => n)
            .length > 0;
    }
    private canPlayerUseDice(p: FigureActor, dice: number): boolean {
        let next = this.getNext(p.position, dice);
        return !!next;
    }
    public getPlayerNextMoves(c: FigureColor, ofs: number): FigureMove[] {
        let player = this.getColorFigures(c);
        return player.map(p => this.getNext(p.position, ofs));
    }
    private getNext(p: FigurePos, ofs: number): FigureMove {
        const myPlayers = this.getColorFigures(p.color);
        const nextPos = this.getNextPos(p, ofs);
        if (!nextPos)
            return null;
        let targetPlayer = this.players.find(p => p.position.equals(nextPos));
        let targetMe = targetPlayer?.position.color == p.color;
        let enemy = targetMe ? null : targetPlayer;
        if (ofs == 6
            && !targetMe
            && myPlayers.find(p => p.position.isHome)) {
            //6 and somebody in home, and not ME on the start
            return { current: p, target: 'START', newPosition: nextPos, enemy };
        }
        if (nextPos.isPlan && !targetMe) {
            return { current: p, target: 'PLAN', newPosition: nextPos, enemy };
        }
        if (nextPos.isGoal && !targetMe) {
            return { current: p, target: 'GOAL', newPosition: nextPos, enemy };
        }
        console.log('Impossible move', p, nextPos, targetPlayer.position);
        //! 6 can mean that player wants to roll again
        // can some figure go to new position ?
        // is there goal, or another player ? is it me or enemy?
        return null;
    }
    public getNextPos(p: FigurePos, ofs: number): FigurePos {
        if (p.isHome && ofs == 6) {
            //move from home to plan
            let pos = new FigurePos(p.color);
            pos.plan = 0;
            return pos;
        }
        //??? we need path of move ?!?
        if (p.isPlan) {
            if (p.plan + ofs >= FigurePos.endOfPlan) {
                //move from plan to goal
                let pos = new FigurePos(p.color);
                pos.goal = p.plan + ofs - FigurePos.endOfPlan;
                return pos;
            }
            //move inplan
            let pos = new FigurePos(p.color);
            pos.plan = p.plan + ofs;
            return pos;
        }
        if (p.isGoal && p.goal + ofs < 4) {
            //move in goal
            let pos = new FigurePos(p.color);
            pos.goal = p.goal + ofs;
            return pos;
        }
        //console.error('Cannot get next position', p, ofs);
    }
    getEmptyHome(c: FigureColor): FigurePos {
        let myHome = this.getColorFigures(c).filter(f => f.position.isHome);
        for (let i = 0; i < 4; i++) {
            let found = myHome.find(f => f.position.home == i);
            if (!found) {
                let p = new FigurePos(c);
                p.home = i;
                return p;
            }
        }
    }
    getWinner() {
        for (let c of FigureColors) {
            if (this.getColorFigures(c).every(a => a.position.isGoal))
                return c;
        }
    }
}
