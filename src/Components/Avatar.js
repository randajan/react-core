import React from 'react';

import Img from "./Img";

import Observer from "./Observer";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Avatar(props) {
  const { className, id, title, onClick } = props;

  const imgProps = {
    ...props,
    style:{display:"block", height:"100%", width:"100%", "object-fit":"cover"}
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

  return (
    <Observer tag="span" {...selfProps}>
      <Img {...props}/>
    </Observer>
  );
}

export default Avatar;
