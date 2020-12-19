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

  const md = {
    options: {
      overrides: {
          a:Link,
          p:{component:Pack.p, props:inject},
          img:{component:Gal, props:inject},
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

  return <Pack {...props} overrides={null}><Markdown {...md} /></Pack>;
}



export default Md;
