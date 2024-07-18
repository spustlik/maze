import * as ex from 'excalibur';
import { loadResources } from '../extra/extra';
import { SandwormData, assets } from './resources';
import { Board, Flask } from './Flask';
import { FlaskActor } from './FlaskActor';

export class SandwormScene extends ex.Scene {
    static NAME = 'sandworm';
    board: Board
    async onInitialize(game: ex.Engine) {
        console.log('onInitialize-sandworm');
        super.onInitialize(game);
        var loader = new ex.DefaultLoader();
        loadResources(loader, assets);
        await game.start(loader);
        SandwormData.init();
    }
    onActivate() {
        this.initBoard();
        this.updateBoardVisual();
    }
    flaskActors: FlaskActor[] = [];
    initBoard() {
        const count = 4;
        const empty = 2;
        this.board = new Board(count);
        for (var i = 0; i < this.board.Count; i++) {
            const f = this.board.Flasks[i];
            if (i < this.board.Count - empty) {
                while (!f.IsFull)
                    f.Colors.push(i);
            }
            const fa = new FlaskActor(f);
            this.add(fa);
            this.flaskActors.push(fa);
        }
        const r = new ex.Random(1234);
        this.board.randomSwap(r);
    }
    updateBoardVisual() {
        for (let fa of this.flaskActors) {
            fa.updatePosition();
        }
    }
    findFlaskActor(f: Flask): FlaskActor {
        return this.flaskActors.find(x => x.flask == f);
    }
    selected: FlaskActor;
    async onFlaskClick(flask: Flask, ev: ex.Input.PointerEvent) {
        //console.log('flask click', flask.index);
        const fa = this.findFlaskActor(flask);
        if (!this.selected) {
            if (!flask.IsEmpty) {
                this.selected = fa;
                fa.animSelectionAsync({ select: true, anim: true });
            }
            return;
        }
        if (this.selected == fa) {
            //unselect
            this.selected = undefined;
            fa.animSelectionAsync({ select: false, anim: true });
            this.updateBoardVisual();
            return; 
        }
        if (!this.board.canPour(this.selected.flask, flask)) {
            fa.animNotPourAsync();
            return;
        }
        await fa.animSelectionAsync({ select: false, anim: false });
        await this.selected.animPourStartAsync(fa);
        this.board.doPour(this.selected.flask, flask);
        fa.updateVisual();
        await this.selected.animPourEndAsync();
        this.selected = undefined;
        //this.updateBoardVisual();
        this.board.dump();
    }
}

export function createSandwormScene() {
    return new SandwormScene();
}