
import React, { Component, useContext } from 'react'
import { BrowserRouter } from "react-router-dom";

import jet from "@randajan/react-jetpack";
import ModalProvider from "@randajan/react-popup";

import Core from "../Mods/Core";

import IcoDefs from "./IcoDefs";
import PageProvider from "./PageProvider";
import Lang from "./Lang";

class CoreProvider extends Component {

  static Context = React.createContext();
  static use() { return useContext(CoreProvider.Context); }

  static defaultFlags = {
    pending: p => p.core.tray.isPending(),
    error: p => p.core.tray.isError(),
  }

  constructor(props) {
    super(props);
    jet.obj.addProperty(this, {
      core: Core.create(props),
    });
  }
  componentDidMount() {
    this.cleanUp = this.core.eye(provider => this.forceUpdate());
  }
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
      <BrowserRouter>
        <CoreProvider.Context.Provider value={this}>
          <ModalProvider {...this.fetchSelfProps()}>
            <Lang/>
            <IcoDefs />
            <PageProvider/>
            {this.props.children}
          </ModalProvider>
        </CoreProvider.Context.Provider>
      </BrowserRouter>
    )
  }
}

export default CoreProvider;
