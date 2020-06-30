import { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom";

import Core from "../Mods/Core";
import Query from "../Mods/Query";
import jet from '@randajan/jetpack';


function QueryProvider(props) {
  const { location, history } = props;
  const query = Core.useSerf("query");

  useEffect(_=>{
    const search = {from:""};

    const updateQuery = loc=>{
      search.to = loc.search;
      if (search.from !== search.to) {
        query.setFromUri(search.to);
        search.from = search.to;
        history.replace(query.toUri());
      }  
    }

    const cleanUp = [
      history.listen(updateQuery),
      query.eye(data=>{ if (search.from === search.to) { history.push(Query.toUri(data));} })
    ];

    updateQuery(location);
    return _=>jet.run(cleanUp);
  }, []);

  
  return null;

};

export default withRouter(QueryProvider);