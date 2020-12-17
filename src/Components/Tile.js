import React from 'react';

import Ico from "./Ico";
import Pack from "./Pack";
import Caption from "./Caption";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Tile(props) {
  const {src, title, children, className} = props

  return (
    <Pack {...props} src={null} className={cn.get("Tile", className)}>
      <Ico src={src}/>
      <Caption>{title}</Caption>
      {children}
    </Pack>
  )
}

export default Tile;
