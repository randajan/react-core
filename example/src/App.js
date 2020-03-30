import React, { Component } from 'react'

import CoreProvider, { useView } from '@randajan/react-app-core'

const coreConfig = {
  debug:true,
  version:"1.0.1",
  cryptKey:"XYZ",
  langFallback:"en",
  langList:["en", "cs", "any"],
  langLibs:[
    {priority:10, list:["cs"], path:"index", fetch:lang=>fetch("/index.html").then(data=>data.text())}, 
  ],
}

function ViewType() {
  const view = useView();
  return <h1>{view.size}</h1>
}

export default class App extends Component {
  render () {
    return (
      <CoreProvider {...coreConfig}>
        <div>Majestic APP</div>
        <ViewType/>
      </CoreProvider>
    )
  }
}
