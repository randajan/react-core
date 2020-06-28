
import React, { Component, useContext } from 'react'
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import jet from "@randajan/react-jetpack";
import ModalProvider from "@randajan/react-popup";

import Core from "../Mods/Core";

import IcoDefs from "./IcoDefs";
import Query from "./Query";

class Provider extends Component {

  static Context = React.createContext();
  static use() { return useContext(Provider.Context); }

  static defaultFlags = {
    loading: p => p.Core.isLoading(),
    error: p => p.Core.isError(),
  }

  constructor(props) {
    super(props);
    jet.obj.addProperty(this, {
      Core: Core.create(props),
    });
  }

  componentDidMount() { this.cleanUp = this.Core.eye(provider => this.forceUpdate()); }
  componentWillUnmount() { this.cleanUp(); }

  fetchSelfProps() {
    const { id, className, onLoad, flags } = this.props;

    return {
      id, className,
      onLoad: _ => jet.run(onLoad, this),
      flags: jet.react.fetchFlags({ ...Provider.defaultFlags, ...flags }, this)
    };

  }

  render() {
    const lang = this.Core.get("Lang.select");

    return (
      <Provider.Context.Provider value={this}>
        <ModalProvider {...this.fetchSelfProps()}>
          <IcoDefs />
          <Helmet htmlAttributes={{ lang }}><meta http-equiv="Content-language" content={lang} /></Helmet>
          <BrowserRouter>
            <Query/>
            {this.props.children}
          </BrowserRouter>
        </ModalProvider>
      </Provider.Context.Provider>
    )
  }
}

export default Provider;
