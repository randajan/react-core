import React, { Component, useContext } from 'react';

import jet from "@randajan/react-jetpack";

const Context = React.createContext();

class Pack extends Component {

  static Context = Context;

  static use() { return useContext(Context); }

  static contextType = Context;

  captions = new Set();

  hasCaptions() { return !!this.captions.size; }

  getLevel() {
    return this.context ? this.context.getLevel() + this.hasCaptions() : 0;
  }

  addCaption(caption) {
    const { captions, context } = this;
    if (context && !context.hasCaptions()) { return context.addCaption(caption); }
    captions.add(caption);
    return this.getLevel();
  }

  remCaption(caption) {
    const { captions, context } = this;
    if (!captions.delete(caption) && context) { context.remCaption(caption); }
  }

  render() {
    const Tag = this.props.tag || "div";

    return (
      <Context.Provider value={this}>
        {this.props.nowrap ? this.props.children : <Tag {...this.props} tag={null} ref={body=>this.body=body}/>}
      </Context.Provider>
    )
  }
}

["p", "div", "pre", "section", "header", "footer", "main", "nav", "table", "li", "ul"].map(tag=>{
  Pack[tag] = props=><Pack {...props} tag={tag}/>
});


export default Pack;