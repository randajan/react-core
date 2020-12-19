import React, { Component } from 'react';

import Pack from "./Pack";

import { css } from "@randajan/react-popup";

const cn = css.open();

class Caption extends Component {
  static contextType = Pack.Context;

  componentDidMount() { Pack.regCaption(this); }
  componentWillUnmount() { Pack.remCaption(this); }

  fetchLevel() {
    const { context } = this;
    if (!context) { return 0; }
    context.regCaption(this);
    return context.getLevel();
  }

  fetchTag() {
    const level = 1+Math.max(Math.round(this.fetchLevel() + jet.num.to(this.props.level)), 0);
    return level > 6 ? "span" : "h"+level;
  }

  render() {
    const Tag = this.fetchTag()
    const passProps = {
      ...this.props,
      ref:body=>this.body = body,
      level:null,
      className:cn.get("Caption", this.props.className),
    };

    return <Tag {...passProps}/>;
  }
}

["h1", "h2", "h3", "h4", "h5", "h6"].map((tag, level)=>{
  Caption[tag] = props=><Caption {...props} level={level}/>
});

export default Caption;