import qs from "query-string";
import jet from "@randajan/jetpack";

const LOCATION = window.location;
const HISTORY = window.history;
const PARSE = qs.parse(LOCATION.search);

class Query {
    get(key) {return key ? PARSE[key] : jet.copy(PARSE);}

    set(key, val) {
        const from = this.get(key);
        if (val === undefined) {delete PARSE[key];} else {PARSE[key] = val;}
        if (from === val) { return }
        const str = this.toString();
        HISTORY.replaceState({}, document.title, LOCATION.pathname+(str?"?":"")+str);
    }

    rem(key) {return this.set(key);}

    pull(key) {
        const from = this.get(key);
        this.rem(key);
        return from;
    }

    toString(json) {
        return json ? JSON.stringify(PARSE) : qs.stringify(PARSE);
    }

    static create(...args) {
        return new Query(...args);
    }
}

export default Query;