
import React, { useContext, useState, useEffect } from 'react';

import jet from "@randajan/jetpack";

import useForceRender from "../Hooks/useForceRender";

import Tray from "../Helpers/Tray";
import Task from "../Helpers/Task";
import Crypt from "../Helpers/Crypt";
import Storage from "../Helpers/Storage";
import Session from "../Helpers/Session";

import Case from "./Case";
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

    constructor(Provider, props) {
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
            onChange: new jet.RunPool(this),
        });

        this.onChange.add(onChange);

        if (debug) {
            window.jet = jet;
            window.Core = this;
            this.onChange.add((Core, changes)=>this.log(changes));
        }

        this.addModule("Tray", Tray.create(Task => this.setState(Task)));

        this.Tray.sync("build", _ => {
            this.addModule("Provider", Provider);
            this.addModule("Query", Query.create());
            this.addModule("Crypt", Crypt.create(cryptKey));
            this.addModule("View", View.create(this, viewSizes));
            this.addModule("Case", Case.create());
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
        if (!this.modules.has(name)) {
            this.modules.add(name);
            jet.obj.addProperty(this, name, module, false, true, false);
        }
        return module;
    }

    getModule(...path) {
        path = path.join(".");
        return path ? jet.obj.get(this, path) : this;
    }

    modOnChange(run, onChange, ...path) {
        if (!jet.is("function", onChange)) { return; }

        const modonc = this.getModule(...path, "onChange");
        if (!jet.is(jet.RunPool, modonc)) { return; }

        if (run) { modonc.addAndRun(onChange); }
        else { modonc.add(onChange); }

        return _=>modonc.rem(onChange);
    }

    addOnChange(onChange, ...path) {
        return this.modOnChange(false, onChange, ...path);
    }

    addAndRunOnChange(onChange, ...path) {
        return this.modOnChange(true, onChange, ...path);
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

        this.onChange.run(changes);
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

    static useContext(...path) {
        return useContext(Core.Context).getModule(...path);
    }

    static use(...path) {
        const core = Core.useContext();
        const rerender = useForceRender();
        useEffect(_=>core.addOnChange(rerender, ...path), []);
        return core.getModule(...path);
    }

    static useStorage() {
        return Core.use("Storage");
    }

    static useVault() {
        return Core.use("Vault");
    }

    static useSession() {
        return Core.use("Session");
    }

}



export default Core;