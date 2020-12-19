import React from 'react';

import Markdown from "markdown-to-jsx";

import jet from "@randajan/react-jetpack";

import Link from "./Link";
import Caption from "./Caption";
import Ico from "./Ico";
import Img from "./Img";
import Avatar from "./Avatar";
import Tile from "./Tile";
import Help from "./Help";

function Gal(props) {
  const path = jet.str.to(props.src).split("/");
  const kind = path.shift();
  const title = props.alt;
  const src = path.join("/");

  if (kind === "ico") {
    return <Ico {...props} title={title} src={src}/>
  } else if (kind === "img") {
    return <Img {...props} title={title} src={src}/>
  } else if (kind === "avatar") {
    return <Avatar {...props} title={title} src={src}/>
  } else if (kind === "tile") {
    return <Tile {...props} title={title} src={src}/>
  } else if (kind === "help") {
    return <Help {...props} title={title} src={src}/>
  } else {
    return <Img {...props} title={title} />
  }
}


function Md(props) {
  const { overrides, inView } = props;
  const inject = { inView }

  const pass = {
    ...props,
    overrides:null,
    inView:null,
    options: {
      forceBlock: true,
      overrides: {
          a:Link,
          img:{component:Gal, props:inject},
          h1:Caption.h1,
          h2:Caption.h2,
          h3:Caption.h3,
          h4:Caption.h4,
          h5:Caption.h5,
          h6:Caption.h6,
          ...overrides
      }
    }
  }

  return <Markdown {...pass} />;
}



export default Md;
