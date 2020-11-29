import React from 'react';

import Markdown from "markdown-to-jsx";

import jet from "@randajan/react-jetpack";

import Graphic from "./Graphic";
import Link from "./Link";
import Caption from "./Caption";
import Pack from "./Pack";


function Md(props) {
  const { overrides } = props;

  const pass = {
    ...props,
    overrides:null,
    options: {
      forceBlock: true,
      overrides: {
          a:Link,
          img:Graphic,
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

  return <Pack nowrap><Markdown {...pass} /></Pack>;
}



export default Md;
