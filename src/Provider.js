
import React, { Component, useContext} from 'react'
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import PopUpProvider from "@randajan/react-popup";

import Core from "./Core";

import Context from "./Hooks";


class Provider extends Component {
    static propTypes = {
      addProps:PropTypes.func
    }

    static defaultProps = {
      addProps:()=>{}
    }

    constructor(props) {
        super(props);
        this.clean = [];
        this.Core = new Core(props);
    }

    addStateProps(onChange, ...modules) {
      if (jet.is("function", onChange)) {
        this.clean.push(this.Core.regOnChange(Mod=>this.setState(onChange(Mod)), modules, true));
      }
    }

    getStateProps() {
      const props = {};
      jet.obj.map(this.state, (v, k) => { if (v && v != "none") { props["data-core-" + k.lower()] = v; } });
      return props;
    }

    componentDidMount() {
      this.clean = [];
      this.addStateProps(Core=>Core.state);
      this.addStateProps(Lang=>({lang:Lang.now}), "Lang");
      jet.run(this.props.addProps, this.addStateProps.bind(this));
    }

    componentWillUnmount() {
      jet.run(this.clean);
    }

    render() {
      const lang = this.Core.Lang.now;
      const main = this.Core.id === 0;
      const { id, className } = this.props;
      const props = { id, className, main, ...this.getStateProps()};

      return (
          <Context.Provider value={this.Core}>
            <PopUpProvider ref={PopUp=>this.Core.addModule("PopUp", PopUp)} {...props}>
                <Helmet htmlAttributes={{ lang }}><meta http-equiv="Content-language" content={lang} /></Helmet>
                {this.props.children}
            </PopUpProvider>  
          </Context.Provider>
      )
    }
}

export default Provider;
