
import jet from "@randajan/jetpack";

import { BaseErr, filterChanges, untieArgs } from "./Helpers";

import Crypt from "./Crypt";

import Serf from "./Serf";
import Api from "./Api";
import Store from "./Store";

let BID = 0;

class Base {
    static $$symbol = Symbol("Base");

    static dutyTypes = {
        fit:"function",
        eye:"function",
        spy:"function"
    }

    static fit(duty, data, path, to) {
        const from = {};
        jet.obj.match(data, to, (data, to, p)=>{ //heart of base DO not touch :)
            const isin = p === path || p.startsWith(path+".");
            const ison = path.startsWith(p+".");
            const pool = duty.fit[p];
            if (data != null && !jet.isMapable(data)) { jet.obj.set(from, p, data, false); } //create copy
            if (!isin && !ison) { return data; } // skipping validation if it's out of scope
            if (ison || jet.isMapable(to)) { to = data; } //replace mapable and above
            return pool ? pool.fit(to, jet.obj.get(from, p)) : to;
        });
        if (duty.fit[""]) { duty.fit[""].fit(data, from); }
        return from;
    }

    static async run(duty, data, changes) {
        const { eye, spy } = duty;
        changes = Array.from(new Set(changes));
        changes.map(path=>{
            if (!eye[path] && !spy[path]) { return; }
            const to = jet.obj.get(data, path);
            if (eye[path]) { eye[path].run(to); }
            if (spy[path]) { spy[path].run(to, filterChanges(path, changes)); }
        });
        if (eye[""]) { eye[""].run(data); }
        if (spy[""]) { spy[""].run(data, changes); }
        return changes;
    }

    constructor(version, debug) {

        jet.obj.addProperty(this, {
            version,
            debug,
            serf:{},
        }, null, false, true);

        jet.obj.addProperty(this, {
            _id:BID++,
            _data:{},
            _duty:jet.obj.addProperty({}, {
                fit:{},
                eye:{},
                spy:{},
                pipe:{},
                store:{},
            })
        });

    }

    tag(path) { return this._id+"_"+jet.str.to(path, "."); }

    mount(path, Prototype, ...args) {
        path = jet.str.to(path, ".");
        if (Prototype.$$symbol !== Serf.$$symbol) { throw new BaseErr("Passed invalid second argument (prototype) to Base.mount. Must be Serf or extend Serf"); }
        return this.serf[path] = this.serf[path] || new Prototype(this, path, ...args);
    }

    open(path, ...args) { return jet.isEmpty(path) ? this : this.mount(path, Serf, ...args); }

    is(path, value) { return this.get(path) === value; }
    isType(path, type, soft) { return jet.is(type, this.get(path), soft); }
    isFull(path) { return jet.isFull(this.get(path)); }
    isEmpty(path) { return jet.isEmpty(this.get(path)); }

    get(path, def) { return jet.obj.get(this._data, path, def); }
    getType(path, all) { return jet.type(this.get(path), all); }
    getDuty(type, path) {
        const duty = this._duty[type];
        if (!duty) { throw new BaseErr("There is no duty like '"+type+"'"); }
        path = jet.str.to(path, ".");
        return jet.obj.map(duty, (v,k)=>{
            if (k.startsWith(path) && jet.isFull(v)) { return v; }
        });
    }

    getStore(path) { return this._duty.store[jet.str.to(path, ".")]; }
    saveStore(path, ...a) { const store = this.getStore(path); return store ? store.save(...a) : false; }
    pullStore(path, ...a) { const store = this.getStore(path); return store ? store.pull(...a) : false; }
    fillStore(path, ...a) { const store = this.getStore(path); return store ? store.fill(...a) : false; }

