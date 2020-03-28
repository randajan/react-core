import jet from "@randajan/jetpack";

import { deviceType, browserName, browserVersion, fullBrowserVersion, mobileVendor, mobileModel, engineName, engineVersion } from 'react-device-detect';

const DEFAULTSIZES = {
    xs: w=>w<=600,
    s: w=>w>600&&w<=960,
    m: w=>w>960&&w<=1280,
    l: w=>w>1280&&w<=1920,
    xl: w=>w>1920,

    gtXs: w=>w>600,
    gtS: w=>w>960,
    gtM: w=>w>1280,

    ltM: w=>w<=960,
    ltL: w=>w<=1280,
    ltXl: w=>w<=1920
}

const SIZESET = [];

class View {

    constructor(Core, sizes) {
        jet.obj.addProperty(this, {
            Core,
            id:SIZESET.push({})-1
        });

        jet.obj.addProperty(this, View.getDevice(), null, false, true);

        Object.defineProperties(this, {
            width:{get:_=>Math.max(document.documentElement.clientWidth, window.innerWidth)},
            height:{get:_=>Math.max(document.documentElement.clientHeight, window.innerHeight)},
            size:{get:_=>jet.obj.join(this.fetch(), " "), enumerable:true}
        })

        window.addEventListener("resize", this.actualize.bind(this));
        this.add(sizes||DEFAULTSIZES);
        this.actualize();
    }

    async actualize() {
        this.Core.setState(this);
    }

    add(size, check) {
        const sizes = SIZESET[this.id];
        check = jet.get("function", check);

        if (jet.is("mapable", size)) {jet.obj.map(size, (v,k)=>sizes[k] = v || check);}
        else if (jet.is("string", size)) {sizes[size] = check}
        else {return false;}

        this.actualize();
        return true;
    }

    is(size) {
        return this.size.includes(size);
    }

    fetch() {
        const sizes = SIZESET[this.id];
        const {width, height} = this;
        const result = [];
        jet.obj.map(sizes, (check, size)=>{if (check(width, height)) {result.push(size);}});
        return result;
    }

    static getDevice() {
        return jet.obj.map({ deviceType, browserName, browserVersion, fullBrowserVersion, mobileVendor, mobileModel, engineName, engineVersion }, _ => _ === "none" ? undefined : _);
    }

    static create(...args) {
        return new View(...args);
    }

}


export default View;