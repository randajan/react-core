import qs from "query-string";

import jet from "@randajan/jetpack";
import Space from "../Helpers/Space";
import Core from "./Core";

const { location, history } = window;

class Query extends Space {
    constructor(onChange) {
        let silent;
        super(qs.parse(location.search), [_=>this.toLocation(silent), onChange]);
        window.onpopstate = ev=>{silent = true; this.fromLocation(); silent = false;}
    }

    toUri(path) {
        const content = jet.obj.map({...this}, v=>jet.obj.toJSON(v)||v);
        return [jet.obj.get(jet.get("string", path).match(/[^?]*/), "0"), qs.stringify(content)].joins("?");
    }

    fromLocation() {
        this.set(qs.parse(location.search));
    }

    toLocation(silent) {
        history[(silent?"replace":"push")+"State"](history.state, document.title, this.toUri(location.pathname));
    }

    static create(...args) {
        return new Query(...args);
    }

    static use(...path) {
        return Core.use("Query", ...path);
    }
}


export default Query;