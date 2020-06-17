
import React, { useEffect } from 'react';

import jet from "@randajan/jetpack";

import { useForceRender, Modal } from "@randajan/react-popup";

import Provider from "../Components/Provider";

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
        
        const id = CORES.push(this) - 1;
        const { 
            nocache, debug, version, onChange, onBuild, cryptKey, viewSizes, sessionUrl, apiUrl, 
            langList, langLibs, langFallback, langDefault, 
            authPath, authProviders, anonymUser, 
            iconsPrefix, iconsList, iconsSize,
            imagesPrefix, imagesList,
        } = props;
        
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
            this.onChange.add((Core, changes)=>this.log(Core.build, Core.start));
        }

        this.addModule("Tray", Tray.create((tray, task) => this.setState(task)));

        this.Tray.runAsync("build", task => {

            this.addModule("Provider", Provider);
            this.addModule("Query", Query.create());
            this.addModule("Crypt", Crypt.create(cryptKey));
            this.addModule("View", View.create(viewSizes));
            this.addModule("Case", Case.create());
            this.addModule("Storage", nocache ? Storage.create() : Storage.createLocal("_coreStorage" + id, version));
            this.addModule("Vault", nocache ? Storage.create() : Storage.createLocal("_coreVault" + id, version, this.Crypt));
            this.addModule("Session", sessionUrl ? Session.create(sessionUrl, version, this.Crypt) : this.Vault.open("session"));
            this.addModule("Auth", Auth.create(this.Vault.open("auth"), authPath, authProviders, anonymUser));
            this.addModule("Api", Api.create(this.Vault.open("api"), apiUrl));
            this.addModule("Lang", Lang.create(this.Storage.open("lang"), langList, langLibs, langFallback, langDefault));
            this.addModule("Icons", Icons.create(this.Storage.open("ico"), iconsPrefix, iconsList, iconsSize));
            this.addModule("Images", Images.create(imagesPrefix, imagesList));

            const query = this.Query.get("lang", true);
            this.Lang.select(query, this.Auth.User.loadLang());
            this.Auth.onChange.add(_=>this.Lang.select(query, this.Auth.User.loadLang()));
            this.Lang.onChange.add(_=>this.Auth.User.saveLang(this.Lang.now));

            jet.run(onBuild, this);

        }, task=>this.build=task);

        this.Tray.runAsync("start", async task => {
            for (name of this.modules) {
                let module = this[name];
                if (jet.is("function", module.start)) { await this.Tray.async(name, module.start.bind(module)); }
            }
        }, task=>this.start=task);
        

        
    }

    addModule(name, module) {
        if (!this.modules.has(name)) {
            this.modules.add(name);
            jet.obj.addProperty(this, name, module, false, true, false);
            jet.obj.addProperty(module, "Core", this, false, false, false);
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

    async watch(prom) {

    }

    log(...msgs) {
        if (this.isDebug()) { console.log(...msgs); }
    }

    spaceCount() {
        return jet.test.byteCount(localStorage, "10mB");
    }

    static use(...path) {
        const core = Provider.use().Core;
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