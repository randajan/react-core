import jet from "@randajan/jetpack";
import Serf from "../Base/Serf";


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

class Screen extends Serf {

    constructor(Core, path, sizes) {
        super(Core, path);

        jet.obj.addProperty(this, { sizes:{} }, null, false, true);

        Object.defineProperties(this, {
            width:{get:_=>Math.max(document.documentElement.clientWidth, window.innerWidth)},
            height:{get:_=>Math.max(document.documentElement.clientHeight, window.innerHeight)}
        }, null, false, true)

        this.fit(this.fetchSize.bind(this))

        window.addEventListener("resize", _=>this.set());

        this.addSize(jet.obj.merge(DEFAULTSIZES, sizes));
    }

    fetchSize() { return jet.obj.map(this.sizes, check=>jet.to("boolean", check, this.width, this.height)); }

    addSize(size, check) {
        const sizes = this.sizes;
        check = jet.get("function", check);

        if (jet.is("mapable", size)) {jet.obj.map(size, (v,k)=>sizes[k] = v || check);}
        else if (jet.is("string", size)) {sizes[size] = check}
        else {return false;}

        return this.set(this.fetchSize());
    }

    isSize(size) { return this.get(size); }

}


export default Screen;