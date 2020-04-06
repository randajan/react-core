import React, { Component } from 'react'

import CoreProvider, { useCore, useView, useQuery, Ico } from '@randajan/react-app-core';

const coreConfig = {
  nocache:true,
  debug:true,
  version:"1.0.1",
  cryptKey:"XYZ",
  langFallback:"en",
  langList:["en", "cs", "any"],
  langLibs:[
    {priority:10, list:["cs"], path:"index", fetch:lang=>fetch("/index.html").then(data=>data.text())}, 
  ],
  iconsList:[
    require("./menu.svg")
  ],
  addProps:add=>add(View=>({view:View.size}), "View")
}

function Example() {
  const Query = useQuery();
  console.log("RENDER");
  
  return (
    <div className="Example">
      <h1>Majestic APP</h1>
      <h2>{useView().size}</h2>
      <a onClick={_=>Query.set("test", !Query.get("test") ? true : undefined)}>Add to query</a>
      <Ico id="menu"/>
    </div>
  )
    

}

export default class App extends Component {
  render () {
    return (
      <CoreProvider className="App" {...coreConfig}>
        <Example/>
      </CoreProvider>
    )
  }
}
