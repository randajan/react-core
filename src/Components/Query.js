import { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom";

import Core from "../Mods/Core";


function Query(props) {
  const state = useState({hard:false})[0];
  const { location, history } = props;
  const { search } = location;
  const query = Core.useSerf("Query");

  useEffect(_ => {
    state.hard = true; 
    query.setFromUri(search); 
    state.hard = false;
  }, [search]);

  useEffect(_ => query.eye(to => {
    to = query.toUri(to);
    if (state.hard) { history.replace(to); } else { history.push(to); }
  }), []);
  
  return null;

};

export default withRouter(Query);