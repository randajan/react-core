import React from 'react';

import Pack from "./Pack";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Caption(props) {
  const Tag = "h"+Pack.useCaption();
  return <Tag {...props} className={cn.get("Caption", props.className)}/>;
}

export default Caption;