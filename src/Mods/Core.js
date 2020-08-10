
import jet from "@randajan/react-jetpack";

import Base from "../Base/Base";
import Api from "../Base/Api";

import Tray from "./Tray";
import Page from "./Page";
import View from "./View";
import Client from "./Client";
import Lang from "./Lang";
import Auth from "./Auth";
import Icons from "./Icons";
import Images from "./Images";


const PRIVATE = [];

class Core extends Base {

    static create(props) { return PRIVATE[0] || new Core(props); }

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
            version, nostore, debug, atBuild, onBuild, crashMsg,
            cryptKey, viewSizes, sessionUrl, apiUrl, 
            langList, langLibs, langDefault, 
            authPath, authProviders, 
            iconsList, iconsSize,
            imagesList,
        } = props;

        super(version, nostore, debug);

        PRIVATE.push(this);
        if (debug) { window.jet = jet; window.core = this; }

        jet.run(atBuild, this);

        this.modMount("tray", Tray);

        jet.obj.addProperty(this, "build", this.tray.watch(
            async _=>{
                this.mod("api", new Api(apiUrl, _=>this.get("auth.passport.authorization")));
                
                await this.modMount("lang", Lang, langLibs, langList, langDefault).build;
                this.eye("auth.user.lang", lang=>this.set("lang.now", lang));

                await Promise.all([
                    this.modMount("auth", Auth, authPath, authProviders, sessionUrl, cryptKey).build,
                    this.modMount("icons", Icons, iconsList, iconsSize).build,
                    this.modMount("images", Images, imagesList),
                    this.modMount("view", View, viewSizes),
                    this.modMount("client", Client),
                    this.modMount("page", Page),
                ]);
                this.eye("lang.now", lang=>this.set("auth.user.lang", lang));
        
                await jet.to("promise", onBuild, this);
            }, 
            {
                running:"...",
                error:crashMsg
            }
        ));

    }

    mod(path, mod) {
        jet.obj.addProperty(this, path, mod, false, true);
        return mod;
    }

    modMount(path, ...args) {
        return this.mod(path, this.mount(path, ...args));
    }

}

export default Core;