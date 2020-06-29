import { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom";

import Core from "../Mods/Core";


function Query(props) {
  const change = useState({})[0];
  const { location, history } = props;
  const { search } = location;
  const query = Core.useSerf("Query");

  //route change
  useEffect(_ => {
    change.route = true;
    query.setFromUri(search);
    history.replace(query.toUri());
    change.route = false;
  }, [search]);

  //core change
  useEffect(_ => query.eye(_=>{
    if (!change.route) { history.push(query.toUri()); }
  }), []);
  
  return null;

};

export default withRouter(Query);