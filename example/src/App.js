import React, { Component } from 'react'

import CoreProvider, { useView } from '@randajan/react-app-core'

const coreConfig = {
  debug:true,
  version:"1.0.0.0",
  cryptKey:"XYZ",
  langFallback:"en",
  langList:["en", "cs", "any"],
  langLibs:[
    {priority:10, list:["en", "cs", "any"], fetch:lang=>fetch("/"+lang+".json").then(data=>data.json())}, 
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
