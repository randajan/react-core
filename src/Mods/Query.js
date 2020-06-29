import qs from "query-string";

import jet from "@randajan/jetpack";
import Serf from "../Base/Serf";

const location = window.location;

class Query extends Serf {

    static parsePathname(pathname) {
        return jet.obj.get(jet.str.to(pathname).match(/[^?]*/), "0");
    }

    static toUri(obj, pathname) {
        pathname = Query.parsePathname(pathname) || location.pathname;
        const query = qs.stringify(jet.get("object", obj));
        return [pathname, query].joins("?")
    }

    static fromUri(str) {
        return qs.parse(jet.get("string", str, location.search), {parseNumbers: true, parseBooleans: true});
    }

    constructor(Core, path) {
        super(Core, path, Query.fromUri());

        this.fit(v=>{
            if (jet.is("string", v)) { return Query.fromUri(v); }
            return jet.get("object", v);
        });

    }

    toUri(pathname) { return Query.toUri(this.get(), pathname); }

    fromUri(str) { return Query.fromUri(str); }

    setFromUri(str) { return this.set(this.fromUri(str)); }

}


export default Query;