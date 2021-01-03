import React from 'react';

import jet from "@randajan/react-jetpack";

import Caption from "./Caption";
import Pack from "./Pack";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Nest(props) {
  const { caption, children, wrap } = props;

  const type = jet.type(wrap);

  return (
    <Pack {...props} caption={null} wrap={null}>
      {caption ? <Caption>{caption}</Caption> : null}
      {
        (type === "bol" && wrap) ? <div className={cn.get("wrap")}>{children}</div> :
        type === "str" ? <div className={wrap}>{children}</div> :
        type === "obj" ? <div {...wrap}>{children}</div> :
        children
      }
    </Pack>
  )
}



export default Nest;