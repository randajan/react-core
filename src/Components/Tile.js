import React from 'react';

import jet from "@randajan/react-jetpack";

import Ico from "./Ico";
import Pack from "./Pack";
import Caption from "./Caption";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Tile(props) {
  const { src, title, children, className, wrap } = props

  const type = jet.type(wrap);

  return (
    <Pack {...props} src={null} wrap={null} className={cn.get("Tile", className)}>
      <Ico src={src}/>
      <Caption>{title}</Caption>
      {
        (type === "bol" && wrap) ? <div className={cn.get("wrap")}>{children}</div> :
        type === "str" ? <div className={wrap}>{children}</div> :
        type === "obj" ? <div {...wrap}>{children}</div> :
        children
      }
      {children}
    </Pack>
  )
}

export default Tile;
