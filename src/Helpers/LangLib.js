import jet from "@randajan/jetpack";

import Lang from "../Mods/Lang";

class LangLib {
    constructor(priority, path, list, fetch) {
        priority = jet.num.tap(priority);
        path = jet.str.to(path);
        fetch = jet.fce.tap(fetch);

        list = Lang.validateList(list);
        jet.obj.prop.add(this, { priority, path, list }, null, false, true)
        jet.obj.prop.add(this, "fetch", async lang => {
            if (!list.includes(lang)) {return}
            const data = await fetch(lang);
            return path ? jet.map.put({}, path, data, true) : jet.obj.only(data);
        })
    }

    static create(priority, path, list, fetch) {
        if (jet.type.is(LangLib, priority)) { return priority; }
        return new LangLib(priority, path, list, fetch);
    }
}

export default LangLib;