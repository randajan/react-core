
import React, { Component, useContext, useEffect } from 'react'

import jet, { useForceRender } from "@randajan/react-jetpack";

import Base from "./Base";

class Provider extends Component {

  static Context = React.createContext();

  static useContext() { return useContext(Provider.Context); }
    
  static useEye(path) {
      const base = Provider.useContext();
      const rerender = useForceRender();
      useEffect(_=>base.eye(path, rerender), []);
      return base;
  }

  static useSerf(path, ...args) {
      return Provider.useContext().open(path, ...args);
  }

  static useVal(path) {
      return Provider.useEye(path).get(path);
  }

  static useKey(path) {
      const base = Provider.useEye(path);
      return [base.get(path), value=>base.set(path, value)];
  }

  static useMethod(path, method) {
      const serf = Provider.useSerf(path);
      if (!jet.is("function", serf[method])) { throw new Error("Method '"+method+"' at path '"+path+"' was not found.") }
      return serf[method].bind(serf);
  }

  static use(path, ...args) {
      return Provider.useEye(path).open(path, ...args);
  }

  constructor(props) {
    super(props);
    jet.obj.addProperty(this, { base:this.build(props) });
  }

  build(props) {
    return new Base(props);
  }

  componentDidMount() {
    this.cleanUp = this.base.eye(provider => this.forceUpdate());
  }

  componentWillUnmount() { this.cleanUp(); }

  componentDidUpdate() {
    this.base.debugLog("Rerender", "Provider");
  }

  render() {
    return (
        <Provider.Context.Provider value={this.base}>
          {this.props.children}
        </Provider.Context.Provider>
    )
  }
}

export default Provider;
