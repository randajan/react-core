import moment from 'moment';
import jet from "@randajan/jetpack";

const BASELANGS = ["en", "cs"];

class Lang {

    constructor(Core, libs, fallback, def) {
        libs = jet.get("mapable", libs, ["en"]);

        const isArray = jet.is("array", libs);
        const list = [];
 
        jet.obj.map(libs, (v,k)=>{
            const lang = Lang.fromString(isArray ? v : k);
            if (list.includes(lang)) {return;}
            list.push(lang);
            jet.obj.addProperty(this, lang, jet.obj.merge(Lang.getBase(lang), isArray ? v : null), false, true);
        });

        jet.obj.addProperty(this, {
            Core,
            list,
            "def": this.validate([def, fallback, list[0]]),
            "fallback": this.validate([fallback, def, list[0]])
        });

        this.select(Core.Query.pull("lang"), Core.Auth.User.loadLang());
        Core.onChange.add(changes=>changes.user != null ? this.select(Core.Auth.User.loadLang()) : null);
    }

    set(path, val, lang) {
        const vlang = this.validate(lang);
        if (lang && !vlang) {return false;}

        lang = vlang || this.def;

        const from = path ? jet.obj.get(this[lang], path) : this[lang];
        const to = jet.isMapable(val) ? jet.obj.merge(from, val) : val;

        if (!path) {jet.obj.addProperty(this, lang, to, true, true);}
        else {jet.obj.set(this[lang], path, to, true);}

        return true;
    }

    get(path, ...langs) {
        if (!path) {return this.now;}
        const { now, fallback } = this;
        let result;
        this.validate([langs, now, fallback], true).map(lang=>{
            result = result || jet.obj.get(this[lang], path);
        });
        return result;
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
        let list = new Set();
        jet.obj.map(jet.obj.toArray(langs), v=>{const lang = Lang.fromString(v); if (this[lang]) {list.add(lang);}}, true);
        list = Array.from(list);
        return all ? list : list[0];
    }

    getMenu() {
        const result = [];
        this.list.map(lang=>{
            const path = "lang."+lang;
            const now = this.get(path);
            const native = this.get(path, lang);
            const label = (now && now !== native) ? now+" ("+native+")" : native;
            if (lang !== this.now) { result.push([label, _=>this.select(lang)]);}
        });
        return result;
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
