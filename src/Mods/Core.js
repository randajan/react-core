
import React, { useEffect, useState } from 'react';

import jet, { useForceRender } from "@randajan/react-jetpack";

import CoreProvider from "../Components/CoreProvider";

import Base from "../Base/Base";
import Serf from "../Base/Serf";

import Page from "./Page";
import View from "./View";
import Client from "./Client";
import Lang from "./Lang";
import Api from "./Api";
import Auth from "./Auth";
import Icons from "./Icons";
import Images from "./Images";


const PRIVATE = [];

class Core extends Base {

    static create(props) { return PRIVATE[0] || new Core(props); }
    
    static useEye(path) {
        const core = CoreProvider.use().core;
        const rerender = useForceRender();
        useEffect(_=>core.eye(path, rerender), []);
        return core;
    }

    static useSerf(path, ...args) {
        return CoreProvider.use().core.open(path, ...args);
    }

    static useVal(path) {
        const core = Core.useEye(path);
        return core.get(path);
    }

    static useKey(path) {
        const core = Core.useEye(path);
        return [core.get(path), value=>core.set(path, value)];
    }

    static useMethod(path, method) {
        const serf = Core.useSerf(path);
        if (!jet.is("function", serf[method])) { throw new Error("Method '"+method+"' at path '"+path+"' was not found.") }
        return serf[method].bind(serf);
    }

    static useApi() {
        return Core.useSerf().api;
    }

    static use(path, ...args) {
        return Core.useEye(path).open(path, ...args);
    }

    static fetchFiles(files) {
        const nfiles = jet.get("object", files);
        if (jet.is("array", files)) {
            files.map(path=>nfiles[path.match(/[^\/\s\n\r\.]+(?=\.)/)[0]] = path);
        }
        return nfiles;
    }

    constructor(props) {
        if (jet.isFull(PRIVATE)) { throw new Error("There could be just one instance of Core"); }

        const { 
            version, nocache, debug, 
            beforeBuild, afterBuild, 
            cryptKey, viewSizes, sessionUrl, apiUrl, 
            langList, langLibs, langFallback, langDefault, 
            authPath, authProviders, 
            iconsList, iconsSize,
            imagesList,
        } = props;

        super(version, nocache, debug);

        PRIVATE.push(this);
        if (debug) { window.jet = jet; window.core = this; }

        this.eye("auth.user.lang", lang=>this.set("lang.now", lang));
        this.eye("lang.now", lang=>this.set("auth.user.lang", lang));

        jet.run(beforeBuild, this);

        this.mod("api", new Api(apiUrl, _=>this.get("auth.passport.authorization")));

        this.modMount(Page, "page");

        this.modMount(Lang, "lang", langList, langLibs, this.get("page.search.lang"), langFallback, langDefault)

        this.modMount(Auth, "auth", authPath, authProviders, sessionUrl, cryptKey);

        this.modMount(Icons, "icons", iconsList, iconsSize);
        this.modMount(Images, "images", imagesList);
        this.modMount(Client, "client");
        this.modMount(View, "view", viewSizes);
    
        jet.run(afterBuild, this);
    }

    mod(path, mod) {
        jet.obj.addProperty(this, path, mod, false, true);
        return mod;
    }

    modMount(proto, path, ...args) {
        return this.mod(path, this.mount(proto, path, ...args));
    }

}

export default Core;