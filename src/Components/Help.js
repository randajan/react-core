import React from 'react';

import { Modal } from "@randajan/react-popup";

import Ico from "./Ico";

function Help(props) {
  const { children } = props;
  const pop = Modal.usePop({children});

  return <Ico src="help" onClick={_=>pop.up()}/>
}

export default Help;
