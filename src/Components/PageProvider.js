import { useEffect } from 'react'
import { withRouter } from "react-router-dom";

import Core from "./CoreProvider";

import jet from '@randajan/jetpack';

function PageProvider(props) {
  const { location, history } = props;
  const page = Core.useSerf("page");
  window.Xhistory = history;

  useEffect(_ => {
    let update = false

    const updatePage = loc => {
      const { pathname, search } = loc;
      if (!update) {
        update = true;
        page.set({ pathname, search });
        history.replace(page.get("path"));
        update = false
      }
    }

    const cleanUp = [
      history.listen(updatePage),
      core.eye("page.path", _=> {
        if (!update) {
          update = true;
          history.push(page.get("path"));
          update = false
        }
      }),
      core.eye("page.title", _=> {
        document.title = page.get("title")
      })
    ];

    updatePage(location);
    return _ => jet.run(cleanUp);
  }, []);


  return null;

};

export default withRouter(PageProvider);