import React, { Component, useContext } from 'react';

import jet from "@randajan/react-jetpack";

import Caption from "./Caption";
import Pack from "./Pack";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Nest(props) {
  const { caption, children, wrap } = props;

  const passProps = {...props, caption:null, children:null, wrap:null};
  const type = jet.type(wrap);

  return (
    <Pack {...passProps}>
      <Caption>{caption}</Caption>
      {
        (type === "boolean" && wrap) ? <div className={cn.get("wrap")}>{children}</div> :
        type === "string" ? <div className={wrap}>{children}</div> :
        type === "object" ? <div {...wrap}>{children}</div> :
        children
      }
    </Pack>
  )
}



export default Nest;