import * as ex from 'excalibur';
import { loadResources } from '../extra/extra';
import { figuresData, figuresResources } from './figuresResource';
import { pt, ptround } from '../common/Point';
import { FiguresBoard } from './figuresBoard';
import { FigureColor, FigureColors, FigurePos, colorToStr } from './figures';
import { FigureActor } from "./figureActor";
import { FiguresRules } from './figuresRules';

enum FigureGameState {
    Start = 1,
    WaitForDice = 2,
    DiceCalled = 3, //waiting to select figure

    GameOver = 99,
    End = 99999,
}

interface FiguresSaveData {
    state: FigureGameState
    players: { color: FigureColor, positions: number[] }[];
}

class FiguresHomeScene extends ex.Scene {
    board: FiguresBoard
    statusLabel: ex.Label;
    rules = new FiguresRules();
    currentPlayerIndex = 0
    get currentPlayerColor(): FigureColor { return FigureColors[this.currentPlayerIndex]; }

    diceNumber: number = 6
    dice: ex.Actor
    diceLabel: ex.Label
    _state: FigureGameState = FigureGameState.Start
    gameLabel: ex.Label;
    onPreLoad(loader: ex.DefaultLoader) {
        super.onPreLoad(loader);
        loadResources(loader, figuresResources)
    }

    onInitialize(game: ex.Engine) {
        super.onInitialize(game);

        var home = this.actors.find(a => a.name == 'HOME');
        if (home)
            this.remove(home);
        this.board = new FiguresBoard(this);
        this.board.drawPlan();

        this.initSelectionPointer();
        this.initDice();
        this.initPlayers();
        this.initState();
    }
    update(game: ex.Engine, delta: number) {
        super.update(game, delta);
        this.updateDice();
        this.updateKeyboard();
        {
            //center label
            var measure = this.gameLabel.font.measureText(this.gameLabel.text);
            measure = measure.scale(this.gameLabel.font.scale);
            measure = measure.scale(this.gameLabel.scale);
            this.gameLabel.offset = ex.vec(-measure.width / 2, -measure.height / 2);
        }
    }
    updateKeyboard() {
        const game = this.engine;
        if (game.input.keyboard.wasPressed(ex.Keys.S)) {
            const s = this.save();
            window.localStorage.setItem('SAVE', s);
            console.log('saved');
            return;
        }
        if (game.input.keyboard.wasPressed(ex.Keys.L)) {
            const s = window.localStorage.getItem('SAVE');
            console.log('loading');
            this.load(s); //call to updateState
            return;
        }
        if (game.input.keyboard.wasPressed(ex.Keys.Minus)
            || game.input.keyboard.wasPressed(ex.Keys.NumSubtract)) {
            let first = this.rules.getColorFigures(this.currentPlayerColor)[0];
            //this can throw errors
            let np = this.rules.getNextPos(first.position, -1);
            if (!np)
                return;
            first.position = np;
            return
        }
        if (game.input.keyboard.wasPressed(ex.Keys.Equal) /* + */
            || game.input.keyboard.wasPressed(ex.Keys.NumAdd)) {
            let first = this.rules.getColorFigures(this.currentPlayerColor)[0];
            let np = this.rules.getNextPos(first.position, 1);
            if (!np)
                return;
            //let path = this.board.getPathTo
            first.position = np;
            return
        }
        const DICEKEYS = [ex.Keys.Key1, ex.Keys.Key2, ex.Keys.Key3, ex.Keys.Key4, ex.Keys.Key5, ex.Keys.Key6];
        for (let k of DICEKEYS) {
            if (game.input.keyboard.wasPressed(k)) {
                this.diceNumber = DICEKEYS.indexOf(k) + 1;
                return
            }
        }
        const PLAYERKEYS = [ex.Keys.Q, ex.Keys.W, ex.Keys.E, ex.Keys.R];
        for (let k of PLAYERKEYS) {
            if (game.input.keyboard.wasPressed(k)) {
                this.currentPlayerIndex = PLAYERKEYS.indexOf(k);
                this.updateState(FigureGameState.WaitForDice);
                return
            }
        }
    }
    initState() {
        this.gameLabel = new ex.Label({
            pos: ex.vec(this.engine.halfDrawWidth, this.engine.halfDrawHeight),
            font: figuresData.FontBig,
            text: 'START',
            //color:ex.Color.Blue 
        });
        this.add(this.gameLabel);

        this.statusLabel = new ex.Label({
            pos: ex.vec(20, this.engine.drawHeight - 100),
            font: figuresData.Font,
        });
        this.add(this.statusLabel);
        this.updateState(FigureGameState.Start);
    }
    updateState(state: FigureGameState) {
        this._state = state;
        console.log('updatestate', FigureGameState[this._state]);
        switch (this._state) {
            case FigureGameState.Start:
                this.gameLabel.graphics.opacity = 0;
                this.gameLabel.actions
                    .fade(1, 500)
                    .fade(0, 100)
                    //FAST for debug
                    //.fade(1, 1000)
                    //.delay(1000)
                    //.fade(0, 2000)
                    .callMethod(() => {
                        this.updateState(FigureGameState.WaitForDice);
                    })
                break;
            case FigureGameState.WaitForDice:
                {
                    let cs = colorToStr(this.currentPlayerColor);
                    this.setStatusLabel(`${cs} is on move\nwaiting for dice`);
                    this.rules
                        .getColorFigures(this.currentPlayerColor)
                        .filter(p => !p.position.isGoal)
                        .forEach(p => {
                            //p.actions.clearActions();
                            p.actions.blink(100, 100, 5);
                        });
                    this.diceLabel.actions
                        .fade(1, 700);
                    this.dice.actions
                        .scaleTo(ex.vec(1.5, 1.5), ex.vec(10, 10))
                        .scaleTo(ex.vec(1, 1), ex.vec(1, 1))
                        .callMethod(() => {
                        });
                    break;
                }
            case FigureGameState.DiceCalled:
                {
                    let cs = colorToStr(this.currentPlayerColor);
                    if (!this.rules.canUseDice(this.currentPlayerColor, this.diceNumber)) {
                        this.setStatusLabel(`${cs} move is not possible\nNext please...`);
                        this.statusLabel.actions
                            .delay(500)
                            .callMethod(() => {
                                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.rules.players.length;
                                this.updateState(FigureGameState.WaitForDice);
                            });
                        break;
                    }
                    this.setStatusLabel(`${cs} is on move\nPlease move some figure`);
                    break;
                }
            case FigureGameState.GameOver:
                this.gameLabel.text = 'Game over';
                this.gameLabel.graphics.opacity = 0;
                //this.gameLabel.scale = ex.vec(0, 0);
                this.gameLabel.actions
                    .fade(1, 1000)
                    //.scaleTo(ex.vec(1,1), ex.vec(1,1))
                    .delay(1000)
                    .fade(0, 2000)
                    .callMethod(() => {
                        this.updateState(FigureGameState.End);
                    })
                break;
        }
    }
    setStatusLabel(t: string) {
        this.statusLabel.text = t;
        this.statusLabel.color = figuresData.getExColor(this.currentPlayerColor);
        this.statusLabel.actions
            .clearActions();
        this.statusLabel.actions
            .blink(200, 200, 5);
    }
    initPlayers() {
        for (var p = 0; p < 4; p++) {
            const color = FigureColors[p];
            for (var i = 0; i < 4; i++) {
                let player = new FigureActor(color, i,
                    {
                        offset: ex.vec(-5, -17)
                    });
                player.graphics.use(figuresData.getFigure(color))
                this.add(player);
                this.rules.players.push(player);
            }
        }
    }

