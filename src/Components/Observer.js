import React, { useState } from 'react';


import { useInView } from 'react-intersection-observer';

import jet from "@randajan/react-jetpack";

function Custom(props) {
  const Tag = jet.str.to(props.tag) || "div";
  const p = {...props}
  delete p.tag;
  return <Tag {...p} />
}

function InView(props) {
  const [ state ] = useState({last:false, count:0});
  const { ref, inView } = useInView(jet.obj.tap(props.inView));
  const Tag = jet.str.to(props.tag) || "div";
  const p = {...props, ref}
  
  if (inView && !state.last) { state.count ++; }
  if (inView) { p["data-inview"] = state.count; }

  delete p.inView;
  delete p.tag
  return <Tag {...p}/>
}

function Observer(props) {
  return props.inView ? <InView {...props}/> : <Custom {...props}/>
}


export default Observer