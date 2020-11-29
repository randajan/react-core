import React, { Component } from 'react';

import Pack from "./Pack";

import { css } from "@randajan/react-popup";

const cn = css.open();

class Caption extends Component {
  static contextType = Pack.Context;

  componentWillUnmount() {
    if (this.context) { this.context.remCaption(this); }
  }

  getLevel() {
    const level = this.context ? this.context.addCaption(this) : 0;
    return jet.num.frame(level + jet.num.to(this.props.mod), 0, 5)
  }

  render() {

    const Tag = "h"+(this.getLevel() + 1);
    const passProps = {...this.props, mod:null};

    return <Tag {...passProps} className={cn.get("Caption", this.props.className)}/>;
  }
}

["h1", "h2", "h3", "h4", "h5", "h6"].map((tag, mod)=>{
  Caption[tag] = props=><Caption {...props} mod={mod}/>
});

export default Caption;