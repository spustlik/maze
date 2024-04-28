
export function sum<T>(data: T[], selector: (x: T)=> number){
    var r = 0;
    for (var i = 0; i < data.length; i++) {
        r += selector(data[i]);
    }
    return r;
}