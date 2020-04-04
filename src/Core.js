import jet from "@randajan/jetpack";

import Tray, { Task } from "./Tray";
import Query from "./Query";
import Crypt from "./Crypt";
import View from "./View";
import Storage from "./Storage";
import Session from "./Session";
import Lang from "./Lang";
import Api from "./Api";
import Auth from "./Auth";

const CORES = [];

class Core {

    constructor(props) {
        const { debug, version, onChange, cryptKey, langList, langLibs, langFallback, langDefault, viewSizes, sessionUrl, apiUrl, authPath, authProviders, anonymUser } = props;
        const id = CORES.push(this) - 1;
        const sid = "_core" + id;

        this.state = {};

        jet.obj.addProperty(this, {
            id,
            version,
            debug,
            modules: new Set(),
            onChange: new Set(jet.obj.toArray(onChange)),
        });

        if (debug) {
            window.jet = jet;
            window.Core = this;
            this.onChange.add((C, changes)=>this.log(changes));
        }

        this.addModule("Tray", Tray.create(Task => this.setState(Task)));

        this.Tray.sync("build", _ => {
            this.addModule("Query", Query.create());
            this.addModule("Crypt", Crypt.create(cryptKey));
            this.addModule("View", View.create(this, viewSizes));
            this.addModule("Storage", Storage.create(localStorage.getItem(sid), async data => localStorage.setItem(sid, data), version, this.Crypt));
            this.addModule("Session", sessionUrl ? Session.create(version, sessionUrl, this.Crypt) : this.Storage.open("session"));
            this.addModule("Auth", Auth.create(this, authPath, authProviders, anonymUser));
            this.addModule("Api", Api.create(this, apiUrl));
            this.addModule("Lang", Lang.create(this, langList, langLibs, langFallback, langDefault));
        });

        this.Tray.async("start", async _ => {
            for (name of this.modules) {
                let module = this[name];
                if (jet.is("function", module.start)) { await this.Tray.async(name, module.start.bind(module)); }
            }
        });
    }

    addModule(name, module) {
        this.modules.add(name);
        jet.obj.addProperty(this, name, module, false, true, false);
        return module;
    }

    regOnChange(onChange, modules, run) {
        if (!jet.is("function", onChange)) {return;}
        modules = jet.obj.toArray(modules);
        if (jet.isEmpty(modules)) {modules.push("Core");}
        const list = modules.map(mod=> mod === "Core" ? this : jet.obj.get(this, [mod, "onChange"]) ? this[mod] : null).filter(_=>_);

        list.map(Mod=>{
            if (Mod.onChange.has(onChange)) {return; }
            Mod.onChange.add(onChange); 
            if (run) {onChange(Mod, Mod.state);}
        });
        return _ => list.map(Mod=>Mod.onChange.delete(onChange));
    }

    setState(state) {
        state = !jet.is(Task, state) ? jet.get("object", state) : {
            loading: this.Tray.fetchTasks("pending").join(" ") || false,
            error: this.Tray.fetchTasks("error").join(" ") || false,
            ready: this.Tray.isReady()
        };

        const nState = { ...this.state, ...state }; //merge states
        const changes = jet.obj.map(nState, (v, k) => this.state[k] !== v ? v : undefined);

        if (jet.isEmpty(changes)) { return; }
        this.state = nState;

        jet.run(Array.from(this.onChange), this, changes);
    }

    isLoading() { return !!this.state.loading; }
    isError() { return !!this.state.error; }
    isReady() { return this.state.ready; }
    isMounted() { return this.state.mounted; }
    isDebug() { return this.debug; }

    log(msg) {
        if (this.isDebug()) { console.log(msg); }
    }

}



export default Core;