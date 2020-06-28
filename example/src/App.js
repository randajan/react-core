import React, { Component, useEffect } from 'react'

import { Link } from "react-router-dom";

import jet from "@randajan/jetpack";

import CoreProvider, { Core, Images, Lang, View, Query, Ico, Img, PopUp, Base} from '@randajan/react-app-core';

const coreConfig = {
  //nocache:true,
  debug:true,
  version:"1.0.2",
  cryptKey:"XYZ",
  langFallback:"en",
  langList:["en", "cs", "any"],
  langLibs:[
    {priority:10, list:["cs"], path:"index", fetch:lang=>fetch("/index.html").then(data=>data.text())}, 
  ],
  iconsList:[
    require("./menu.svg")
  ],
  imagesList:[
    require("./menu.svg")
  ],
  apiUrl:"http://api.itcan.dev.itcan.cz",
  authPath:"sauth",
  authProviders:["google"],
  onBuild:Core=>{
    
  },
  onLoad:Provider=>{
    //Provider.Core.addAndRunOnChange(View=>Provider.setState({view:View.size}), "View");
  }
}

function Example() {
  const core = Core.use();
  const query = Core.use("Query");
  const lang = Core.use("Lang");
  const view = Core.use("View");
  
  console.log(Core.useKey("Auth.passport.authorization"));

  //const [foo, setFoo] = Case.useKey("foo", "bar");
  //console.log(foo);

  //useEffect(_=>{setTimeout(_=>setFoo("XDFG"), 5000)});
  
  console.log("RERENDER");
  return (
    <div className="Example">
      <h1>Majestic APP</h1>
      <p>{core.isLoading() ? "Loading" : core.isError() ? "Error" : "Ready"}</p>
      <h2>{jet.react.fetchFlags(view.get("size")).joins(" ")}</h2>
      <h2>{lang.get("now")}</h2>
      <Link to={query.toUri({a:!query.get("a")})}>Add to query</Link>
      <Ico src="menu"/>
      <Ico src="menu"/>
      <Img src="menu"/>
      <Img src="menu"/>
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
