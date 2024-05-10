import * as ex from 'excalibur';
import { createScene  as createSceneHome } from './sceneHome';

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
            ele.append(line);
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
            ele.append(line);
        };
    }
}

const game = new ex.Engine({
    width: 1024,
    height: 600,
});

const home = createSceneHome(game);
game.addScene('root', home);

//game.debug.entity.showAll = true;
//game.debug.graphics.showAll = true;
//game.showDebug(true);
//game.debug.useTestClock

acquireLog();
game.start();

