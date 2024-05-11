import * as ex from 'excalibur';
import { ICoordinates } from '../common/Point';
import { Maze, MazeCell } from '../Maze';
export enum IsoTileKind {
    WALL = 'WALL', ROAD = 'ROAD', CITY = 'CITY'
}

const TILEKIND = 'TILEKIND';
export class IsoHelper {
    constructor(private isoMap: ex.IsometricMap) {
    }

    setKind(pos: ICoordinates, kind: IsoTileKind) {
        var tile = this.isoMap.getTile(pos.x, pos.y);
        return this.setTileKind(tile, kind);
    }
    setTileKind(tile: ex.IsometricTile, kind: IsoTileKind) {
    //    for (var k in IsoTileKind) {
    //        tile.removeTag(k);
    //    }
    //    tile.addTag(kind);
        tile.data.set(TILEKIND, kind);
    }
    getKind(pos: ICoordinates) {
        var tile = this.isoMap.getTile(pos.x, pos.y);
        if (!tile)
            return;
        return this.getTileKind(tile);
    }
    getTileKind(tile: ex.IsometricTile) {
    //    for (var k in IsoTileKind) {
    //        if (tile.hasTag(k))
    //            return k;
        //    }
        return tile.data.get(TILEKIND) as IsoTileKind;
    }
    setTilesKind(maze: Maze) {
        for (let tile of this.isoMap.tiles) {
            var pos = { x: tile.x, y: tile.y }; // what is in tile.pos ?!?! pos Returns the top left corner of the [[IsometricTile]] in world space
            var c = maze.Get(pos);           
            if (c == MazeCell.WALL)
                this.setTileKind(tile, IsoTileKind.WALL);
            if (c == MazeCell.UNBREAKABLE)
                this.setTileKind(tile, IsoTileKind.CITY);
            if (c == MazeCell.VISITED)
                this.setTileKind(tile, IsoTileKind.ROAD);
        }
    }

}