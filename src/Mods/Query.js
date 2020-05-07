import qs from "query-string";

import jet from "@randajan/jetpack";
import Space from "../Helpers/Space";
import Core from "./Core";

const { location, history } = window;
const PRIVATE = [];

class Query extends Space {
    constructor(onChange) {
        super(qs.parse(location.search), jet.isEmpty(PRIVATE) ? _=>this.toLocation() : undefined);
        PRIVATE.push(this)-1;
        this.onChange.add(onChange);
    }

    toUri(path) {
        const content = jet.obj.map({...this}, v=>jet.obj.toJSON(v)||v);
        return jet.obj.join([jet.obj.get(jet.get("string", path).match(/[^?]*/), "0"), qs.stringify(content)], "?");
    }

    toLocation() {
        history.replaceState(history.state, document.title, this.toUri(location.pathname));
    }

    static create(...args) {
        return new Query(...args);
    }

    static use(...mods) {
        return Core.use("Query", ...mods).Query;
    }
}


export default Query;