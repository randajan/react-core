
import jet from "@randajan/jetpack";

import Base, { BaseErr } from "./Base";

class Serf {
    static $$symbol = Symbol("Serf");
    
    constructor(parent, path, data) {
        path = jet.str.to(path, ".");

        if (jet.isEmpty(path)) { throw new BaseErr("Serf path is required"); }

        jet.obj.addProperty(this, { parent, path });

        Object.defineProperties(this, {mark:{ set:mark=>parent.setMark(this.path, mark), get:_=>parent.getMark(this.path)}});

        (["get", "is", "getType", "isType", "isFull", "isEmpty", "isLoading", "isError", "isReady", "pull", "rem", "lock", "addTask", "open", "fitTo", "fitType", "fitDefault"]).map(k=>{
            jet.obj.addProperty(this, k, (path, ...args)=>parent[k](this.fetchPath(path), ...args));
        });

        (["set", "push"]).map(k=>{
            jet.obj.addProperty(this, k, (path, value, force)=>parent[k](...this.untieArgs(path, value, force, "object", "boolean", true)));
        });

        jet.obj.map({"eye":"function", "spy":"function", "fit":"function"}, (t,k)=>{
            jet.obj.addProperty(this, k, (path, exe, after)=>parent[k](...this.untieArgs(path, exe, after, t, "function")));
        })

        if (data !== undefined) { this.push(data); }
    }

    fetchPath(path) { return Base.concatPaths(this.path, path); }
    untieArgs(...args) {
        const arg = Base.untieArgs(...args);
        arg[0] = this.fetchPath(arg[0]);
        return arg;
    }

    mount(prototype, path, ...args) {
        return this.parent.mount(prototype, this.fetchPath(path), ...args);
    }

    linkLocal(cryptKey) {
        this.mark = "local";
        const label = Base.concatPaths("Base", this.path);
        this.eye(data=>localStorage.setItem(label, this.parent.storeData(data, cryptKey)));
        return this.parent.restoreData(localStorage.getItem(label), cryptKey);
    }

    linkSession(url, cryptKey) {
        this.mark = "session";
        if (!url) { throw new BaseErr("Serf linkSession failed. URL is required"); }

        this.eye(data => fetch(jet.str.to(url, this.path), { method: "POST", body:this.parent.storeData(data, cryptKey) }));
        return fetch(jet.str.to(url, this.path)).then(resp=>resp.json()).then(json=>this.parent.restoreData(json, cryptKey));
    }

    toString() { return this.path; }
}

export default Serf;