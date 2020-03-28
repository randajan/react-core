# @randajan/react-app-core

> Pack of core system for react application

[![NPM](https://img.shields.io/npm/v/@randajan/react-app-core.svg)](https://www.npmjs.com/package/@randajan/react-app-core) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @randajan/react-app-core
```

## About
I'm not exepcting that anyone will reach this page or even try this package. But i love javascript and it was challange and fun to create this.

This package easily can:
 - Get, add, remove keys in query string
 - Store data
 - Reach browser data
 - Setup Rest Api
 - Authorize OAuth user
 - Manage languages

Maybe later I will break it into the small standalone libraries, but now it's just about to kill two birds with one stone

## Example

```jsx
import React, { Component } from 'react'

import CoreProvider, {useCore} from '@randajan/react-app-core'

const langLibs = [
    {
      priority:10,
      list:["en", "cs", "any"],
      fetch:lang=>fetch("/"+lang+".json").then(data=>data.json())
    },
];

const viewSizes = {
  xxs:(weight, height) => weight <= 500 && height < 100
}

const coreConfig = {
  version:"1.0.0.0",
  debug:true,
  onChange:_=>alert(_),
  cryptKey:"XYZ",
  langList:["de", "en"],
  langLibs
  langFallback:"en",
  langDefault:"en",
  viewSizes,
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

## Core Props
name | type | default | use
--- | --- | --- | ---
version | String | - | Version will be stored with other cached data. If there will be mismatch cached data will be forgotten
debug | Boolean | false | Will append jet and core to global scope and every onChange event output to console
onChange | Function | - | After any change of core state will be called with list of changes
cryptKey | String | - | Will be used for crypting and decrypting User data
langList | Array \|\| Object | \["en"\] | Define available languages. It will auto include langFallback and langDefault
langLibs | Array | * | Define lang ibrary for fetch lang when it's selected
langFallback | String | "en" \|\| first in langList | Define fallback on lang when there is no text in selected lang
langDefault | String | first in langList | Default language
viewSizes | Object | */ | Define constants for measure inner window size
sessionUrl | String | - | Define path to session storage. If it's not present it will use localStorage
apiUrl | String | - | Define rest api url
authPath | String | - | Define oAuth path for resolve AuthCode
authProviders | String | - | oAuth providers

_**default langLibs:_
```jsx
{
  priority:-1,
  path:"",
  list:["cs", "en", "de"],
  fetch:lang => require("./lang/"+lang).default)
}
```



_**default viewSizes:_
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

## Initial Core modules
name | parent | purpose | 3rd scripts
--- | --- | --- | --- 
Tray | Core | Handle and log every Core Task such as initialization process, loading modules, login user and selecting lang | -
Query | Core | Handle query string and backpropagate changes to url | __query-string__
Crypt | Core | Take care of crypting and decrypting everything | __crypt-js__
View | Core | Collecting information about client and window size | __react-device-detect__
Storage | Core | Saving and loading localStorage data | -
Session | Core | Saving and loading sensitive data | -
Auth | Core | Manage Users and authorization via oauth | -
User | Auth | Keep user profile | -
Api | Core | Shorthand for fetching data from Rest Api | -
Lang | Core | Responsible for select language, fetch external lang libraries and provide right text | __moment__
PopUp | Core | Handling PopUp windows | __@randajan/react-popup__

_*every script uses @randajan/jetpack_

## Exports
```jsx
export default Core;
export {
  Tray,
  Task,
  Query,
  Crypt,
  Storage,
  Session,
  useCore,
  usePopUp,
  useCrypt,
  useView,
  useStorage,
  useSession,
  useLang,
  useApi,
  useAuth,
  useUser
}
```


## License

MIT © [randajan](https://github.com/randajan)
