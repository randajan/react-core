import qs from "query-string";

import jet from "@randajan/jetpack";
import Space from "../Helpers/Space";
import Core from "./Core";

class Query extends Space {
    constructor(onChange) {
        super(Query.parse(), onChange);
    }

    toUri(path) {
        const content = jet.obj.map({...this}, v=>jet.obj.toJSON(v)||v);
        return [jet.obj.get(jet.get("string", path).match(/[^?]*/), 0), qs.stringify(content)].joins("?");
    }

    static parse(path) {
        return qs.parse(jet.get("string", path, window.location.search), {parseNumbers: true, parseBooleans: true});
    }

    static create(...args) {
        return new Query(...args);
    }

    static use(...path) {
        return Core.use("Query", ...path);
    }
}


export default Query;