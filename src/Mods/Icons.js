import jet from "@randajan/react-jetpack";

import Serf from "../Helpers/Task";

import Core from "./Core";

class Icons extends Serf {

    constructor(core, path, files, size) {
        super(core, path);

        jet.obj.addProperty(this, {
            pending:{}
        }, null, false, true);

        this.fitType("svg", "object");
        this.fitType("size", "number", 24);
        this.fit("files", Core.fetchFiles);
        this.fit(v=>{
            v = jet.get("object", v);
            v.viewBox = `0 0 ${v.size} ${v.size}`;
            return v;
        });

        const svg = this.open("svg").linkLocal();

        this.set({
            svg,
            size,
            files,
        })
    }

    getId(src) { return [...this.path.split("."), src].joins("-"); }

    async load(src) {
        if (this.pending[src] || this.get(["svg", src])) { return; }
        const self = this.pending[src] = this.fetchStrap(src);
        const strap = await self;
        delete this.pending[src];
        this.set(["svg", src], strap);
    }

    async fetchStrap(src) {
        const path = this.get(["files", src]);
        if (path) { return await fetch(path).then(resp=>resp.text()).then(Icons.svgStrap) } //Core tray ? 
    }

    static svgStrap(svg) {
        return jet.get("string", svg).replace(/^[\S\s]*<svg [^>]*>/, "").replace(/<\/svg>[\S\s]*/, "");
    }

}

export default Icons;