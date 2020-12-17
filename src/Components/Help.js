import React from 'react';

import { Modal } from "@randajan/react-popup";

import Ico from "./Ico";

function Help(props) {
  const { children, title, src } = props;
  const pop = Modal.usePop({children:children||title});

  return <Ico {...props} src={src||"help"} onClick={_=>pop.up()}/>
}

export default Help;
