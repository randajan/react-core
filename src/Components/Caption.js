import React, { Component } from 'react';

import Pack from "./Pack";

import { css } from "@randajan/react-popup";

const cn = css.open();

class Caption extends Component {
  static contextType = Pack.Context;

  state = {}

  componentDidMount() { Pack.regCaption(this); }
  componentWillUnmount() { Pack.remCaption(this); }

  redraw() {
    const { context } = this;
    const mod = context ? context.regCaption(this) : 0
    this.setState({mod});
  }

  getMod() {
    const { props, state } = this
    return Math.max(Math.round(jet.num.to(state.mod) + jet.num.to(props.mod)), 0)
  }

  getTag() {
    const mod = 1+this.getMod();
    return mod > 6 ? "span" : "h"+mod;
  }

  render() {
    const Tag = this.getTag()
    const passProps = {
      ...this.props,
      ref:body=>this.body = body,
      mod:null,
      className:cn.get("Caption", this.props.className),
    };

    return <Tag {...passProps}/>;
  }
}

["h1", "h2", "h3", "h4", "h5", "h6"].map((tag, mod)=>{
  Caption[tag] = props=><Caption {...props} mod={mod}/>
});

export default Caption;