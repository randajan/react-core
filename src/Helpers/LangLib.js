import jet from "@randajan/jetpack";

import Lang from "../Mods/Lang";

class LangLib {
    constructor(priority, path, list, fetch) {
        [priority, path, fetch] = jet.get([["number", priority], ["string", path], ["function", fetch]]);
        list = Lang.validateList(list);
        jet.obj.addProperty(this, { priority, path, list }, null, false, true)
        jet.obj.addProperty(this, "fetch", async lang => {
            if (!list.includes(lang)) {return}
            const data = await fetch(lang);
            return path ? jet.obj.set({}, path, data, true) : jet.filter("object", data);
        })
    }

    static create(priority, path, list, fetch) {
        if (jet.is(LangLib, priority)) { return priority; }
        return new LangLib(...jet.untie({ priority, path, list, fetch }));
    }
}

export default LangLib;