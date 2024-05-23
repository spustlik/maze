//v1.0 2024-05-23
import * as ex from 'excalibur';
export class StringSource implements ex.Loadable<string> {
    data: string;
    constructor(public url) {
    }
    async load(): Promise<string> {
        var response = await fetch(this.url);
        if (!response.ok)
            return null;
        var r = await response.text();
        this.data = r;
        return r;
    }
    isLoaded(): boolean {
        return !!this.data;
    }

}