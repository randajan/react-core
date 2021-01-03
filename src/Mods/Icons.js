import jet from "@randajan/react-jetpack";

import Serf from "../Base/Serf";

import Core from "./Core";

class Icons extends Serf {

    static svgStrap(svg) {
        return jet.str.tap(svg).replace(/^[\S\s]*<svg [^>]*>/, "").replace(/<\/svg>[\S\s]*/, "");
    }

    static async fetchSvg(file) {
        return await fetch(file).then(resp=>resp.text())
    }

    static async fetchAll(files) {
        const straps = {};
        const prom = [];
        jet.map.it(files, (v,k)=>{
            prom.push(Icons.fetchSvg(v).then(svg=>straps[k] = Icons.svgStrap(svg)))
        });
        await Promise.all(prom);
        return straps;
    }

    constructor(core, path, files, size) {
        super(core, path);

        files = Core.fetchFiles(files);
        this.lock("files", files);

        this.fitType("size", "num", 24);
        this.fit(next=>{
            const v = jet.obj.tap(next());
            v.viewBox = `0 0 ${v.size} ${v.size}`;
            return v;
        });

        jet.obj.prop.add(this, "build", core.tray.watch(
            async _=>{
                const straps = await this.storeLocal("straps").version(core.version).pull() || await Icons.fetchAll(files);

                this.set({
                    size,
                    files,
                    straps
                });
            },
            g=>core.lang.spell(["core.icons.watch", g.state])
        ));

    }

    getId(src) { return jet.map.melt([...this.path.split("."), src], "-"); }

}

export default Icons;