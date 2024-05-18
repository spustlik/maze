import * as ex from 'excalibur';
import { loadResources } from '../extra/extra';
import { figuresData, figuresResources } from './figuresResource';
import { isSamePoint, pt, ptround } from '../common/Point';
import { FiguresBoard } from './figuresBoard';
import { FigureActor, FigureColor, FigureColors, FigurePos, colorToStr } from './figures';

enum FigureGameState {
    Start = 1,
    WaitForDice = 2,
    DiceCalled = 3,

    GameOver = 99,
    End = 99999,
}
class FiguresRules {
    players: FigureActor[] = []
    constructor() { }
    getColorPlayers(color: FigureColor) {
        return this.players.filter(p => p.position.color == color);
    }
    canUseDice(p: FigureActor, dice: number): boolean {
        return true;
    }

}

class FiguresHomeScene extends ex.Scene {
    board: FiguresBoard
    playerLabel: ex.Label;
    rules = new FiguresRules();
    currentPlayerIndex = 0
    get currentPlayer() { return this.rules.players[this.currentPlayerIndex]; }
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
        //this.drawPlan();

        this.initSelectionPointer();
        this.initDice();
        this.initPlayers();
        this.initState();
    }
    update(game: ex.Engine, delta: number) {
        super.update(game, delta);
        this.updateDice();
        {
            //center label
            var measure = this.gameLabel.font.measureText(this.gameLabel.text);
            measure = measure.scale(this.gameLabel.font.scale);
            measure = measure.scale(this.gameLabel.scale);
            this.gameLabel.offset = ex.vec(-measure.width / 2, -measure.height / 2);
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

        this.playerLabel = new ex.Label({
            pos: ex.vec(20, this.engine.drawHeight - 100),
            font: figuresData.Font,
        });
        this.add(this.playerLabel);
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
                    let cs = colorToStr(this.currentPlayer.position.color);
                    this.setPlayerLabel(`${cs} is on move\nwaiting for dice`);
                    this.rules
                        .getColorPlayers(this.currentPlayer.position.color)
                        .filter(p => !p.position.isGoal)
                        .forEach(p => {
                            p.actions.clearActions();
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
                    let cs = colorToStr(this.currentPlayer.position.color);
                    if (!this.rules.canUseDice(this.currentPlayer, this.diceNumber)) {
                        this.setPlayerLabel(`${cs} move is not possible\nNext please...`);
                        this.playerLabel.actions
                            .delay(500)
                            .callMethod(() => {
                                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.rules.players.length;
                                this.updateState(FigureGameState.WaitForDice);
                            });
                        break;
                    }
                    this.setPlayerLabel(`${cs} is on move\nPlease move some figure`);
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
    setPlayerLabel(t: string) {
        this.playerLabel.text = t;
        this.playerLabel.color = figuresData.getExColor(this.currentPlayer.position.color);
        this.playerLabel.actions
            .clearActions();
        this.playerLabel.actions
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
        /*
        dice.events.on('pointerenter', (evt) => {
            //dice.actions.blink(100,100,100);
            //dice.actions.fade(0.6,200);
        });
        dice.events.on('pointerleave', (evt) => {
            //dice.actions.getQueue().clearActions();
            //dice.actions.fade(1, 200);
        });
        */
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
    private initSelectionPointer() {
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
        selection.z = 99;
        this.add(selection);

        this.input.pointers.events.on('move', (evt) => {
            var pt = this.board.worldToTile(evt.worldPos);
            //console.log('move', pround(evt.worldPos), pt);
            lbl.text = `${pt} , ${ptround(evt.worldPos)}`;
            if (pt.x >= 0 && pt.x < 10 && pt.y >= 0 && pt.y < 10) {
                const pos = this.board.tileToWorld(pt);
                selection.pos = pos;
            } else {
                selection.pos = ex.vec(-1000, -1000);
            }
        });
    }
    private drawPlan() {
        var map = figuresResources.PlanMap.data.split('\n');
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {
                var p = this.board.tileToWorld(pt(x, y));
                var a = new ex.Actor({ pos: p });
                var cell = map[y][x].toUpperCase();
                if (cell == ' ' || cell == '\r')
                    continue;
                if (cell == 'X')
                    cell = 'x';
                a.graphics.use(figuresData.getPlanSprite(cell as any, 15));
                this.add(a);
            }
        }
    }
}

export function createFiguresHomeScene() {
    const scene = new FiguresHomeScene();
    return scene;
}
