import * as ex from 'excalibur';
import { MapType } from '../common/common';
import flacon from '../assets/sandworm/flacon_sheet.png';

const all_assets = {
    flacon,
}
type AssetType = typeof all_assets;
type AssetKey = keyof AssetType;

export const assets = {} as MapType<AssetKey, ex.ImageSource>;
for (const r in all_assets) {
    assets[r] = new ex.ImageSource(all_assets[r]);
}

function sheet(image: ex.ImageSource, columns: number, rows: number) {
    // remarks: sheet spriteWidth and spriteHeight can be computed from image only if it is loaded
    // constructor is too early...
    return ex.SpriteSheet.fromImageSource(
        {
            image,
            grid: { columns, rows, spriteWidth: image.width / columns, spriteHeight: image.height / rows },
        });
}

export class SandwormData {
    static init() {
        resources = new SandwormData();
    }
    //W = 100, H = 300, Columns = 5, Rows = 1, Count = 5
    private flacon_sheet = sheet(assets.flacon, 5, 1)
    getFlaconState(state: number, color: ex.Color) {
        return this.flacon_sheet.getSprite(state, 0, { width: 50, height: 150, tint: color });
    }
    flacon = this.getFlaconState(4, ex.Color.Transparent);
    getSandColor(c: number): ex.Color {
        function col(c: number): ex.Color {
            return ex.Color.fromRGB((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF);
        }
        const COLS: ex.Color[] = [
            //R,G,B,C,M,Y
            0xFF0000, 0x00bf00, 0x0000FF, 0x00FFFF, 0xFF00FF, 0xeeee00,
            //Purple,dodgerBlue
            0x8000FF, 0x0080FF,
            //orange
            0xffa51d,
            //Pink
            0xff59a1,
            0x00FF80,
            0xffff90,
        ].map(s => col(s));
        return COLS[c];
    }
}

export let resources: SandwormData