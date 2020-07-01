import React, { Component, useEffect } from 'react'

import { NavLink } from "react-router-dom";

import jet from "@randajan/jetpack";

import Core, { CoreProvider, Images, Lang, View, Query, Ico, Img, PopUp, Base} from '@randajan/react-app-core';

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
  flags:core=>{
    console.log("FLAGS", core);
  },
  iconsList:[
    require("./menu.svg"),
    require("./cart.svg"),
    require("./cash.svg"),
    require("./contact.svg")
  ],
  imagesList:[
    require("./menu.svg")
  ],
  apiUrl:"http://api.itcan.dev.itcan.cz",
  authPath:"sauth",
  authProviders:["google"],
  beforeBuild:core=>{
    core.lock("query.fbclid");
  },
  afterBuild:core=>{

  },
  onLoad:Provider=>{
    //Provider.Core.addAndRunOnChange(View=>Provider.setState({view:View.size}), "View");
  }
}

function Example() {
  console.log("Render", "Example");
  const core = Core.use();

  return (
    <div className="Example">
      <h1>Majestic APP</h1>
      <h2>Test</h2>
      <NavLink to={"/foo?jo=6545"}>Goto Foo</NavLink>
      <br/>
      <NavLink to={"/bar?jo=2"}>Gotot Bar</NavLink>
      <h2>Data</h2>
      <table>
        <thead>
          <tr>
            <th>Path</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Loading</td><td>{jet.obj.toJSON(core.getLoading())}</td></tr>
          <tr><td>Errors</td><td>{jet.obj.toJSON(core.getError())}</td></tr>         
          <ShowKey path="lang.now" />
          <ShowKey path="view" format={k=>jet.react.fetchFlags(k).joins(" ")} />
          <ShowKey path="query" format={jet.obj.toJSON} />
        </tbody>
      </table>
      <h2>Icons</h2>
      <div className={"icons"}>
        <Ico src="menu"/>
        <Ico src="cart"/>
        <Ico src="cash"/>
        <Ico src="contact"/>
      </div>
      <h2>Images</h2>
      <div className={"images"}>
        <Img src="menu"/>
        <Img src="menu"/>
      </div>



    </div>
  )
}

function ShowKey(props) {
    const { path, format } = props;
    const [ key ] = Core.useKey(path);
    console.log("Rerender", path);
    return (<tr><td>{path}</td><td>{jet.is("function", format) ? format(key) : key}</td></tr>)
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
