import jet from "@randajan/jetpack";

import Serf from "../Base/Serf";

class Auth extends Serf {

    constructor(core, path, authPath, providers, sessionUrl, cryptKey) {
        super(core, path);
        const { api, tray, lang } = core;

        this.fit("providers", v=>jet.arr.wrap(v));
        this.fitTo("authPath", "string");
        this.fitType("login", "object");

        this.fitType("passport", "object");

        this.fit("passport", v=>{
             if (!v.access_token) { return {}; }
             v.authorization = [v.token_type, v.access_token].joins(" ");
             return v;
        });

        this.fit(v=>{
            if (!v.user && jet.isEmpty(v.passport)) { v.user = this.storeLocal("user", cryptKey); }
            v.user = jet.get("object", v.user);
            return v;
        });
        

        this.eye("passport.authorization", token=>{
            if (token) {
                setTimeout(_=>
                    tray.watch(
                        this.storeRemote("user", api.getJSON("user"), data=>api.post("user", data))
                            .then(data=>this.set("user", data)), 
                        g=>lang.spell(["core.auth.watch.user", g.state])
                    )
                )
            }
        })

        const set = {
            authPath,
            providers
        }

        if (!sessionUrl) { set.passport = this.storeLocal("passport", cryptKey); }
        else {
            tray.watch(this.storeSession("passport", sessionUrl, cryptKey).then(data=>this.set("passport", data)),
            g=>serf.lang.spell(["core.auth.watch.session", g.state])
            );
        }

        this.set(set);

    }

    async login(provider) {
        const { api, tray, lang } = this.parent;
        return tray.watch(async _=>{
            const data = await api.getJSON(this.get("authPath")+"/"+provider);
            const redirect = jet.obj.get(data, "redirect_uri");
            if (!redirect) { throw new Error("Login failed: Missing redirect link"); }
            await new Promise(_=>window.location = redirect);
        }, g=>lang.spell(["core.auth.watch.login", g.state]));
    }

    logout() { this.push({passport:null, user:null}); }

    async setPassport(code) {
        return this.set("passport", await this.fetchPassport(code));
    }

    async fetchPassport(code) {
        const { api, tray, lang } = this.parent;
        return tray.watch(
            api.postJSON(this.get("authPath")+"/token", api.toForm({ code })), 
            g=>lang.spell(["core.auth.watch.passport", g.state])
        )
    }

    // getMenu() {
    //     const lang = this.Core.Lang;
    //     //if (!this.Tray.isDone()) {return []; }
    //     if (this.User.isReal()) { return [[lang.get("auth.logout"), this.logout.bind(this)]]; }
    //     return this.providers.map(provider=>[lang.get("auth.providers."+provider), _=>this.login(provider)]);
    // }

}


export default Auth;