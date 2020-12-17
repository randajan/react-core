import React, { Component, useContext } from 'react';


import { useInView } from 'react-intersection-observer';

import jet from "@randajan/react-jetpack";

function Custom(props) {
  const Tag = jet.str.to(props.tag) || "div";
  const p = {...props}
  delete p.tag;
  return <Tag {...p} />
}

function InView(props) {
  const { ref, inView } = useInView(jet.get("object", props.inView, {triggerOnce:true}));
  const Tag = jet.str.to(props.tag) || "div";
  const p = {...props, ref, "data-inview":inView}
  delete p.inView;
  delete p.tag
  return <Tag {...p}/>
}

function Observer(props) {
  return props.inView ? <InView {...props}/> : <Custom {...props}/>
}


export default Observer