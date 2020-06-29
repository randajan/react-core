import { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom";

import Core from "../Mods/Core";


function Query(props) {
  const state = useState({way:"push"})[0];
  const { location, history } = props;
  const { search } = location;
  const query = Core.useSerf("Query");

  useEffect(_ => {
    state.way = "replace";
    query.setFromUri(search); 
    state.way = "push";
  }, [search]);

  useEffect(_ => query.eye(_=> history[state.way](query.toUri())), []);
  
  return null;

};

export default withRouter(Query);