import React from 'react'

import { css } from "@randajan/react-popup";

import Core from "../Mods/Core";

const cn = css.open();

function Img(props) {
  const images = Core.use("Images");
  const { src, className } = props;

  return <img {...props} className={cn.get("Img", src, className)} src={images.get(["files", src])}/> 
  
}

export default Img;
