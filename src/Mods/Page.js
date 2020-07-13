import qs from "query-string";

import jet from "@randajan/jetpack";
import Serf from "../Base/Serf";

class Page extends Serf {

    static parseSearch(search) {
        if (jet.is("object", search)) { return search; }
        return qs.parse(jet.str.to(search), {parseNumbers: true, parseBooleans: true});
    }

    static parseHash(hash) {
        hash = jet.str.to(hash);
        return hash.startsWith("#") ? hash.slice(1) : hash;
    }

    static buildSearch(search) {
        if (jet.is("object", search)) { return qs.stringify(search); }
        return jet.str.to(search);
    }

    constructor(Core, path) {
        super(Core, path);

        const loc = window.location;

        this.fitType("", "object");

        this.fit("search", Page.parseSearch);
        this.fit("hash", Page.parseHash);

        this.fit(v=>{
            v.protocol = loc.protocol;
            v.hostname = loc.hostname;
            v.port = loc.port;
            v.origin = loc.origin;
            const search = Page.buildSearch(v.search);
            v.path = v.pathname + (search ? "?"+search : "") + (v.hash ? "#"+v.hash : "");
            v.url = v.origin + v.path;
            return v;
        });

    }

}


export default Page;