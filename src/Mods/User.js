import jet from "@randajan/jetpack";

import Auth from "./Auth";

const PROFILES = [];

//MAIN CLASS
class User {
  Core;
  Auth;
  Storage;

  constructor(Auth, profile) {
    profile = this.validateProfile(profile) ? profile : {id:0};
    PROFILES[profile.id] = profile;

    jet.obj.addProperty(this, {
      Core:Auth.Core,
      Auth,
      Storage:Auth.Storage.open("users." + profile.id),
      id:profile.id,
    }, null, false, true);
  }

  get(path) {
    let profile = PROFILES[this.id];

    if (!this.isReal()) { //inject anonym profile
      const anonym = this.Core.Lang.get("auth.anonym");
      const name = this.Storage.get("profile.name");
      profile = {id:0, name:(name||anonym), provider:(name ? anonym : "")}
    }

    return path ? jet.obj.get(profile, path) : jet.copy(profile);
  }

  isReal() {return this.id > 0;}

  saveLang(lang) {return this.Storage.set("lang", lang, true);}
  loadLang() {return this.Storage.get("lang");}

  getTooltip() {
    const { name, email, provider } = this.get();
    return jet.obj.join([name, email, jet.str.capitalize(provider)], "\n");
  }

  validateProfile(user) { return !!jet.obj.get(user, "id"); }

  static create(...args) {return new User(...args);}

  static use(...path) {
    return Auth.use("User", ...path);
  }

  static useStorage(...path) {
    return User.use("Storage", ...path);
  }

};

export default User;


