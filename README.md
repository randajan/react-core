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
  nocache:true,
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
  iconsPrefix:"ico",
  iconsList:{user:require("user.svg")},
  iconsSize:24
  anonymUser:{name:"Ishtvan"}
}

import CoreProvider, { useLang, useUser, Ico } from "@randajan/react-app-core";

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
  const Lang = useLang();
  const User = useUser();

  return (
    <div className="User">
      <Ico src="user" className="avatar" title="User"/>
      <p className="label">{Lang.get("auth.anonym")}</p>
      <p className="name">{User.get("name")}</p>
    </div>
  )
}

```

## Core Props
name | type | default | use
--- | --- | --- | ---
version | String | - | Version will be stored with other cached data. If there will be mismatch cached data will be forgotten
nocache | Boolean | false | On true will not store any data in localStorage. Great for development purpose
debug | Boolean | false | Will append jet and core to global scope and every onChange event output to console
onChange | Function | - | After any change of core state will be called with list of changes
onBuild | Function | - | Run after initial build
cryptKey | String | - | Will be used for crypting and decrypting User data
langList | Array \|\| Object | \["en"\] | Define available languages. It will auto include langFallback and langDefault
langLibs | Array | * | Define lang ibrary for fetch lang when it's selected
langFallback | String | "en" \|\| first in langList | Define fallback on lang when there is no text in selected lang
langDefault | String | first in langList | Default language
viewSizes | Object | ** | Define constants for measure inner window size
sessionUrl | String | - | Define path to session storage. If it's not present it will use localStorage
apiUrl | String | - | Define rest api url
authPath | String | - | Define oAuth path for resolve AuthCode
authProviders | Array | - | oAuth providers
anonymUser | Object | - | Anonym user profile
iconsPrefix | String | Ico | SVG icons prefix is used as default classname of all icons
iconsList | Object \|\| Array | - | path to all used SVG icons {icon_className:icon_file}
iconsSize | Number | 24 | viewBox of all SVG icons. Every used icon must be same size!
imagesPrefix | String | Img | images prefix is used as default classname of all icons
imagesList | Object \|\| Array | - | path to all used images {image_className:image_file}
addProps | Function | - | First argument is function which calling Core.regOnChange(onChange, ...modules)

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
    xs: w=>w<=600,
    s: w=>w>600&&w<=960,
    m: w=>w>960&&w<=1280,
    l: w=>w>1280&&w<=1920,
    xl: w=>w>1920,

    gtXs: w=>w>600,
    gtS: w=>w>960,
    gtM: w=>w>1280,

    ltM: w=>w<=960,
    ltL: w=>w<=1280,
    ltXl: w=>w<=1920
}

```

## Initial Core modules
name | parent | purpose | 3rd scripts
--- | --- | --- | --- 
Core | - | Container for everything | __Helmet__
Tray | Core | Handle and log every Core Task such as initialization process, loading modules, login user and selecting lang | -
Page | Core | Collecting information about page like path, title, query, hash | __query-string__
Crypt | - | Take care of crypting and decrypting everything | __crypt-js__
Screen | Core | Collecting information about screen size | -
Client | Core | Collecting information about client | __react-device-detect__
Auth | Core | Manage Users and authorization via oauth | -
User | Auth | Keep user profile | -
Api | Core | Shorthand for fetching data from Rest Api | -
Lang | Core | Responsible for select language, fetch external lang libraries and provide right text | __moment__
Icons | Core | Fetch and cache svg icons
Images | Core | Fetch images

_*every script uses @randajan/react-jetpack_

## Exports
```jsx
export default CoreProvider;
export {
  jet,
  css,

  Base,
  Serf,

  Api,
  Auth,
  Core,
  Icons,
  Images,
  Lang,
  Page,
  Screen,

  Crypt,
  LangLib,

  Ico,
  Img,
  CoreProvider,

  ModalProvider,
  Modal,
  PopUp,
  Pop

}

```


## License

MIT © [randajan](https://github.com/randajan)
