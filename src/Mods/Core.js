
import React, { useEffect, useState } from 'react';

import jet, { useForceRender } from "@randajan/react-jetpack";

import Provider from "../Components/Provider";

import Base from "../Helpers/Base";

import Query from "./Query";
import View from "./View";
import Lang from "./Lang";
import Api from "./Api";
import Auth from "./Auth";
import Icons from "./Icons";
import Images from "./Images";


const PRIVATE = [];

class Core extends Base {

    static create(props) { return PRIVATE[0] || new Core(props); }
    
    static useEye(path) {
        const core = Provider.use().Core;
        const rerender = useForceRender();
        useEffect(_=>core.eye(path, rerender), []);
        return core;
    }

    static useSerf(path, ...args) {
        return Provider.use().Core.open(path, ...args);
    }

    static useKey(path) {
        return Core.useEye(path).get(path);
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
            onBuild, cryptKey, viewSizes, sessionUrl, apiUrl, 
            langList, langLibs, langFallback, langDefault, 
            authPath, authProviders, 
            iconsList, iconsSize,
            imagesList,
        } = props;

        super(version, nocache, debug);

        PRIVATE.push(this);
        if (debug) { window.jet = jet; window.Base = Base; window.Core = this; }

        this.mount(Query, "Query");
        this.mount(Api, "Api", apiUrl, _=>this.get("Auth.passport.data.authorization"));
        this.mount(Lang, "Lang", langList, langLibs, this.get("Query.lang"), langFallback, langDefault);

        const auth = this.mount(Auth, "Auth", authPath, authProviders);
        //if (sessionUrl) { auth.storeAsSession(sessionUrl, cryptKey); } else { auth.set(auth.storeAsLocal(cryptKey)); }

        this.mount(Icons, "Icons", iconsList, iconsSize);
        this.mount(Images, "Images", imagesList);
        this.mount(View, "View", viewSizes);

        //const test = this.addTask("test", (echo, timeout)=>new Promise(res=>{setTimeout(_=>res(echo), timeout)}));

        //this.Auth.onChange.add(_=>this.Lang.select(query, this.Auth.User.loadLang()));
        //this.Lang.onChange.add(_=>this.Auth.User.saveLang(this.Lang.now));
    
        jet.run(onBuild, this);
    }


}

export default Core;