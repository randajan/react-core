import { useEffect } from 'react'
import { withRouter } from "react-router-dom";

import Core from "./CoreProvider";

function PageProvider(props) {
  const { location, history } = props;
  const { pathname, search } = location;

  const page = Core.useSerf("page");
  let update = false;

  //title
  useEffect(_=>page.eye("title", _=> document.title = page.get("title")), []);

  //from base.page
  useEffect(_=>page.eye("path", path=>{
    if (update) { return; }
    update = true;
    history.push(path);
    update = false
  }), []);

  //to base.page
  useEffect(_ =>{
    if (update) { return; }
    update = true;
    page.set({ pathname, search });
    history.replace(page.get("path"));
    update = false;
  }, [pathname, search]);

  return null;

};

export default withRouter(PageProvider);