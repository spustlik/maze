import * as ex from 'excalibur';
import { createScene  as createSceneHome } from './sceneHome';

function acquireLog() {
    var original = console.log;
    var ele = document.getElementById('log');
    console.log = (s, ...args) => {
        original(s, ...args);
        if (args && args.length > 0) {
            s += ' ' + args.join(', ');
        }
        ele.innerText += s+'\n';
    }

}

const game = new ex.Engine({
    width: 1024,
    height: 600,
});

const home = createSceneHome(game);
game.addScene('root', home);

acquireLog();
game.start();

