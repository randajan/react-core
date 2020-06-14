import jet from "@randajan/jetpack";

import Core from "./Core";
import User from "./User";

class Auth {

    constructor(Storage, path, providers, anonymUser, onChange) {
        let _user;
        
        jet.obj.addProperty(this, {
            Storage,
            path:jet.get("string", path),
            providers:jet.arr.wrap(providers),
            onChange:new jet.RunPool(this),
        }, null, false, true);

        this.onChange.add(onChange);

        Object.defineProperty(this, "User", {
            enumerable:true,
            set:function(profile) {
                _user = User.create(this, profile);
                this.onChange.run();
            },
            get:function() {return _user;}
        });

        this.setAnonymUser(anonymUser);

        this.logout();
    }

    isReady() {return this.Core.isReady();}
    isLoading() {return this.Core.isLoading();}

    validateProvider(provider) {return this.providers.includes(provider);}
    validatePassport(authorization) {return !!jet.obj.get(authorization, "access_token");}

    getPassport() { return this.Session ? jet.get("object", this.Session.get("passport")) : {}; }
    setPassport(pass) {return this.Session ? this.Session.set("passport", this.validatePassport(pass) ? pass : {}) : false }

    getAccessToken(withType) {
        const {token_type, access_token} = this.getPassport();
        return access_token ? withType ? [token_type, access_token].join(" ") : access_token : "";
    }

    setAnonymUser(profile, force) {return this.Storage.push("users.0.profile", jet.get("ojbect", profile), force);}

    getMenu() {
        const lang = this.Core.Lang;
        if (!this.isReady()) {return []; }
        if (this.User.isReal()) { return [[lang.get("auth.logout"), this.logout.bind(this)]]; }
        return this.providers.map(provider=>[lang.get("auth.providers."+provider), _=>this.login(provider)]);
    }

    async login(provider) {
        if (!this.validateProvider(provider)) {return false;}

        return this.Core.Tray.async("User.login", this.Core.Api.post(this.path+"/"+provider)).then(
            data => {
                const redirect = jet.obj.get(data, "redirect_uri");
                if (redirect) { return window.location = redirect; }
                this.Core.debug(this.Core.Lang.get("auth.error"));
            }
        );
    }

    logout() {this.setPassport(); this.User = null; }

    async fetchauthCode(code) {return this.Core.Tray.async("User.code", this.Core.Api.post(this.path+"/token", { code }));}
    async fetchUser() {return this.Core.Tray.async("User.profile", this.Core.Api.get("/user"));};

    async start() {
        const Core = this.Core;

        jet.obj.addProperty(this, {
            Session:Core.Session.open("auth"),
        }, null, false, true);

        if (!this.path) { return false; }

        if (window.location.pathname === this.path && Core.Query.get("code")) {
            this.setPassport(await this.fetchauthCode(Core.Query.get("code", true)));
        }

        this.User = await this.fetchUser();
    }

    static create(...args) {return new Auth(...args);}

    static use(...path) {
        return Core.use("Auth", ...path);
    }

    static useStorage(...path) {
        return Auth.use("Storage", ...path);
    }

}


export default Auth;