    set(path, value, force) {
        const ms = new Date();
        path = jet.str.to(path, ".");
        force = jet.get("boolean", force, true);
        if (!path) { throw new BaseErr("The first argument of set (path) can't be empty"); }

        const pipe = path.split(".")[0];
        const data = {[pipe]:this._data[pipe]};

        const oldval = this.get(path);
        if (oldval && !force) { return []; }

        const to = jet.obj.set({}, path, value, true);
        const from = Base.fit(this._duty, data, path, to);
        
        this._data[pipe] = data[pipe];

        const changes = jet.obj.compare(data, from);

        if (jet.isFull(changes)) { Base.run(this._duty, data, changes); }

        this.debugLog("changes", new Date()-ms, changes);
        return changes;
    }

    push(path, value, force) {
        path = jet.str.to(path, ".");
        return this.set(path, jet.obj.merge(force?null:value, this.get(path), force?value:null), true);
    }

    rem(path) { return this.set(path); }
    pull(path) { const value = this.get(path); this.rem(path); return value; }

    addDuty(type, path, add, after) {
        const duty = this._duty[type];
        const dutype = Base.dutyTypes[type];
        if (!duty || !dutype) { throw new BaseErr("There is no duty like '"+type+"'"); }
        [ path, add ] = untieArgs(path, add, after, dutype, "function");
        let pool = duty[path];
        if (!pool) {
            pool = duty[path] = dutype === "function" ? new jet.RunPool() : new jet.Pool(dutype, true);
        }
        pool.add(add);
        return  _=>pool.rem(add);
    }
    
    eye(path, exe) { return this.addDuty("eye", path, exe); }
    spy(path, exe) { return this.addDuty("spy", path, exe); }
    pip(path, exe) { const rem = this.eye(path, exe), pip = this.eye(path, rem); return _=>jet.run([rem, pip]); }
    fit(path, exe) { return this.addDuty("fit", path, exe); }

    lock(path, val) { return this.fit(path, (v,f)=>val !== undefined ? val : f); }
    fitTo(path, type, ...args) { return this.fit(path, next=>jet.to(type, next(), ...args)); }
    fitType(path, type, ...args) { return this.fit(path, next=>jet.get(type, next(), ...args)); }
    fitDefault(path, def) { return this.fit(path, next=>jet.get("full", next(), def)); }

    store(path, load, save) {
        path = jet.str.to(path, ".");
        const pool = this._duty.store;
        if (pool[path]) { jet.run(pool[path].cleanUp); }

        const store = pool[path] = new Store();
        store.path = path;

        store.setLoad(load, (s, data)=>this.set(path, data));
        store.setSave(save, s=>this.get(path));

        store.cleanUp = this.eye(path, store.save.bind(store));
        return store;
    }

    storeLocal(path) {
        path = jet.str.to(path, ".");
        return this.store(
            path,
            s=>this.debug ? null : localStorage.getItem(this.tag(p)), 
            (s, data)=>this.debug ? null : localStorage.setItem(this.tag(p), data)
        );
    }

    storeSession(path, url) {
        if (!url) {
            console.warn("Base path '"+this.tag(path)+"' will be stored locally because url was not provided");
            return this.storeLocal(path);
        }
        return this.store(path, 
            s=>fetch(jet.str.to(url, s)).then(res=>res.json()),
            (s, body)=>fetch(jet.str.to(url, s), { method: "POST", body })
        );
    }

    storeApi(path, url, api, saveable) {
        api = api || this.api;
        if (saveable && (!url || !jet.is(Api, api))) {
            console.warn("Base path '"+this.tag(path)+"' will be stored locally because url or api was not provided");
            return this.storeLocal(path);
        }
        return this.store(path, 
            s=>api.get(jet.str.to(url, s)),
            saveable ? (s, data)=>api.post(jet.str.to(url, s), data) : null
        );
    }

    debugLog(...msg) { if (this.debug) { console.log("BASE-DEBUG", ...msg); } }

    spaceCount(path, limit) {
        return jet.test.byteCount(this.get(path), limit);
    }

}


export default Base;

export {
    BaseErr
}