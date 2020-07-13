
import jet from "@randajan/jetpack";

import { BaseErr, untieArgs } from "./Helpers";

class Serf {
    static $$symbol = Symbol("Serf");
    
    constructor(parent, path, data) {
        path = jet.str.to(path);
        if (!path) { throw new BaseErr("Serf path is required"); }

        jet.obj.addProperty(this, { parent, path });

        (["get", "is", "getType", "isType", "isFull", "isEmpty", "pull", "rem", "lock", "open", "fitTo", "fitType", "fitDefault", "store", "restoreSync", "restoreAsync"]).map(k=>{
            jet.obj.addProperty(this, k, (path, ...args)=>parent[k]([this.path, path], ...args));
        });

        (["set", "push"]).map(k=>{
            jet.obj.addProperty(this, k, (path, value, force)=>parent[k](...this.untieArgs(path, value, force, "object", "boolean", true)));
        });

        jet.obj.map({"eye":"function", "spy":"function", "fit":"function"}, (t,k)=>{
            jet.obj.addProperty(this, k, (path, exe, after)=>parent[k](...this.untieArgs(path, exe, after, t, "function")));
        })

        if (data !== undefined) { this.push(data); }
    }

    untieArgs(...args) {
        const arg = untieArgs(...args);
        arg[0] = [this.path, arg[0]];
        return arg;
    }

    mount(prototype, path, ...args) {
        return this.parent.mount(prototype, [this.path, path], ...args);
    }

    storeLocal(path, cryptKey) {
        this.store(path, localStorage.setItem.bind(localStorage), cryptKey);
        return this.restoreSync(path, localStorage.getItem.bind(localStorage), cryptKey);
    }

    async storeRemote(path, restore, store, cryptKey) {
        this.store(path, store, cryptKey);
        return await this.restoreAsync(path, restore, cryptKey);
    }

    storeSession(path, url, cryptKey) {
        return this.storeRemote(path, 
            path=>fetch(jet.str.to(url, path)).then(r=>r.text()), 
            (path, body)=>fetch(jet.str.to(url, path), { method: "POST", body }), 
            cryptKey
        );
    }

    toString() { return this.path; }
}

export default Serf;