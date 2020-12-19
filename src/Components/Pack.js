import React, { Component, useContext } from 'react';

import Observer from "./Observer";

import jet from "@randajan/react-jetpack";

const Context = React.createContext();
let rtsk;

class Pack extends Component {

  static Context = Context;
  static contextType = Context;
  static captions = [];
  static packs = [];

  static use() { return useContext(Context); }

  static selectCaptions() {
    return document.querySelectorAll(".Caption");
  }

  static redraw() {
    Object.entries(Pack.selectCaptions()).map(([i, ele])=>ele.sourceIndex = i);
    Pack.captions = Pack.captions.sort((a, b)=>a.body.sourceIndex - b.body.sourceIndex);
    Pack.packs.map(p=>p.flush());
    Pack.captions.map(c=>c.forceUpdate());
  }

  static redrawTask() {
    clearTimeout(rtsk);
    rtsk = setTimeout(Pack.redraw);
  }

  static regCaption(caption) {
    const { captions } = Pack;
    let x = captions.indexOf(caption);
    if (x >= 0) { return; }
    captions.push(caption);
    Pack.redrawTask();
  }

  static remCaption(caption) {
    const { captions } = Pack;
    const x = captions.indexOf(caption);
    if (x < 0) { return; }
    this.captions.splice(x, 1)
    Pack.redrawTask();
  }

  constructor(props) {
    super(props);
    this.id = Pack.packs.push(this)-1;
    this.flush();
  }

  flush() {
    this.captions = [];
  }

  hasCaptions() {
    return !!this.captions.length;
  }

  hasCaption(caption) {
    return this.captions.includes(caption);
  }

  regCaption(caption, offer) {
    const { context, captions, props } = this;
    if (captions.includes(caption)) { return true; }
    if (offer && captions.length) { return false; }
    if (!props.sandbox && context && context.regCaption(caption, true)) { return true; }
    captions.push(caption);
    return true;
  }

  getLevel() {
    const { context, props } = this;
    return jet.num.to(props.level) + (!props.sandbox && context) ? context.getLevel() + this.hasCaptions() : 0;
  }

  render() {
    const { props } = this;
    return (
      <Context.Provider value={this}>
        {props.notag ? props.children : <Observer {...props} sandbox={null} level={null}/>}
      </Context.Provider>
    )
  }
}

["p", "div", "pre", "section", "header", "footer", "main", "nav", "table", "li", "ul"].map(tag=>{
  Pack[tag] = props=><Pack {...props} tag={tag}/>
});


export default Pack;