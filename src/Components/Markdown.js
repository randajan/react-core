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
          div:Pack,
          h1:Caption,
          h2:Caption,
          h3:Caption,
          h4:Caption,
          h5:Caption,
          h6:Caption,
          ...overrides
      }
    }
  }

  return <Markdown {...pass} />;
}



export default Md;
