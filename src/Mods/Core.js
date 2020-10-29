
import jet from "@randajan/react-jetpack";

import Base from "../Base/Base";
import Api from "../Base/Api";

import Tray from "./Tray";
import Analytics from "./Analytics";
import Page from "./Page";
import Screen from "./Screen";
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
            version, debug, atBuild, onBuild, crashMsg,
            cryptKey, screenSizes, sessionUrl, apiUrl, 
            langList, langLibs, langDefault, 
            authPath, authProviders, 
            iconsList, iconsSize,
            imagesList,
            analyticTag
        } = props;

        super(version, debug);

        PRIVATE.push(this);
        if (debug) { window.jet = jet; window.core = this; }

        jet.run(atBuild, this);

        this.modMount("analytics", Analytics, analyticTag, debug);
        this.modMount("tray", Tray);
        this.modMount("page", Page);

        jet.obj.addProperty(this, "build", this.tray.watch(
            async _=>{
                this.mod("api", new Api(apiUrl, _=>this.get("auth.passport.authorization")));
                
                await this.modMount("lang", Lang, langLibs, langList, langDefault).build;
                this.eye("auth.user.lang", lang=>this.set("lang.now", lang));

                await Promise.all([
                    this.modMount("auth", Auth, authPath, authProviders, sessionUrl, cryptKey).build,
                    this.modMount("icons", Icons, iconsList, iconsSize).build,
                    this.modMount("images", Images, imagesList),
                    this.modMount("screen", Screen, screenSizes),
                    this.modMount("client", Client),
                ]);
                this.eye("lang.now", lang=>this.set("auth.user.lang", lang));
        
                await jet.to("promise", onBuild, this);
            }, 
            {
                result:eng=>"Loaded in "+eng.timein+"ms",
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