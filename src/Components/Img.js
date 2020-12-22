import React from 'react'

import { css } from "@randajan/react-popup";

import Core from "./CoreProvider";

import Observer from "./Observer";

const cn = css.open();

function Img(props) {
  const images = Core.useSerf("images");
  const { src, className } = props;
  const known = images.get(["files", src]);

  return <Observer tag="img" {...props} className={cn.get("Img", className, known ? src : "")} src={known || src}/> 
  
}

export default Img;
