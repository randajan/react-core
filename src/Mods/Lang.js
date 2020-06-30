import moment from 'moment';

import jet from "@randajan/jetpack";

import LangLib from "../Helpers/LangLib";

import Serf from "../Base/Serf";

class Lang extends Serf {

    constructor(core, path, list, libs, now, fallback, def) {
        super(core, path);

        jet.obj.addProperty(this, {
            libs:Lang.validateLibs(libs),
            books:{}
        }, null, false, true);

        this.fitType("book", "object");
        this.fit("list", Lang.validateList);

        this.fit((v,f)=>{
            v = jet.get("object", v);
            v.def = Lang.validateLang([v.def, v.list[0]], v.list);
            v.fallback = Lang.validateLang([v.fallback, v.list[0]], v.list); 
            const now = v.now = Lang.validateLang([v.now, f.now, v.def], v.list);
            const book = this.openBook(now);
            if (!book.get("ready")) { v.now = f.now; }
            return v;
        });

        this.eye("now", now=>moment.locale(now));

        this.set({
            now,
            def,
            fallback,
            list:[list, fallback, def],
            book:this.open("book").linkLocal()
        });

    }

    spell(path, ...langs) {
        const { now, list, fallback } = this.get();
        for (let lang of Lang.validateLang([langs, now, fallback], list, true)) {
            let val = this.get(["book", lang, "data", path]);
            if (val) { return val; }
        }
    }

    openBook(lang) {
        if (this.books[lang]) { return this.books[lang]; }
        const book = this.books[lang] = this.addTask(["book", lang], this.fetchBook.bind(this), "1y", true);
        book.eye("data", _=>this.set("now", lang));
        setTimeout(_=>book.fetch(lang));
        return book;
    }

    async fetchBook(lang) {
        const data = await Promise.all(this.libs.map(lib => lib.fetch(lang)));
        if (data) { return jet.obj.merge(...data); }
    }

    getMenu() {
        return this.list.map(lang => {
            const path = "lang." + lang;
            const now = this.spell(path);
            const native = this.spell(path, lang);
            const label = (now && now !== native) ? now + " (" + native + ")" : native;
            if (lang !== this.now) { return [label, _ => this.set("now", lang)]; }
        }).filter(_ => _);
    }

    toString() { return this.get("now"); }

    static fromString(lang) { return jet.get("string", lang).substr(0, 2).lower(); }

    static validateList(...langs) {
        const list = new Set();
        jet.obj.map(langs, v => {
            const lang = Lang.fromString(v);
            if (lang) { list.add(lang); }
        }, true);
        if (jet.isEmpty(list)) { list.add("en"); }
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

}

export default Lang;
