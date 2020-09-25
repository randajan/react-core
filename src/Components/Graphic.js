import React from 'react';

import jet from "@randajan/jetpack";

import Ico from "./Ico";
import Img from "./Img";
import Avatar from "./Avatar";

function Graphic(props) {
  const path = jet.str.to(props.src).split("/");
  const kind = path.shift();
  if (kind === "ico") {
    return <Ico {...props} src={path.join("/")}/>
  } else if (kind === "img") {
    return <Img {...props} src={path.join("/")}/>
  } else if (kind === "avatar") {
    return <Avatar {...props} src={path.join("/")}/>
  } else {
    return <Img {...props}/>
  }
}

export default Graphic;
