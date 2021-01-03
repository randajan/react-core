
import jet from "@randajan/react-jetpack";

import { BaseErr, filterChanges, untieArgs } from "./Helpers";

import Serf from "./Serf";
import Api from "./Api";
import Store from "./Store";

let BID = 0;

class Base {
    static $$symbol = Symbol("Base");

    static dutyTypes = {
        fit:"fce",
        eye:"fce",
        spy:"fce"
    }

    static fit(duty, data, path, to) {
        const from = {};
        jet.map.match(data, to, (data, to, p)=>{ //heart of base DO not touch :)
            const isin = p === path || p.startsWith(path+".");
            const ison = path.startsWith(p+".");
            const pool = duty.fit[p];
            if (data != null && !jet.type.is.map(data)) { jet.map.put(from, p, data, false); } //create copy
            if (!isin && !ison) { return data; } // skipping validation if it's out of scope
            if (ison || jet.type.is.map(to)) { to = data; } //replace mapable and above
            return pool ? pool.fit(to, jet.map.dig(from, p)) : to;
        });

        if (duty.fit[""]) { duty.fit[""].fit(data, from); }
        return from;
    }

    static async run(duty, data, changes) {
        const { eye, spy } = duty;
        changes = Array.from(new Set(changes));
        changes.map(path=>{
            if (!eye[path] && !spy[path]) { return; }
            const to = jet.map.dig(data, path);
            if (eye[path]) { eye[path].run(to); }
            if (spy[path]) { spy[path].run(to, filterChanges(path, changes)); }
        });
        if (eye[""]) { eye[""].run(data); }
        if (spy[""]) { spy[""].run(data, changes); }
        return changes;
    }

    constructor(version, debug) {

        jet.obj.prop.add(this, {
            version,
            debug,
            serf:{},
        }, null, false, true);

        jet.obj.prop.add(this, {
            _id:BID++,
            _data:{},
            _duty:jet.obj.prop.add({}, {
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

    open(path, ...args) { return jet.type.is.full(path) ? this.mount(path, Serf, ...args) : this; }

    is(path, value) { return this.get(path) === value; }
    isType(path, type, soft) { return jet.type.is(type, this.get(path), soft); }
    isFull(path) { return jet.type.is.full(this.get(path)); }

    get(path, def) { return jet.map.dig(this._data, path, def); }
    getType(path, all) { return jet.type(this.get(path), all); }
    getDuty(type, path) {
        const duty = this._duty[type];
        if (!duty) { throw new BaseErr("There is no duty like '"+type+"'"); }
        path = jet.str.to(path, ".");
        return jet.map.of(duty, (v,k)=>{
            if (k.startsWith(path) && jet.type.is.full(v)) { return v; }
        });
    }

    getStore(path) { return this._duty.store[jet.str.to(path, ".")]; }
    saveStore(path, ...a) { const store = this.getStore(path); return store ? store.save(...a) : false; }
    pullStore(path, ...a) { const store = this.getStore(path); return store ? store.pull(...a) : false; }
    fillStore(path, ...a) { const store = this.getStore(path); return store ? store.fill(...a) : false; }

    set(path, value, force) {
        const ms = new Date();
        path = jet.str.to(path, ".");
        force = jet.bol.tap(force, true);
        if (!path) { throw new BaseErr("The first argument of set (path) can't be empty"); }

        const pipe = path.split(".")[0];
        const data = {[pipe]:this._data[pipe]};

        const oldval = this.get(path);
        if (oldval && !force) { return []; }
        const to = jet.map.put({}, path, value, true);
        const from = Base.fit(this._duty, data, path, to);
        this._data[pipe] = data[pipe];

        const changes = jet.map.compare(data, from);

        if (jet.type.is.full(changes)) { Base.run(this._duty, data, changes); }

        this.debugLog("changes", new Date()-ms, changes);
        return changes;
    }

    push(path, value, force) {
        path = jet.str.to(path, ".");
        return this.set(path, jet.map.merge(force?null:value, this.get(path), force?value:null), true);
    }

    rem(path) { return this.set(path); }
    pull(path) { const value = this.get(path); this.rem(path); return value; }

    addDuty(type, path, add, after) {
        const duty = this._duty[type];
        const dutype = Base.dutyTypes[type];
        if (!duty || !dutype) { throw new BaseErr("There is no duty like '"+type+"'"); }
        [ path, add ] = untieArgs(path, add, after, dutype, "fce");
        let pool = duty[path];
        if (!pool) {
            pool = duty[path] = dutype === "fce" ? jet.rupl() : jet.pool(dutype, true);
        }
        pool.add(add);
        return  _=>pool.rem(add);
    }
    
    eye(path, exe) { return this.addDuty("eye", path, exe); }
    spy(path, exe) { return this.addDuty("spy", path, exe); }
    pip(path, exe) { const rem = this.eye(path, exe), pip = this.eye(path, rem); return _=>jet.fce.run([rem, pip]); }
    fit(path, exe) { return this.addDuty("fit", path, exe); }

    lock(path, val) { return this.fit(path, (v,f)=>val !== undefined ? val : f); }
    fitTo(path, type, ...args) { return this.fit(path, next=>jet.type.to(type, next(), ...args)); }
    fitType(path, type, ...args) { return this.fit(path, next=>jet.type.tap(type, next(), ...args)); }
    fitDefault(path, def) { return this.fit(path, next=>{const v = next(); return jet.type.is.full(v) ? v : def}); }

    store(path, load, save) {
        path = jet.str.to(path, ".");
        const pool = this._duty.store;
        if (pool[path]) { jet.fce.run(pool[path].cleanUp); }

        const store = pool[path] = new Store();
        store.path = path;

        store.setLoad(load, (s, data)=>this.set(path, data));
        store.setSave(save, s=>this.get(path));

        store.cleanUp = this.eye(path, _=>store.save());
        return store;
    }

    storeLocal(path, tag) {
        path = jet.str.to(path, ".");
        tag = this.tag(jet.str.to(tag, ".") || path);
        return this.store(
            path,
            s=>localStorage.getItem(tag), 
            (s, data)=>localStorage.setItem(tag, data)
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
        if (saveable && (!url || !jet.type.is(Api, api))) {
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
        return jet.obj.measure(this.get(path), limit);
    }

}


export default Base;

export {
    BaseErr
}