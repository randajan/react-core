
import React, { useEffect, useState } from 'react';

import jet, { useForceRender } from "@randajan/react-jetpack";

import CoreProvider from "../Components/CoreProvider";

import Base from "../Base/Base";
import Task from "../Base/Task";

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

        jet.run(beforeBuild, this);

        jet.obj.addProperty(this, "api", new Api(apiUrl, _=>this.get("auth.passport.data.authorization")), false, true);

        this.mount(Page, "page");
        this.mount(Lang, "lang", langList, langLibs, this.get("page.lang"), langFallback, langDefault);

        const auth = this.mount(Auth, "auth", authPath, authProviders);
        //if (sessionUrl) { auth.storeAsSession(sessionUrl, cryptKey); } else { auth.set(auth.storeAsLocal(cryptKey)); }

        this.mount(Icons, "icons", iconsList, iconsSize);
        this.mount(Images, "images", imagesList);
        this.mount(Client, "client");
        this.mount(View, "view", viewSizes);

        //const test = this.addTask("test", (echo, timeout)=>new Promise(res=>{setTimeout(_=>res(echo), timeout)}));

        //this.Auth.onChange.add(_=>this.Lang.select(page, this.Auth.User.loadLang()));
        //this.Lang.onChange.add(_=>this.Auth.User.saveLang(this.Lang.now));
    
        jet.run(afterBuild, this);
    }



}

export default Core;