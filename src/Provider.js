
import React, { Component } from 'react'
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import PopUpProvider from "@randajan/react-popup";

import Core from "./Core";

const Context = React.createContext();

class Provider extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.Core = new Core(props);
        this.update = _ => this.setState(this.Core.state);
    }

    addPopUp(popUp) {
        const body = jet.obj.get(popUp, "body");
        if (!body || this.body) { return; }
        jet.obj.addProperty(this, "body", body, false, true);
        this.Core.addModule("PopUp", popUp);
    }

    componentDidMount() {
        this.Core.onChange.add(this.update);
    }
    componentWillUnmount() {
        this.Core.onChange.rem(this.update);
    }

    getProps() {
        const { id, className } = this.props;
        const main = this.id === 0;
        const props = { id, className, main };
        jet.obj.map(this.state, (v, k) => { if (v && v != "none") { props["data-core-" + k.lower()] = v; } });
        return props;
    }

    render() {
        const lang = this.state.lang;

        return (
            <Context.Provider value={this.Core}>
                <Helmet htmlAttributes={{ lang }}><meta http-equiv="Content-language" content={lang} /></Helmet>
                <PopUpProvider ref={this.addPopUp.bind(this)} {...this.getProps()}>
                    {this.props.children}
                </PopUpProvider>
            </Context.Provider>
        )
    }
}


export default Provider;
export {
    Context
}
