import * as ex from 'excalibur';
import { StringSource } from '../extra/StringSource';
import { replaceAll } from '../common/utils';
import { MobType } from './BatmanMobActor';
export const batmanResources = new class BatmanResources {
    Roads = new ex.ImageSource("src/assets/roads.png")
    Batman = new ex.ImageSource("src/assets/batman.png")
    BatmanMobs = new ex.ImageSource("src/assets/batman-mobs.png")
    MazeTest = new StringSource("src/assets/mazeTest.txt")
    Maze1 = new StringSource("src/assets/maze1.txt")
    MazeTest2 = new StringSource("src/assets/mazeTest2.txt")

}
/*
ISOMETRIC VIEW
            [y,x] /\   [0,0]
                 /  \
                /    \
      (0,1)  [0,3]    [3,0] (1, 0)

*/
export const batmanData = new class BatmanData {
    Roads_Sheet = ex.SpriteSheet.fromImageSource({
        image: batmanResources.Roads,
        grid: { columns: 1, rows: 29, spriteWidth: 100, spriteHeight: 65 }
    });
    Batman_Sheet = ex.SpriteSheet.fromImageSource({
        image: batmanResources.Batman,
        grid: { columns: 1, rows: 8, spriteWidth: 24, spriteHeight: 32 }
    });
    Mobs_Sheet = ex.SpriteSheet.fromImageSource({
        image: batmanResources.BatmanMobs,
        grid: { columns: 1, rows: 22, spriteWidth: 24, spriteHeight: 32 }
    });

    getMobAnimations(mobtype: MobType): ex.Animation[] {
        var get =
            (frames: number[], delay: number = 200) =>
                ex.Animation.fromSpriteSheet(this.Mobs_Sheet, frames, delay, ex.AnimationStrategy.Loop);
        switch (mobtype) {
            case MobType.Dogman: return [get([1, 2]), get([4, 5])];
            case MobType.ChinaHead: return [get([6]), get([7])];
            case MobType.Armchair: return [get([8, 9]), get([10, 11])];
            case MobType.Dog: return [get([12, 13]), get([14, 15])];
            case MobType.Man: return [get([16]), get([17, 18])];
            case MobType.PirateHead: return [get([19]), get([20])];
            default: throw new Error(`Unknown mob type ${mobtype}`);
        }

    }

    getTileSprite(s: string) {
        //     [3]
        // [1] [0] [2]
        //     [4]

        //buildings/UNBREAKABLE
        //if (s.startsWith("2"))
        //    return this.Roads_Sheet.getSprite(0, 13);

        ///WARNING !!!
        s = replaceAll(s, "2", "1");

        if (s.startsWith("0"))
            return this.Roads_Sheet.getSprite(0, 13);
        s = s.substring(1);
        var map = {
            //zatacky
            "0101": 28,
            "1010": 25,
            "0110": 23,
            "1001": 27,
            //odbocky
            "0111": 1,
            "1110": 2,
            "1101": 4,
            "1011": 3,
            //rovne
            "1100": 26,
            "0011": 24,
            //krizovatka
            "1111": 0,
            //slepka
            "1000": 6,
            "0100": 7,
            "0010": 5,
            "0001": 8,
            //samostatna
            "0000": 22
        }
        if (map[s] != undefined)
            return this.Roads_Sheet.getSprite(0, map[s]);
        console.log('missing', s, map[s], map);
        return this.Roads_Sheet.getSprite(0, 13);
    }
}
