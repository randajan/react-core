
import React, { Component } from 'react'
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import PopUpProvider from "@randajan/react-popup";

import Core from "../Mods/Core";

class Provider extends Component {
    mounted = false;
    constructor(props) {
        super(props);
        
        const core = this.Core = new Core(this, props);

        core.addAndRunOnChange(core=>this.setState(core.state));
        core.addAndRunOnChange(lang=>this.setState({lang:lang.now}), "Lang");
        core.addAndRunOnChange(icons=>this.setState(), "Icons");
    }

    setState(state) {
      if (this.mounted) {super.setState(state);}
      else {this.state = {...this.state, ...state};}
    }

    getStateProps() {
      const props = {};
      jet.obj.map(this.state, (v, k) => { if (v && v != "none") { props["data-core-" + k.lower()] = v; } });
      return props;
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const Icons = this.Core.Icons;
      const lang = this.state.lang;
      const main = this.Core.id === 0;
      const { id, className } = this.props;
      const props = { id, className, main, ...this.getStateProps()};

      return (
          <Core.Context.Provider value={this.Core}>
            <PopUpProvider ref={PopUp=>this.Core.addModule("PopUp", PopUp)} {...props}>
              {Icons ? Icons.getDefs() : null}
              <Helmet htmlAttributes={{ lang }}><meta http-equiv="Content-language" content={lang} /></Helmet>
              {this.props.children}
            </PopUpProvider>  
          </Core.Context.Provider>
      )
    }
}

export default Provider;
