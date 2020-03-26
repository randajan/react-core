import React, { Component } from 'react'

import CoreProvider from '@randajan/react-app-core'

const coreConfig = {
  debug:true,

  cryptKey:"none",
  langDefault:"en",
  langLibs:["en"],
}

export default class App extends Component {
  render () {
    return (
      <CoreProvider {...coreConfig}>
        <div>Majestic APP</div>
      </CoreProvider>
    )
  }
}
