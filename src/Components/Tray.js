import React, { useEffect } from 'react'

import { css, Modal } from "@randajan/react-popup";

import Core from "../Mods/Core";


function Tray(props) {
  const tray = Core.use("tray");
  const pop = Modal.usePop({lock:true, children:"Loading..."});

  useEffect(_=>{
    const pending = tray.get("pending");
    if (tray.isPending()) {
      pop.up(<div>{jet.obj.melt(pending, "\n")}</div>);
    } else {
      pop.down();
    }
  })
  
  return ( null )
}

export default Tray;
