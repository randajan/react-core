import { deviceType, browserName, browserVersion, fullBrowserVersion, mobileVendor, mobileModel, engineName, engineVersion } from 'react-device-detect';

import jet from "@randajan/jetpack";
import Serf from "../Helpers/Task";
import Core from "./Core";

const DEFAULTSIZES = {
    "xs": w=>w<=600,
    ">xs": w=>w>600,
    "<s": w=>w<=600,
    "s": w=>w>600&&w<=960,
    ">s": w=>w>960,
    "<m": w=>w<=960,
    "m": w=>w>960&&w<=1280,
    ">m": w=>w>1280,
    "<l": w=>w<=1280,
    "l": w=>w>1280&&w<=1920,
    ">l": w=>w>1920,
    "<xl": w=>w<=1920,
    "xl": w=>w>1920
}

class View extends Serf {

    constructor(Core, sizes) {
        super(Core, "View");

        jet.obj.addProperty(this, { sizes:{} }, null, false, true);

        Object.defineProperties(this, {
            width:{get:_=>Math.max(document.documentElement.clientWidth, window.innerWidth)},
            height:{get:_=>Math.max(document.documentElement.clientHeight, window.innerHeight)}
        }, null, false, true)

        this.addSize(jet.obj.merge(DEFAULTSIZES, sizes));
        
        this.fit(_=>{
            return {
                deviceType,
                browserName,
                browserVersion,
                fullBrowserVersion,
                mobileVendor,
                mobileModel,
                engineName,
                engineVersion,
                size: this.fetchSize()
            }
        })

        window.addEventListener("resize", _=>this.set());

        this.set();
    }

    fetchSize() { return jet.obj.map(this.sizes, check=>jet.to("boolean", check, this.width, this.height)); }

    addSize(size, check) {
        const sizes = this.sizes;
        check = jet.get("function", check);

        if (jet.is("mapable", size)) {jet.obj.map(size, (v,k)=>sizes[k] = v || check);}
        else if (jet.is("string", size)) {sizes[size] = check}
        else {return false;}

        return this.set();
    }

    isSize(size) { return this.get(size); }

    static use(...path) {
        return Core.use("View", ...path);
    }

}


export default View;