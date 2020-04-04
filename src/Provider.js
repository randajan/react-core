
import React, { Component, useContext} from 'react'
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";

import jet from "@randajan/jetpack";
import PopUpProvider from "@randajan/react-popup";

import Core from "./Core";

import Context, { useLang } from "./Hooks";


class Provider extends Component {
    static propTypes = {
      addProps:PropTypes.func
    }

    static defaultProps = {
      addProps:_=>_
    }

    constructor(props) {
        super(props);
        this.Core = new Core(props);
    }

    componentDidMount() { this.clean = this.Core.regOnChange(Core=>this.setState(Core.state)); }
    componentWillUnmount() { jet.run(this.clean); }

    getStateProps() {
      const props = {};
      jet.obj.map(this.state, (v, k) => { if (v && v != "none") { props["data-core-" + k.lower()] = v; } });
      return props;
    }

    render() {
      const main = Core.id === 0;
      const { id, className, addProps } = this.props;
      const props = { id, className, main, addProps, ...this.getStateProps()};

      return (
          <Context.Provider value={this.Core}>
              <CoreHook {...props}>
                  {this.props.children}
              </CoreHook>
          </Context.Provider>
      )
    }
}

function CoreHook(props) {
  const Core = useContext(Context);
  const lang = useLang().now;
  const pprops = {...jet.get("object", props.addProps(Core)), ...props};
  delete pprops.addProps;

  return (
      <PopUpProvider ref={PopUp=>Core.addModule("PopUp", PopUp)} {...pprops}>
          <Helmet htmlAttributes={{ lang }}><meta http-equiv="Content-language" content={lang} /></Helmet>
          {props.children}
      </PopUpProvider>  
  )
}


export default Provider;
