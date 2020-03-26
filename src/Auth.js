import jet from "@randajan/jetpack";
import User from "./User";

class Auth {

    constructor(Core, path, providers) {
        let _user;
        
        jet.obj.addProperty(this, {
            Core,
            Storage:Core.Storage.open("auth"),
            path:jet.get("string", path),
            providers:jet.obj.toArray(providers),
        }, null, false, true);

        Object.defineProperty(this, "User", {
            enumerable:true,
            set:function(profile) {
                _user = User.create(this, profile);
                this.Core.setState({user:_user.id});
            },
            get:function() {return _user;}
        });

        this.logout();
        this.providers.map(v=>jet.obj.addProperty(this.login, v, _=>this.login(v))); //generate function for each provider

        Core.onChange.add(changes=>changes.lang ? this.User.saveLang(changes.lang) : null);
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

    setAnonymName(name) {
        return this.Storage.set("users.0.profile.name", jet.get("string", name));
    }

    getMenu() {
        const lang = this.Core.Lang;

        if (!this.isReady()) {return []; }
    
        if (this.User.isReal()) { return [[lang.get("auth.logout"), this.logout.bind(this)]]; }

        return jet.obj.map(this.providers, v=>[lang.get("auth.providers."+v), this.login[v]]);
    }

    async login(provider) {
        
        if (!this.validateProvider(provider)) {return false;}
        
        const S = this.Core;
        this.logout();

        return S.Api.post(this.path+"/"+provider).then(
            data => {
                const redirect = jet.obj.get(data, "redirect_uri");
                if (redirect) { return window.location = redirect; }
                S.setError(jet.obj.get(data, "error"));
            },
            S.setError.bind(S)
        );
    }

    logout() {this.setPassport(); this.User = null; }

    async fetchauthCode(code) {const S = this.Core; return S.Api.post(this.path+"/token", { code }).then(data => data, S.setError.bind(S));}
    async fetchUser() {const S = this.Core; return S.Api.get("/user").then(data => data, S.setError.bind(S));};

    async start() {
        const S = this.Core;

        jet.obj.addProperty(this, {
            Session:S.Session.open("auth"),
        }, null, false, true);

        if (!this.path) { return false; }

        if (window.location.pathname === this.path && S.Query.get("code")) {
            this.setPassport(await this.fetchauthCode(S.Query.pull("code")));
        }

        this.User = await this.fetchUser();
    }

    static create(...args) {return new Auth(...args);}

}


export default Auth;