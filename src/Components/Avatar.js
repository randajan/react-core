import React from 'react';

import Img from "./Img";

import Observer from "./Observer";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Avatar(props) {
  const { className, id, title, src, onClick } = props;

  const imgProps = {
    ...props,
  }

  const selfProps = {
    className:cn.get("Avatar", className), 
    id, title, onClick,
    style:{position:"relative", overflow:"hidden"}
  }

  delete imgProps.className;
  delete imgProps.id;
  delete imgProps.title;
  delete imgProps.onClick;
  delete imgProps.style;
  delete imgProps.default;

  return (
    <Observer tag="span" {...selfProps}>
      {src ? <Img {...imgProps} style={{display:"block", height:"100%", width:"100%", "object-fit":"cover"}}/> : (props.default || <Ico {...imgProps} src={"avatar"}/>)}
    </Observer>
  );
}

export default Avatar;
