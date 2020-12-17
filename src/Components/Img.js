import React from 'react'

import { css } from "@randajan/react-popup";

import Core from "./CoreProvider";

import Observer from "./Observer";

const cn = css.open();

function Img(props) {
  const images = Core.useSerf("images");
  const { src, className } = props;

  return <Observer tag="img" {...props} className={cn.get("Img", src, className)} src={images.get(["files", src])}/> 
  
}

export default Img;
