import React from 'react'

import { css } from "@randajan/react-popup";

import Core from "./CoreProvider";

import Observer from "./Observer";

const cn = css.open();

function Ico(props) {
  const icons = Core.useSerf("icons");
  const viewBox = Core.useVal("icons.viewBox");
  const { src, className, title } = props;

  const id = "#"+icons.getId(src);

  console.log(src, props.style);
  
  return (
      <Observer tag="svg" {...props} className={cn.get("Ico", src, className)} viewBox={viewBox}>
          {title ? <title>{title}</title> : null}
          <use className="svgShadow" xlinkHref={id}/>
          <use xlinkHref={id}/>
      </Observer>
  )
}

export default Ico;
