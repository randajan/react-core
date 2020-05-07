import React from 'react';

import jet from "@randajan/jetpack";

import Core from "./Core";

const IMAGES = [];

class Images {

    constructor(Core, prefix, list) {
        const id = IMAGES.push({})-1;
        prefix = jet.get("string", prefix, "Img");
        list = Images.fetchList(list);

        jet.obj.addProperty(this, {
            Core,
            id,
            prefix,
            list,
        }, null, false, true);

    }

    get(props) {
        const { prefix } = this;
        const { src, className } = props;
        return <img {...props} className={jet.obj.join([prefix, src, className]," ")} src={this.list[src]}/> 
    }

    static create(...args) {
        return new Images(...args);
    }

    static fetchList(list) {
        const nlist = jet.get("object", list);
        if (jet.is("array", list)) {
            list.map(path=>nlist[path.match(/[^\/\s\n\r\.]+(?=\.)/)[0]] = path);
        }
        return nlist;
    }

    static use(...mods) {
        return Core.use("Images", ...mods).Images;
    }

    static useStorage(...mods) {
        return Images.use("Images.Storage", ...mods).Storage;
    }

}

export default Images;