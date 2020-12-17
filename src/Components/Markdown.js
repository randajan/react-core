import React from 'react';

import Markdown from "markdown-to-jsx";

import jet from "@randajan/react-jetpack";

import Link from "./Link";
import Caption from "./Caption";
import Pack from "./Pack";
import Ico from "./Ico";
import Img from "./Img";
import Avatar from "./Avatar";
import Tile from "./Tile";
import Help from "./Help";

function Image(props) {
  const path = jet.str.to(props.src).split("/");
  const src = path.join("/");
  const kind = path.shift();

  if (kind === "ico") {
    return <Ico {...props} src={src}/>
  } else if (kind === "img") {
    return <Img {...props} src={src}/>
  } else if (kind === "avatar") {
    return <Avatar {...props} src={src}/>
  } else if (kind === "tile") {
    return <Tile {...props} src={src}/>
  } else if (kind === "help") {
    return <Help {...props} src={src}/>
  } else {
    return <Img {...props}/>
  }
}


function Md(props) {
  const { overrides, inView } = props;
  const inject = {inView}

  const pass = {
    ...props,
    overrides:null,
    options: {
      forceBlock: true,
      overrides: {
          a:Link,
          img:{component:Image, props:inject},
          h1:{component:Caption.h1, props:inject},
          h2:{component:Caption.h2, props:inject},
          h3:{component:Caption.h3, props:inject},
          h4:{component:Caption.h4, props:inject},
          h5:{component:Caption.h5, props:inject},
          h6:{component:Caption.h6, props:inject},
          ...overrides
      }
    }
  }

  return <Pack nowrap><Markdown {...pass} /></Pack>;
}



export default Md;
