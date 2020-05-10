import moment from 'moment';

import jet from "@randajan/jetpack";

import Core from "./Core";
import LangLib from "../Helpers/LangLib";

class Lang {

    constructor(Core, list, libs, fallback, def, onChange) {
        [fallback, def] = jet.get([["string", fallback, "en"], ["string", def]]);

        const Storage = Core.Storage.open("lang");
        const query = Core.Query.get("lang", true);

        list = Lang.validateList(list, fallback, def).map(lang => Storage.open(lang) ? lang : undefined);
        libs = Lang.validateLibs(libs);
        def = Lang.validateLang([def, list[0]], list);
        fallback = Lang.validateLang([fallback, list[0]], list);

        jet.obj.addProperty(this, {
            Core,
            Storage,
            list,
            libs,
            def,
            fallback,
            query,
            onChange:new jet.RunPool(this)
        }, null, false, true);

        this.onChange.add(onChange);

        this.select(query, Core.Auth.User.loadLang());

        Core.Auth.onChange.add(Auth=>this.select(query, Auth.User.loadLang()));
    }

    get(path, ...langs) {
        for (let lang of this.validateLang([langs, this.now, this.fallback], true)) {
            const val = this.Storage[lang].get(path);
            if (val) { return val; }
        }
    }

    async fetchLib(lang) {
        const data = await this.Core.Tray.async("Lang.lib." + lang, Promise.all(this.libs.map(lib => lib.fetch(lang))));
        if (data) { return jet.obj.merge(...data); }
    }

    async loadLib(lang, force) {
        if (!force && jet.isFull(this.Storage[lang])) { return true; }
        const data = await this.fetchLib(lang);
        if (!data) { return false; }
        this.Storage[lang].set("", data);
        return true;
    }

    async select(...langs) {
        langs = this.validateLang([langs, this.now, this.def], true);
        for (let lang of langs) {
            if (lang === this.now) {return false;}
            if (await this.loadLib(lang)) {this.now = lang; break;}
        }
        moment.locale(this.now);
        this.onChange.run();
        return true;
    }

    validateLang(langs, all) { return Lang.validateLang(langs, this.list, all) }

    getMenu() {
        if (!this.Core.isReady()) {return []; }
        return this.list.map(lang => {
            const path = "lang." + lang;
            const now = this.get(path);
            const native = this.get(path, lang);
            const label = (now && now !== native) ? now + " (" + native + ")" : native;
            if (lang !== this.now) { return [label, _ => this.select(lang)]; }
        }).filter(_ => _);
    }

    toString() { return this.now }

    static create(...args) { return new Lang(...args); }

    static fromString(lang) { return jet.get("string", lang).substr(0, 2).toLowerCase(); }

    static validateList(...langs) {
        const list = new Set();
        jet.obj.map(langs, v => {
            const lang = Lang.fromString(v);
            if (lang) { list.add(lang); }
        }, true);
        return Array.from(list);
    }

    static validateLibs(libs) {
        libs = jet.get("array", libs);
        libs.unshift(LangLib.create(-1, "", ["cs", "en", "de"], lang => require("./lang/" + lang).default));
        return jet.obj.map(libs, lib => LangLib.create(lib)).sort((a, b) => a.priority - b.priority);
    }

    static validateLang(langs, list, all) {
        langs = Lang.validateList(langs);
        if (jet.is("array", list)) { langs = langs.filter(lang => list.includes(lang)); }
        return all ? langs : langs[0];
    }

    static use(...path) {
        return Core.use("Lang", ...path);
    }

}

export default Lang;
