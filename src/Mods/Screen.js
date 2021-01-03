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

        jet.obj.prop.add(this, { sizes:{} }, null, false, true);

        Object.defineProperties(this, {
            width:{get:_=>Math.max(document.documentElement.clientWidth, window.innerWidth)},
            height:{get:_=>Math.max(document.documentElement.clientHeight, window.innerHeight)}
        }, null, false, true)

        this.fit(this.fetchSize.bind(this))

        window.addEventListener("resize", _=>this.set());

        this.addSize(jet.map.merge(DEFAULTSIZES, sizes));
    }

    fetchSize() { return jet.map.of(this.sizes, check=>jet.bol.to(check, this.width, this.height)); }

    addSize(size, check) {
        const sizes = this.sizes;
        check = jet.fce.tap(check);

        if (jet.type.is.map(size)) {jet.map.it(size, (v,k)=>sizes[k] = v || check);}
        else if (jet.str.is(size)) {sizes[size] = check}
        else {return false;}

        return this.set(this.fetchSize());
    }

    isSize(size) { return this.get(size); }

}


export default Screen;