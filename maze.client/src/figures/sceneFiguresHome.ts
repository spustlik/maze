import * as ex from 'excalibur';
import { loadResources } from '../extra/extra';
import { figuresData, figuresResources } from './figuresResource';
export class FiguresHomeScene extends ex.Scene {
    onPreLoad(loader: ex.DefaultLoader) {
        super.onPreLoad(loader);
        loadResources(loader, figuresResources)
    }

    onInitialize(game: ex.Engine) {
        super.onInitialize(game);


        var home = this.actors.find(a => a.name == 'HOME');
        if (home)
            this.remove(home);
        var map = figuresResources.PlanMap.data.split('\n');
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {
                var p = this.tileToWorld(x, y);
                var a = new ex.Actor({ pos: p });
                var cell = map[y][x].toUpperCase();
                if (cell == ' ' || cell=='\r')
                    continue;
                if (cell == 'X')
                    cell = 'x';
                a.graphics.use(figuresData.getPlanSprite(cell as any, 15));
                this.add(a);
            }
        }
    }
    tileToWorld(x: number, y: number) {
        var wx = this.engine.halfDrawWidth;
        var wy = 20;
        const DX = 51;
        const DY = 31;
        return ex.vec(wx + x * DX - y * DX, wy + y * DY + x*DY);
    }
}

export function createFiguresHomeScene() {
    const scene = new FiguresHomeScene();
    return scene;
}
