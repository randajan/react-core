
import jet from "@randajan/jetpack";

import { BaseErr, untieArgs } from "./Helpers";

class Serf {
    static $$symbol = Symbol("Serf");
    
    constructor(parent, path, data) {
        path = jet.str.to(path);
        if (!path) { throw new BaseErr("Serf path is required"); }

        jet.obj.addProperty(this, { parent, path });

        ([
            "get", "is", "getType", "isType", "isFull", "isEmpty", "pull", "rem", "lock", "open", "fitTo", "fitType", "fitDefault",
            "store", "storeLocal", "storeSession", "storeApi"
        ]).map(k=>{
            jet.obj.addProperty(this, k, (path, ...args)=>parent[k]([this.path, path], ...args));
        });

        (["set", "push"]).map(k=>{
            jet.obj.addProperty(this, k, (path, value, force)=>parent[k](...this.untieArgs(path, value, force, "object", "boolean", true)));
        });

        jet.obj.map({eye:"function", spy:"function", fit:"function", pip:"function"}, (t,k)=>{
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

    toString() { return this.path; }
}

export default Serf;