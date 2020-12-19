import React from 'react';

import Ico from "./Ico";
import Pack from "./Pack";
import Caption from "./Caption";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Tile(props) {
  const { src, title, children, className, wrap } = props

  return (
    <Pack {...props} src={null} wrap={null} className={cn.get("Tile", className)}>
      <Ico src={src}/>
      <Caption>{title}</Caption>
      {
        (type === "boolean" && wrap) ? <div className={cn.get("wrap")}>{children}</div> :
        type === "string" ? <div className={wrap}>{children}</div> :
        type === "object" ? <div {...wrap}>{children}</div> :
        children
      }
      {children}
    </Pack>
  )
}

export default Tile;
