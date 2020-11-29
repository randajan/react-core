import React from 'react';


import jet from "@randajan/react-jetpack";

import Core from "./CoreProvider";

import Markdown from "./Markdown";

import { css } from "@randajan/react-popup";

const cn = css.open();

function Article(props) {
  const lang = Core.use("lang");
  const { src, className } = props;

  const pass = {
    ...props,
    src:null,
    className:cn.get("Article", className),
    children:jet.str.to(lang.spell(src)),
  }

  return <Markdown {...pass} />;
}



export default Article;
