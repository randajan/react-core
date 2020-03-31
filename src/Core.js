import React, { Component } from 'react';
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import PopUpProvider from "@randajan/react-popup";

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

class Core extends Component {

    static Context = React.createContext();

    constructor(props) {
        super(props);
        const { debug, version, onChange, cryptKey, langList, langLibs, langFallback, langDefault, viewSizes, sessionUrl, apiUrl, authPath, authProviders, anonymUser } = props;
        const id = CORES.push(this) - 1;
        const sid = "_core" + id;

        this.state = {};

        jet.obj.addProperty(this, {
            id,
            version,
            modules: new Set(),
            onChange: new Set(jet.obj.toArray(onChange)),
        });

        if (debug) {
            window.jet = jet;
            window.Core = this;
            this.onChange.add(this.debug.bind(this));
        }

        this.addModule("Tray", Tray.create(Task => this.setState(Task)));

        this.Tray.sync("build", _ => {
            this.addModule("Query", Query.create());
            this.addModule("Crypt", Crypt.create(cryptKey));
            this.addModule("View", View.create(this, viewSizes, View => this.setState(View)));
            this.addModule("Storage", Storage.create(localStorage.getItem(sid), async data => localStorage.setItem(sid, data), version, this.Crypt));
            this.addModule("Session", sessionUrl ? Session.create(version, sessionUrl, this.Crypt) : this.Storage.open("session"));
            this.addModule("Auth", Auth.create(this, authPath, authProviders, anonymUser, Auth => this.setState({ user: Auth.User.id })));
            this.addModule("Api", Api.create(this, apiUrl));
            this.addModule("Lang", Lang.create(this, langList, langLibs, langFallback, langDefault, Lang => this.setState({ lang: Lang.now })));
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
        jet.obj.addProperty(this, name, module, false, true);
        return module;
    }

    addPopUp(popUp) {
        const body = jet.obj.get(popUp, "body");
        if (!body || this.body) { return; }
        jet.obj.addProperty(this, "body", body, false, true);
        this.addModule("PopUp", popUp);
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
        if (nState.mounted) { super.setState(nState); } else { this.state = nState; }

        jet.run(Array.from(this.onChange), changes);
    }

    isLoading() { return !!this.state.loading; }
    isError() { return !!this.state.error; }
    isReady() { return this.state.ready; }
    isMounted() { return this.state.mounted; }
    isDebug() { return this.props.debug; }

    debug(msg) {
        if (this.isDebug()) { console.log(msg); }
    }

    getProps() {
        const { id, className } = this.props;
        const main = this.id === 0;
        const props = { id, className, main };
        jet.obj.map(this.state, (v, k) => { if (v && v != "none") { props["data-core-" + k.lower()] = v; } });
        return props;
    }

    componentDidMount() { this.setState({ mounted: true }); }
    componentWillUnmount() { this.setState({ mounted: false }); }

    render() {
        const lang = this.Lang.now;

        return (
            <Core.Context.Provider value={this}>
                <Helmet htmlAttributes={{ lang }}><meta http-equiv="Content-language" content={lang} /></Helmet>
                <PopUpProvider ref={this.addPopUp.bind(this)} {...this.getProps()}>
                    {this.props.children}
                </PopUpProvider>
            </Core.Context.Provider>
        )
    }

}

export default Core;