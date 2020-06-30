import jet from "@randajan/react-jetpack";

import Serf from "../Base/Serf";

import Core from "./Core";

class Icons extends Serf {

    constructor(core, path, files, size) {
        super(core, path);

        jet.obj.addProperty(this, {
            pending:{},
            straps:this.addTask("straps", _=>this.fetchAll(), "1y"),
        }, null, false, true);

        this.fitType("size", "number", 24);
        this.fit("files", Core.fetchFiles);
        this.fit(v=>{
            v = jet.get("object", v);
            v.viewBox = `0 0 ${v.size} ${v.size}`;
            return v;
        });

        this.set({
            straps:this.straps.linkLocal(),
            size,
            files,
        });

        this.straps.fetch();
    }

    getId(src) { return [...this.path.split("."), src].joins("-"); }

    async fetchAll() {
        const files = this.get("files");
        const straps = {};
        const prom = [];
        jet.obj.map(files, (v,k)=>{
            prom.push(Icons.fetchSvg(v).then(svg=>{straps[k] = Icons.svgStrap(svg);}))
        });
        await Promise.all(prom);
        return straps;
    }

    static svgStrap(svg) {
        return jet.get("string", svg).replace(/^[\S\s]*<svg [^>]*>/, "").replace(/<\/svg>[\S\s]*/, "");
    }

    static async fetchSvg(file) {
        return await fetch(file).then(resp=>resp.text())
    }

}

export default Icons;