import qs from "query-string";

import jet from "@randajan/jetpack";
import Space from "../Helpers/Space";
import Core from "./Core";

const { location, history } = window;

class Query extends Space {
    constructor(onChange) {
        super(Query.parse(), [_=>this.toLocation(), onChange]);
        window.onpopstate = this.fromLocation.bind(this);
    }

    toUri(path) {
        const content = jet.obj.map({...this}, v=>jet.obj.toJSON(v)||v);
        return [jet.obj.get(jet.get("string", path).match(/[^?]*/), 0), qs.stringify(content)].joins("?");
    }

    fromLocation() {
        this.set("", Query.parse(), true);
    }

    toLocation() {
        if (jet.isEmpty(jet.obj.compare(Query.parse(), this))) { return false; }
        history.pushState(history.state, document.title, this.toUri(location.pathname));
        return true;
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