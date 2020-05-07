
import React, { useContext, useState, useEffect } from 'react';

import jet from "@randajan/jetpack";

import Tray from "../Helpers/Tray";
import Task from "../Helpers/Task";
import Crypt from "../Helpers/Crypt";
import Storage from "../Helpers/Storage";
import Session from "../Helpers/Session";

import Query from "./Query";
import View from "./View";
import Lang from "./Lang";
import Api from "./Api";
import Auth from "./Auth";
import Icons from "./Icons";
import Images from "./Images";

const CORES = [];

class Core {

    state = {}

    constructor(props) {
        const { 
            nocache, debug, version, onChange, onBuild, cryptKey, viewSizes, sessionUrl, apiUrl, 
            langList, langLibs, langFallback, langDefault, 
            authPath, authProviders, anonymUser, 
            iconsPrefix, iconsList, iconsSize,
            imagesPrefix, imagesList,
        } = props;
        

        const id = CORES.push(this) - 1;

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
            this.onChange.add((Core, changes)=>this.log(changes));
        }

        this.addModule("Tray", Tray.create(Task => this.setState(Task)));

        this.Tray.sync("build", _ => {
            this.addModule("Query", Query.create());
            this.addModule("Crypt", Crypt.create(cryptKey));
            this.addModule("View", View.create(this, viewSizes));
            this.addModule("Storage", nocache ? Storage.create() : Storage.createLocal("_coreStorage" + id, version));
            this.addModule("Vault", nocache ? Storage.create() : Storage.createLocal("_coreVault" + id, version, this.Crypt));
            this.addModule("Session", sessionUrl ? Session.create(sessionUrl, version, this.Crypt) : this.Vault.open("session"));
            this.addModule("Auth", Auth.create(this, authPath, authProviders, anonymUser));
            this.addModule("Api", Api.create(this, apiUrl));
            this.addModule("Lang", Lang.create(this, langList, langLibs, langFallback, langDefault));
            this.addModule("Icons", Icons.create(this, iconsPrefix, iconsList, iconsSize));
            this.addModule("Images", Images.create(this, imagesPrefix, imagesList));
            jet.run(onBuild, this);
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

    addOnChange(onChange, modules, run) {
        if (!jet.is("function", onChange)) {return;}

        modules = jet.obj.toArray(modules);
        if (jet.isEmpty(modules)) {modules.push("Core");}

        const list = jet.obj.map(modules, mod=>{
            if (mod === "Core") { return this; }
            const Mod = jet.obj.get(this, mod);
            if (Mod && Mod["onChange"]) { return Mod; }
        });
        
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
    isReady() { return !!this.state.ready; }
    isDebug() { return !!this.debug; }

    log(msg) {
        if (this.isDebug()) { console.log(msg); }
    }

    spaceCount() {
        return jet.test.byteCount(localStorage, "10mB");
    }

    static Context = React.createContext();

    static use(...mods) {
        const core = useContext(Core.Context);
        const setState = useState()[1];
        useEffect(_ => core.addOnChange(_=>setState({}), mods), []);
        return core;
    }

    static useStorage(...mods) {
        return Core.use("Storage", ...mods).Storage;
    }

    static useVault(...mods) {
        return Core.use("Vault", ...mods).Vault;
    }

    static useSession(...mods) {
        return Core.use("Session", ...mods).Session;
    }

}



export default Core;