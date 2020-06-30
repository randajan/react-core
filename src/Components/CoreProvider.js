
import React, { Component, useContext } from 'react'
import { BrowserRouter } from "react-router-dom";

import jet from "@randajan/react-jetpack";
import ModalProvider from "@randajan/react-popup";

import Core from "../Mods/Core";

import IcoDefs from "./IcoDefs";
import Query from "./Query";
import Lang from "./Lang";

class CoreProvider extends Component {

  static Context = React.createContext();
  static use() { return useContext(CoreProvider.Context); }

  static defaultFlags = {
    loading: p => p.core.isLoading(),
    error: p => p.core.isError(),
  }

  constructor(props) {
    super(props);
    jet.obj.addProperty(this, {
      core: Core.create(props),
    });
  }
  componentDidMount() { this.cleanUp = this.core.eye(provider => this.forceUpdate()); }
  componentWillUnmount() { this.cleanUp(); }

  getBody() {
    return jet.obj.get(this, "refs.modal.refs.body");
  }

  fetchSelfProps() {
    const { id, className, onLoad, flags } = this.props;

    return {
      id, className, ref:"modal",
      onLoad: _ => jet.run(onLoad, this),
      flags:jet.react.fetchFlags({ ...CoreProvider.defaultFlags, ...flags }, this)
    };

  }

  render() {
    this.core.debugLog("Render", "CoreProvider");
    return (
      <CoreProvider.Context.Provider value={this}>
        <ModalProvider {...this.fetchSelfProps()}>
          <Lang/>
          <IcoDefs />
          <BrowserRouter>
            <Query/>
            {this.props.children}
          </BrowserRouter>
        </ModalProvider>
      </CoreProvider.Context.Provider>
    )
  }
}

export default CoreProvider;
