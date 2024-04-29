
export function sum<T>(data: T[], selector: (x: T)=> number){
    var r = 0;
    for (var i = 0; i < data.length; i++) {
        r += selector(data[i]);
    }
    return r;
}

export function replaceAll(s: string, find: string, replace: string) {
    return s.replace(new RegExp(find, 'g'), replace);
}