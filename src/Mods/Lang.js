import moment from 'moment';

import jet from "@randajan/jetpack";

import LangLib from "../Helpers/LangLib";

import Serf from "../Base/Serf";

class Lang extends Serf {

    static async fetchLibs(libs, lang) {
        const res = await Promise.all(libs.map(lib => lib.fetch(lang)));
        if (res) { return jet.obj.merge(...res); }
    }

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
        libs.unshift(LangLib.create(-1, "core", ["cs", "en"], lang => require("./lang/" + lang).default));
        return jet.obj.map(libs, lib => LangLib.create(lib)).sort((a, b) => a.priority - b.priority);
    }

    static validateLang(langs, list, all) {
        langs = Lang.validateList(langs);
        if (jet.is("array", list)) { langs = langs.filter(lang => list.includes(lang)); }
        return all ? langs : langs[0];
    }

    constructor(core, path, libs, list, def) {
        super(core, path);

        jet.obj.addProperty(this, {
            libs:Lang.validateLibs(libs),
            fetch:{}
        }, null, false, true);

        this.fitType("book", "object");
        this.fit("list", next=>Lang.validateList(next()));

        this.fit((next, v, f)=>{
            [v, f] = jet.get([["object", next()], ["object", f]]);
            v.def = Lang.validateLang([v.def, v.list[0]], v.list); 
            const now = v.now = Lang.validateLang([v.now, f.now, v.def], v.list);
            if (!v.book[now]) {
                this.fetchBook(now).then(book=>this.push({now, book:{[now]:book}}), _=>_);
                v.now = f.now;
            }
            return v;
        });

        this.eye("now", now=>moment.locale(now));
        this.eye("now", now=>core.analytics.lang(now));

        jet.obj.addProperty(this, "build", core.tray.watch(
            async _=>{
                const book = jet.get("object", await this.storeLocal("book").version(core.version).pull());
                book[def] = book[def] || await this.fetchBook(def);
                this.set({
                    list:[list, def],
                    def,
                    book
                });
            },
            {

            }
        ));


    }

    spell(path, ...langs) {
        const { now, list, def } = jet.get("object", this.get());
        for (let lang of Lang.validateLang([langs, now, def], list, true)) {
            let val = this.get(["book", lang, path]);
            if (val) { return val; }
        }
    }

    async fetchBook(lang) {
        if (!lang || this.fetch[lang]) { return this.fetch[lang]; }
        return this.fetch[lang] = this.parent.tray.watch(
            Lang.fetchLibs(this.libs, lang),
            {
                running:(this.spell("core.lang.watch.running") || "Loading language pack") + " '"+lang+"'",
                error:(this.spell("core.lang.watch.error") || "Failed to load language pack") + " '"+lang+"'",
            }
        );
    }

    getMenu() {
        return this.get("list").map(lang => {
            const path = ["core.lang.index", lang]
            const now = this.spell(path);
            const native = this.spell(path, lang);
            const label = (now && now !== native) ? now + " (" + native + ")" : native;
            if (lang !== this.now) { return [label, _ => this.set("now", lang)]; }
        }).filter(_ => _);
    }

    toString() { return this.get("now"); }

}

export default Lang;
