
import jet from "@randajan/jetpack";

import { BaseErr, untieArgs } from "./Helpers";

class Serf {
    static $$symbol = Symbol("Serf");
    
    constructor(parent, path, data) {
        path = jet.str.to(path);
        if (!path) { throw new BaseErr("Serf path is required"); }

        jet.obj.prop.add(this, { parent, path });

        ([
            "get", "is", "getType", "isType", "isFull", "pull", "rem", "lock", 
            "tag", "open", "mount", "fitTo", "fitType", "fitDefault",
            "store", "storeLocal", "storeSession", "storeApi"
        ]).map(k=>{
            jet.obj.prop.add(this, k, (path, ...args)=>parent[k]([this.path, path], ...args));
        });

        (["set", "push"]).map(k=>{
            jet.obj.prop.add(this, k, (path, value, force)=>parent[k](...this.untieArgs(path, value, force, "obj", "bol", true)));
        });

        jet.map.it({eye:"fce", spy:"fce", fit:"fce", pip:"fce"}, (t,k)=>{
            jet.obj.prop.add(this, k, (path, exe, after)=>parent[k](...this.untieArgs(path, exe, after, t, "fce")));
        })

        if (data !== undefined) { this.push(data); }
    }

    untieArgs(...args) {
        const arg = untieArgs(...args);
        arg[0] = [this.path, arg[0]];
        return arg;
    }

    toString() { return this.path; }
}

export default Serf;