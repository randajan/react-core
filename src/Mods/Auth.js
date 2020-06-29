import jet from "@randajan/jetpack";

import Serf from "../Base/Serf";

import User from "./User";

class Auth extends Serf {

    constructor(core, path, authPath, providers) {
        super(core, path);

        jet.obj.addProperty(this, {
            Tray:core.open("Tray"),
            Api:core.open("Api"),
            passport:this.addTask("passport", code=>this.Api.POST(authPath+"/token", this.Api.toForm({ code }))),
            login:this.addTask("login", provider=>this.Api.GET(authPath+"/"+provider)),
            user:this.addTask("user", _=>this.Api.GET("/user"), "1h")
        }, null, false, true)

        this.fit("providers", v=>jet.arr.wrap(v));
        this.fitTo("authPath", "string");
        this.fitType("login", "object");

        this.fitType("passport.data", "object");
        this.fitType("login.data", "object");
        this.fitType("user.data", "object");

        this.fit("passport.data", v=>{
             if (!v.access_token) { return {}; }
             v.authorization = [v.token_type, v.access_token].joins(" ");
             return v;
        });

        this.eye("login.data.redirect_uri", r=>window.location=r);

        this.set({
            authPath,
            providers,
            passport:this.passport.linkLocal(),
            user:this.user.linkLocal()
        });

    }

    logout() { this.push({passport:null, user:null}) }

    getMenu() {
        const lang = this.Core.Lang;
        if (!this.Tray.isDone()) {return []; }
        if (this.User.isReal()) { return [[lang.get("auth.logout"), this.logout.bind(this)]]; }
        return this.providers.map(provider=>[lang.get("auth.providers."+provider), _=>this.login(provider)]);
    }

}


export default Auth;