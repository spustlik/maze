import * as ex from 'excalibur';
import { ICoordinates } from '../common/Point';
export enum IsoTileKind {
    WALL = 'WALL', ROAD = 'ROAD', CITY = 'CITY'
}
export class IsoHelper {
    constructor(private isoMap: ex.IsometricMap) {
    }

    setKind(pos: ICoordinates, kind: IsoTileKind) {
        var tile = this.isoMap.getTile(pos.x, pos.y);
        return this.setTileKind(tile, kind);
    }
    setTileKind(tile: ex.IsometricTile, kind: IsoTileKind) {
        for (var k in IsoTileKind) {
            tile.removeTag(k);
        }
        tile.addTag(kind);
    }
    getKind(pos: ICoordinates) {
        var tile = this.isoMap.getTile(pos.x, pos.y);
        if (!tile)
            return;
        return this.getTileKind(tile);
    }
    getTileKind(tile: ex.IsometricTile) {
        for (var k in IsoTileKind) {
            if (tile.hasTag(k))
                return k;
        }
    }
}