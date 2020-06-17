
import React, { Component, useContext } from 'react'
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import ModalProvider, { ClassNames } from "@randajan/react-popup";

import Core from "../Mods/Core";

class Provider extends Component {

  static Context = React.createContext();

  static use() { return useContext(Provider.Context); }

  static defaultFlags = {
    build:p=>p.Core.build
  }

  cleanUp = new jet.RunPool();

  constructor(props) {
    super(props);

    jet.obj.addProperty(this, {
      Core: new Core(this, props)
    });

    this.state = {};

  }

  actualize(direction) {
    if (jet.is(jet.RunPool, this.cleanUp)) { this.cleanUp.run(); }
    if (direction !== false) {
      this.cleanUp = new jet.RunPool();
      this.cleanUp.add(
        this.Core.addAndRunOnChange(core => this.setState(core.state)),
        this.Core.addAndRunOnChange(lang => this.setState({ lang: lang.now }), "Lang"),
        this.Core.addAndRunOnChange(icons => this.forceUpdate(), "Icons"),
      );
    }
  }

  componentDidMount() { this.actualize(true); }

  fetchSelfProps() {
    const { id, className, onLoad } = this.props;

    const props = {
      id, className, 
      ref:prov => prov ? this.Core.addModule("Modal", prov.Modal) : null,
      onLoad:_=>jet.run(onLoad, this.Core),
      flags:ClassNames.fetchFlags([ Provider.defaultFlags ], this)
    };

    jet.obj.map(this.state, (v, k) => { if (v && v != "none") { props["data-core-" + k.lower()] = v; } });

    return props;
  }

  render() {
    const Icons = this.Core.Icons;
    const lang = this.state.lang;

    return (
      <Provider.Context.Provider value={this}>
        <ModalProvider {...this.fetchSelfProps()}>
          {Icons ? Icons.getDefs() : null}
          <Helmet htmlAttributes={{ lang }}><meta http-equiv="Content-language" content={lang} /></Helmet>
          {this.props.children}
        </ModalProvider>
      </Provider.Context.Provider>
    )
  }
}

export default Provider;
