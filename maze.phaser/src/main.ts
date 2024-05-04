import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Events, Game, Scenes, Types } from "phaser";

function acquireLog() {
    var ele = document.getElementById('log');
    {
        var original = console.log;
        console.log = (s, ...args) => {
            original(s, ...args);
            if (args && args.length > 0) {
                s += ' ' + args.join(', ');
            }
            var line = document.createElement("div");
            line.innerText = s;
            ele?.append(line);
        };
    }
    {
        var origErr = console.error;
        console.error = (s, ...args) => {
            origErr(s, ...args);
            if (args && args.length > 0) {
                s += ' ' + args.join(', ');
            }
            var line = document.createElement("div");
            line.style.color = 'red';
            line.style.fontWeight = 'bold';
            line.innerText = s;
            ele?.append(line);
        };
    }
}

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
    //    MainGame,
    //    GameOver
    ]
};

acquireLog();
console.log('starting');
console.log('%c Test','background:#ff0000');

var game = new Game(config);
//game.events.on(EventEmitter, () => {
//    var current = game.scene.mana find(a => game.scene.isActive(a));
//    console.log('current scene', current);
//    window.location.hash = '#' + current;
//});
export default game;
