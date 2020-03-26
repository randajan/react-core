import React, { Component } from 'react'

import CoreProvider from '@randajan/react-app-core'

coreConfig = {
  debug:true,
  onChange:_=>alert(_),
  cryptKey:"XYZ",
  langDefault:"en",
  langLibs:["en"],
  viewSizes:{"xxs":(weight, height) => weight < 100 && height < 100},
  sessionUrl:"/session",
  apiUrl:"http://api.example.com",
  authPath:"/auth",
  authProviders:["google", "facebook"]
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
