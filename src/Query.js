import qs from "query-string";
import jet from "@randajan/jetpack";

const LOCATION = window.location;
const HISTORY = window.history;
let PARSE = qs.parse(LOCATION.search);

class Query {
    constructor(onChange) {
        jet.obj.addProperty(this, "onChange", new Set([onChange]), false, true);
    }

    get(key) {return key ? PARSE[key] : jet.copy(PARSE);}

    set(key, val) {
        const from = this.get(key);
        if (val == null) {delete PARSE[key];} else {PARSE[key] = val;}
        this.actualize();
        if (key != null && from !== val) { jet.run(this.onChange, this); }
    }

    rem(key) {return this.set(key);}

    pull(key) {
        const from = this.get(key);
        this.rem(key);
        return from;
    }

    actualize() {
        const str = this.toString();
        HISTORY.replaceState(HISTORY.state, document.title, LOCATION.pathname+(str?"?":"")+str);
    }

    toString(json) {
        return json ? jet.obj.toJSON(PARSE) : qs.stringify(PARSE);
    }

    static create(...args) {
        return new Query(...args);
    }
}

export default Query;