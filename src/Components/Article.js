import React from 'react';

import Markdown from "markdown-to-jsx";

import jet from "@randajan/react-jetpack";

import Core from "./CoreProvider";

import Graphic from "./Graphic";
import Link from "./Link";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Article(props) {
  const lang = Core.use("lang");
  const { id, src, className, overrides } = props;

  const pass = {
    ...props,
    overrides:null,
    src:null,
    id:id||jet.get("string", src).split(".").join("-"),
    className:cn.get("Article", className),
    children:jet.str.to(lang.spell(src)),
    options: {
      forceBlock: true,
      overrides: {
          a: Link,
          img: Graphic,
          ...overrides
      }
    }
  }

  return <Markdown {...pass} />;
}



export default Article
