import React, { Component } from 'react';
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import PopUpProvider from "@randajan/react-popup";

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
        const { onChange, cryptKey, langDefault, langLibs, viewSizes, sessionUrl, apiUrl, authPath, authProviders } = props;
        const id = CORES.push(this)-1;

        this.state = {
            loading: "Initialize",
            error: false,
            ready: false,
        };

        jet.obj.addProperty(this, {
            id,
            modules: new Set(),
            onChange: new Set(jet.obj.toArray(onChange)),
        });

        if (props.debug) {
            window.jet = jet;
            window.Core = this;
            this.onChange.add(_=>console.log(_));
        }

        this.addModule("Query", Query.create());
        this.addModule("Crypt", Crypt.create(cryptKey));
        this.addModule("View", View.create(this, viewSizes));
        this.addModule("Storage", Storage.create(localStorage.getItem(id), data => localStorage.setItem(id, data), this.Crypt));
        this.addModule("Session", sessionUrl ? Session.create(sessionUrl, this.Crypt) : this.Storage.open("session"));
        this.addModule("Auth", Auth.create(this, authPath, authProviders));
        this.addModule("Api", Api.create(this, apiUrl));
        this.addModule("Lang", Lang.create(this, langDefault, langLibs));

    }

    isReady() {return this.state.ready;}
    isLoading(state) {return state ? this.state.loading === state : !!this.state.loading;}

    addModule(name, module) {
        this.modules.add(name);
        return jet.obj.addProperty(this, name, module, false, true);
    }

    async componentDidMount() {
        if (!this.isLoading("Initialize")) {return;} //initialize will happen just once

        for (name of this.modules) {
            if (jet.is("function", this[name].start)) {
                this.setLoading(name);
                await this[name].start();
            }
        }

        this.setLoading();
    }

    setState(state) {
        state = jet.get("object", state);
        const nState = { ...this.state, ...state };
        const { loading, error } = nState;

        if (error) { nState.ready = nState.loading = false; }
        else if (loading) { nState.ready = nState.error = false; }
        else { nState.error = nState.loading = false; nState.ready = true; }

        const changes = jet.obj.map(nState, (v,k)=>{return this.state[k] !== v ? v : undefined;});
        if (jet.isEmpty(changes)) {return;}

        if (nState.loading === "Initialize") { this.state = nState; } else { super.setState(nState); }

        jet.run(Array.from(this.onChange), changes);
    }

    setLoading(loading) { this.setState({ loading }); }
    setError(error) { this.setState({ error }); }

    getProps() {
        const props = {};
        jet.obj.map(this.state, (v, k) => (v && v != "none") ? props["data-sys-" + k.toLowerCase()] = v : undefined);
        return props;
    }
    
    render() {
        const lang = this.Lang.get();
        return (
            <Core.Context.Provider value={this}>
                <Helmet htmlAttributes={{lang}}><meta http-equiv="Content-language" content={lang}/></Helmet>
                <PopUpProvider ref={_=>this.body = jet.obj.get(_, "body")} main {...this.getProps()}>
                    {this.props.children}
                </PopUpProvider>
            </Core.Context.Provider>
        )
    }

}

export default Core;