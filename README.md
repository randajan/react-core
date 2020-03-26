# @randajan/react-app-core

> Pack of core system for react application

[![NPM](https://img.shields.io/npm/v/@randajan/react-app-core.svg)](https://www.npmjs.com/package/@randajan/react-app-core) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @randajan/react-app-core
```


## Usage

```jsx
import React, { Component } from 'react'

import CoreProvider, {useCore} from '@randajan/react-app-core'

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
        <Consumer/>
      </CoreProvider>
    )
  }
}

function Consumer() {
  const Core = useCore(); //or shorthand useUser()
  return <div className="UserName">{Core.Auth.User.get("name")}</div>
}

```

## Provider Props
name | type | default | use
--- | --- | --- | ---
debug | Boolean | false | Will append jet and core to global scope and every onChange event output to console
onChange | Function | undefined | After any change of core state will be called with list of changes
cryptKey | String | undefined | Will be used for crypting and decrypting User data
langLibs | Array || Object | \["en"\] | Define available language packages
langFallback | String | "en" | Define fallback on lang when there is no text in selected lang
langDefault | String | "en" | Default language
viewSizes | Object | * | Define constants for measure inner window size
sessionUrl | String | null | Define path to session storage. If it's not present it will use localStorage
apiUrl | String | null | Define rest api url
authPath | String | null | Define oAuth path for resolve AuthCode
authProviders | String | null | oAuth providers

_*default viewSizes_
```jsx
const DEFAULTSIZES = {
    xs: w=>w<600,
    s: w=>w>600&&w<960,
    m: w=>w>960&&w<1280,
    l: w=>w>1280&&w<1920,
    xl: w=>w>1920,

    gtXs: w=>w>600,
    gtS: w=>w>960,
    gtM: w=>w>1280,

    ltM: w=>w<960,
    ltL: w=>w<1280,
    ltXl: w=>w<1920
}
```



## License

MIT © [randajan](https://github.com/randajan)
