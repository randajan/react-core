import React, { Component, useEffect } from 'react'

import { NavLink } from "react-router-dom";

import jet from "@randajan/jetpack";

import Core, { CoreProvider, Ico, Img, Modal } from '@randajan/react-app-core';


function TrayBar() {
  const tray = Core.use("tray");
  const pop = Modal.usePop();

  console.log("RERENDER TRAY");

  useEffect(_=>{
    if (tray.isError()) {
      pop.up({children:tray.getError().map((v,k)=><p key={k}>{v}</p>)});
    }  
  })

  return (
    <div className="TrayBar">
      {tray.getPending().map((v,k)=><p key={k}>{v}</p>)}
    </div>
  );
}

const coreConfig = {
  //nostore:true,
  debug:true,
  version:"1.0.5",
  cryptKey:"XYZ",
  langDefault:"en",
  langList:["en", "cs"],
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
  atBuild:core=>{
    core.lock("query.fbclid");
  },
  trayBar:<TrayBar/>,
  crashMsg:"Critical error please contact our support info@itcan.cz",
  onBuild:async core=>{

    //title page change
    core.fit("page", next=>{
        const v = next();
        v.title = "TEST APP";
        delete v.search["fbclid"];
        return v;
    })

    //auto authenticate user
    core.fit("page", next=>{
        const page = next();

        if (page.pathname === "/user" && page.search.code) {
            core.auth.setPassport(page.search.code);
            delete page.search.code;
        }
        return page;
    });

    core.eye("page", page=>console.log("EYEPAGE", page));
  }
}

function Example() {
  const api = Core.useApi();

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
          <ShowKey path="tray.pending" />
          <ShowKey path="tray.cancel" />
          <ShowKey path="tray.timeout" />
          <ShowKey path="tray.error" />
          <ShowKey path="tray.result" />
          <ShowKey path="lang.now" />
          <ShowKey path="view" format={k=>jet.react.fetchFlags(k).joins(" ")} />
          <ShowKey path="test.test" />
          <ShowKey path="page.title" />
          <ShowKey path="page.path" />
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
    const core = Core.useSerf();
    console.log("Rerender", path, key, core.get(path));
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
