import qs from "query-string";

import jet from "@randajan/jetpack";
import Serf from "../Base/Serf";

class Page extends Serf {

    static parseSearch(search) {
        if (jet.obj.is(search)) { return search; }
        return qs.parse(jet.str.to(search), {parseNumbers: true, parseBooleans: true});
    }

    static parseHash(hash) {
        hash = jet.str.to(hash);
        return hash.startsWith("#") ? hash.slice(1) : hash;
    }

    static buildSearch(search) {
        if (jet.obj.is(search)) { return qs.stringify(search); }
        return jet.str.to(search);
    }

    constructor(core, path) {
        super(core, path);

        const loc = window.location;

        this.fit((next, v)=>{
            v = jet.obj.tap(v);
            v.protocol = loc.protocol;
            v.hostname = loc.hostname;
            v.port = loc.port;
            v.origin = loc.origin;
            v.search = Page.parseSearch(v.search);
            v.hash = Page.parseHash(v.hash);
            v = next(v);
            const search = Page.buildSearch(v.search);
            v.path = v.pathname + (search ? "?"+search : "") + (v.hash ? "#"+v.hash : "");
            v.url = v.origin + v.path;
            return v;
        });

        this.eye("pathname", v=>core.analytics.page(v));

    }

}


export default Page;