    initDice() {
        let spr = figuresData.getDiceNumber(6);
        let dice = new ex.Actor({
            name: 'dice',
            pos: ex.vec(this.engine.drawWidth - spr.width, this.engine.drawHeight - spr.height),
            scale: ex.vec(0, 0)
        });
        this.add(dice);
        this.dice = dice;
        dice.events.on('pointerdown', (evt) => {
            this.onDice_click();
        });
        this.diceLabel = new ex.Label({
            pos: dice.pos,
            offset: ex.vec(-20, -30),
            font: figuresData.getFont({ scale: ex.vec(4, 4) }),
            text: '?',
            opacity: 0
        });
        this.add(this.diceLabel);
    }
    updateDice() {
        let spr = figuresData.getDiceNumber(this.diceNumber);
        this.dice.graphics.use(spr);
    }
    onDice_click() {
        if (this._state != FigureGameState.WaitForDice)
            return;
        const SPEED = 100;
        this.diceLabel.actions
            .fade(0, 500);
        this.dice.actions
            .fade(0.5, SPEED)
            .fade(1.0, SPEED)
            .fade(0.5, SPEED)
            .fade(1.0, SPEED)
            .fade(0.5, SPEED)
            .fade(1.0, SPEED)
            .callMethod(() => {
                this.diceNumber = ex.randomIntInRange(1, 6);
                this.updateState(FigureGameState.DiceCalled);
            })
    }
    initSelectionPointer() {
        let lbl = new ex.Label({
            pos: ex.vec(this.engine.drawWidth - 150, 10),
            scale: ex.vec(2, 2),
        });
        this.add(lbl);

        let selection = new ex.Actor({
            pos: ex.vec(-1000, -1000),
            //anchor:ex.vec(0.5,0.5) 
            name: 'selection'
        });
        //selection.graphics.use(figuresData.selectionAnim);
        selection.graphics.use(figuresResources.PlanGlow.toSprite());
        this.add(selection);

        this.input.pointers.events.on('move', (evt) => {
            var pt = this.board.worldToTile(evt.worldPos);
            //console.log('move', pround(evt.worldPos), pt);
            lbl.text = `${pt} , ${ptround(evt.worldPos)}`;
            if (pt.x >= 0 && pt.x < 10 && pt.y >= 0 && pt.y < 10) {
                const pos = this.board.tileToWorld(pt);
                selection.pos = pos;
                selection.z = Math.max(pt.x, pt.y);
            } else {
                selection.pos = ex.vec(-1000, -1000);
            }
        });
    }

    load(json: string) {
        const data = JSON.parse(json) as FiguresSaveData;
        for (var pi = 0; pi < data.players.length; pi++) {
            let playerData = data.players[pi];
            var figs = this.rules.getColorFigures(playerData.color);
            for (var fi = 0; fi < figs.length; fi++) {
                figs[fi].position = new FigurePos(playerData.color, playerData.positions[fi]);
            }
        }
        this.updateState(data.state);
    }
    save() {
        const data: FiguresSaveData = {
            state: this._state,
            players: FigureColors.map(c => ({
                color: c,
                positions: this.rules.getColorFigures(c).map(fig => fig.position._position)
            }))
        };
        return JSON.stringify(data, null, 4);
    }


}

export function createFiguresHomeScene() {
    const scene = new FiguresHomeScene();
    return scene;
}
