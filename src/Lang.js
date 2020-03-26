import moment from 'moment';
import jet from "@randajan/jetpack";

const BASELANGS = ["en", "cs"];

class Lang {

    constructor(Core, def, libs) {
        jet.obj.addProperty(this, {Core});
        libs = jet.get("mapable", libs, ["en"]);

        const isArray = jet.is("array", libs);
        let fallback;

        jet.obj.map(libs, (v,k)=>{
            if (isArray) {k = v; v = null;}
            if (!fallback) {fallback = k;}
            jet.obj.addProperty(this, Lang.fromString(k), jet.obj.merge(Lang.getBase(k), v), true, true);
            jet.obj.addProperty(this.set, k, _=>this.set(k));
        });

        jet.obj.addProperty(this, "def", this.validate(def) || fallback);
        this.select(Core.Query.pull("lang"), Core.Auth.User.loadLang());
        Core.onChange.add(changes=>changes.user != null ? this.select(Core.Auth.User.loadLang()) : null);
    }

    set(path, val, lang) {
        const vlang = this.validate(lang);
        if (lang && !vlang) {return false;}

        lang = vlang || def;

        const from = path ? jet.obj.get(this[lang], path) : this[lang];
        const to = jet.isMapable(val) ? jet.obj.merge(from, val) : val;

        if (!path) {jet.obj.addProperty(this, lang, to, true, true);}
        else {jet.obj.set(this[lang], path, to, true);}

        return true;
    }

    get(path, ...langs) {
        if (!path) {return this.now;}
        const { now, def } = this;
        let result;
        this.validate([langs, now, def], true).map(lang=>{
            result = result || jet.obj.get(this[lang], path);
        });
        return result || (path.split(".").map(v=>v.capitalize()).join(""));
    }

    select(...langs) {
        const { now, def } = this;
        jet.obj.addProperty(this, "now", this.validate([langs, now, def]), true);
        if (this.now === now) {return false ;}

        moment.locale(this.now);
        this.Core.setState({lang:this.now});
        return true;
    }

    validate(langs, all) {
        let result = new Set();
        jet.obj.map(jet.obj.toArray(langs), lang=>{const l = Lang.fromString(lang); if (this[l]) {result.add(l);}}, true);
        result = Array.from(result);
        return all ? result : result[0];
    }

    getMenu() {
        return this.list.map(v=>{
            const path = "lang."+v;
            const now = this.get(path);
            const native = this.get(path, v);
            const label = (now && now !== native) ? now+" ("+native+")" : native;
            return v !== this.now ? [label, this.select[v]] : undefined;
        });
    }

    toString(path) {
        return this.get(path);
    }

    static create(...args) {return new Lang(...args); }

    static fromString(lang) {return jet.get("string", lang).substr(0, 2).toLowerCase();}

    static getBase(lang) {
        lang = Lang.fromString(lang);
        return BASELANGS.includes(lang) ? require("./lang/"+lang).default : {};
    }

}

export default Lang;
