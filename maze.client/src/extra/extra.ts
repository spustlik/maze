import * as ex from 'excalibur';

export function loadResources(loader: ex.DefaultLoader, resObj:any) {
    for (var r in resObj) {
        //console.log('loading', r);
        loader.addResource(resObj[r]);
    }
}