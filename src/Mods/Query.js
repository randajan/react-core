import qs from "query-string";

import jet from "@randajan/jetpack";
import Serf from "../Helpers/Task";

const location = window.location;

class Query extends Serf {

    static toUri(obj) {
        const str = qs.stringify(jet.get("object", obj));
        return str ? "?"+str : "";
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

    toUri(obj) { return Query.toUri(obj || this.get()); }

    fromUri(str) { return Query.fromUri(str); }

    setFromUri(str) { return this.set(this.fromUri(str)); }

}


export default Query;