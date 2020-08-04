import React from 'react'

import { css } from "@randajan/react-popup";

import Core from "./CoreProvider";

const cn = css.open();

function Img(props) {
  const images = Core.useSerf("images");
  const { src, className } = props;

  return <img {...props} className={cn.get("Img", src, className)} src={images.get(["files", src])}/> 
  
}

export default Img;
