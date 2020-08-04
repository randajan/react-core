
import jet from "@randajan/react-jetpack";

import Base from "../Base/Base";
import Api from "../Base/Api";

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
            version, nostore, debug, onBuild, onInit, crashMsg,
            cryptKey, viewSizes, sessionUrl, apiUrl, 
            langList, langLibs, langDefault, 
            authPath, authProviders, 
            iconsList, iconsSize,
            imagesList,
        } = props;

        super(version, nostore, debug);

        PRIVATE.push(this);
        if (debug) { window.jet = jet; window.core = this; }

        jet.run(onBuild, this);
    
        jet.obj.addProperty(this, "build", this.tray.watch(
            async _=>{
                this.mod("api", new Api(apiUrl, _=>this.get("auth.passport.authorization")));

                await this.modMount(Lang, "lang", langLibs, langList, langDefault).build;
                await Promise.all([
                    this.modMount(Auth, "auth", authPath, authProviders, sessionUrl, cryptKey).build,
                    this.modMount(Icons, "icons", iconsList, iconsSize).build,
                    this.modMount(Images, "images", imagesList),
                    this.modMount(View, "view", viewSizes),
                    this.modMount(Client, "client"),
                    this.modMount(Page, "page"),
                ]);
        
                this.eye("auth.user.lang", lang=>this.set("lang.now", lang));
                this.eye("lang.now", lang=>this.set("auth.user.lang", lang));
        
                //lang from page.search this.get("page.search.lang")
                jet.run(onInit, this);
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

    modMount(proto, path, ...args) {
        return this.mod(path, this.mount(proto, path, ...args));
    }

}

export default Core;