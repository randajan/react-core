
import React from "react";

import { Helmet } from "react-helmet";

import Core from "../Mods/Core";

function Lang() {
    const [ lang ] = Core.useKey("lang.now");
    return (
        <Helmet htmlAttributes={{ lang }}>
            <meta http-equiv="Content-language" content={lang} />
        </Helmet>
    )
};

export default Lang;

