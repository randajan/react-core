import { useEffect } from 'react'
import { withRouter } from "react-router-dom";

import jet from "@randajan/jetpack";

import Core from "./CoreProvider";


function PageProvider({ location, history }) {
  const page = Core.useSerf("page");
  

  useEffect(_=>{
    let f, t;
    const {pathname, search} = location;

    const cleanUp = [
      page.eye("title", _=> document.title = page.get("title")),
      page.eye("path", path=>{
        if (!t) {
          t = true;
          history[f ? "replace" : "push"](path);
          t = false;
        }
      }),
      history.listen(({pathname, search})=>{
        if (!t && !f) {
          f = true;
          page.set({pathname, search});
          f = false;
        }
      })
    ];

    page.set({pathname, search});
    return _=>jet.run(cleanUp);
  }, []);

  return null;

};

export default withRouter(PageProvider);