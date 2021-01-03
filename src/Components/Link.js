import React from 'react';
import { NavLink } from "react-router-dom";

import jet from "@randajan/react-jetpack";
import Core from "./CoreProvider";

import { css } from "@randajan/react-popup";
const cn = css.open();

function Link(props) {
  const { to, href, className, children, target, flags } = props;
  const analytics = Core.use("analytics");

  const url = to || href;
  const local = (url && url.startsWith("/") && !target);
  const query = (url && url.startsWith("?") && !target);

  const pass = {
    ...props, 
    className: cn.get("Link", className).toString(),
    "data-flags":jet.rele.flags({local, query, ...flags}, props),
    href:null, 
    to:null
  };

  return (local || query) ? <NavLink {...pass} to={url} exact/> : 
    <a {...pass} href={url} rel="noreferrer noopener" onClick={_=>analytics.link([className, children, url])}/>; 
}

export default Link;

  