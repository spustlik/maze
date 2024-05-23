//v1.0 2024-05-24

export type MapType<K extends string | number | symbol, V> = {
    [X in K]: V;
};


export type NextRandom = (maxInclusive: number) => number;

export function dd(x: any) {
    return JSON.parse(JSON.stringify(x));
}

export function removeItem<T>(data: T[], item: T) {
    const i = data.indexOf(item);
    if (i >= 0) {
        data.splice(i, 1);
        return i;
        //delete data[i];
    }
    return null;
}
export function lastItem<T>(data: T[]) {
    //if (data.length > 0)
        return data[data.length - 1];
}
export function insertItem<T>(data: T[], index: number,...items: T[]) {
    data.splice(index, 0, ...items);
}

export function orderBy<T>(data:T[], selector: (item:T) => number) {
    const r = data.concat([]).sort((a, b) => {
        const sa = selector(a);
        const sb = selector(b);
        return sa == sb ? 0 : sa < sb ? -1 : 1;
    });
    return r;
}

export function max(...data: number[]) {
    return data.reduce((prev, cur) => cur > prev ? cur:prev, Number.MIN_SAFE_INTEGER);
}
export function min(...data: number[]) {
    return data.reduce((prev, cur) => cur < prev ? cur : prev, Number.MAX_SAFE_INTEGER);
}

export function toMap<T, TK>(data: T[], keySelector: (x: T) => TK) {
    const r = new Map<TK, T>();
    data.forEach(x => {
        r.set(keySelector(x), x);
    });
    return r;
}
export function delayAsync(duration: number = 0) {
    const p = new Promise(res => {
        window.setTimeout(() => {
            res(true);
        }, duration);
    });
    return p;
}

