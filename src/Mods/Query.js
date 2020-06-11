import qs from "query-string";

import jet from "@randajan/jetpack";
import Space from "../Helpers/Space";
import Core from "./Core";

const location = window.location;

class Query extends Space {
    constructor(onChange) {
        super(Query.parse(), onChange);
    }

    toUri(path) {
        const content = jet.obj.map({...this}, v=>jet.obj.toJSON(v)||v);
        return [jet.obj.get(jet.get("string", path, location.pathname).match(/[^?]*/), 0), qs.stringify(content)].joins("?");
    }

    fromUri(path) {
        this.set("", Query.parse(path), true);
    }

    static parse(path) {
        return qs.parse(jet.get("string", path, location.search), {parseNumbers: true, parseBooleans: true});
    }

    static create(...args) {
        return new Query(...args);
    }

    static use(...path) {
        return Core.use("Query", ...path);
    }
}


export default Query;