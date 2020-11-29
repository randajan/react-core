import React, { Component, useContext } from 'react';

import jet from "@randajan/react-jetpack";

const Context = React.createContext();

class Pack extends Component {

  static Context = Context;

  static use() { return useContext(Context); }

  static useCaption() {
    const nest = Pack.use();
    return nest ? nest.regCaption() : 1;
  }

  static contextType = Context;

  level = 0;
  captions = 0;

  hasCaptions() {
    return jet.to("boolean", this.captions);
  }

  getLevel() {
    const above = this.context;
    return above ? above.getLevel() + this.hasCaptions() : 0;
  }

  regCaption() {
    this.captions ++;
    return this.getLevel() + 1;
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