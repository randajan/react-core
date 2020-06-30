import React from 'react'

import Core from "../Mods/Core";

function IcoDefs() {
    const icons = Core.useSerf("icons");
    const straps = jet.get("object", Core.useVal("icons.straps.data"));
    const viewBox = Core.useVal("icons.viewBox");
    const selfProps = {
        xmlns:'http://www.w3.org/2000/svg',
        xmlnsXlink:'http://www.w3.org/1999/xlink',
        viewBox,
        style:{display:"none"}
    }
    
    return (
        <svg {...selfProps}>
            <defs children={Object.entries(straps).map(([src, __html])=>{
                if (!__html) { return; }
                return <symbol key={src} id={icons.getId(src)} viewBox={viewBox} dangerouslySetInnerHTML={{__html}}/>
            })}/>
        </svg>
    );
}

export default IcoDefs;
