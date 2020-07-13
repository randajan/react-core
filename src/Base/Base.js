
import jet from "@randajan/jetpack";

import { BaseErr, filterChanges, untieArgs } from "./Helpers";

import Crypt from "./Crypt";

import Serf from "./Serf";
import Task from "./Task";
import Tray from "./Tray";

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

    static run(duty, data, changes) {
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

    static validateVersion(appVersion, dataVersion) {
        return !appVersion || appVersion === dataVersion;
    }

    static packData(version, data) {
        return jet.obj.toJSON({ data, version });
    }

    static unpackData(version, pack) {
        pack = jet.get("object", pack, jet.obj.fromJSON(pack));
        if (Base.validateVersion(version, pack.version)) { return pack.data; }
    }

    static toObj(any, cryptKey) {
        return jet.filter("object", any, Crypt.deObj(cryptKey, any));
    }

    constructor(version, nostore, debug) {

        jet.obj.addProperty(this, {
            serf:{},
        }, null, false, true);

        jet.obj.addProperty(this, {
            _data:{
                _:{
                    version: jet.str.to(version),
                    nostore: jet.to("boolean", nostore),
                    debug: jet.to("boolean", debug),
                }
            },
            _duty:jet.obj.addProperty({}, {
                fit:{},
                eye:{},
                spy:{},
                store:{},
            })
        });

        this.fitTo("_.version", "string");
        this.fitTo("_.nostore", "boolean");
        this.fitTo("_.debug", "boolean");

        jet.obj.addProperty(this, "tray", this.mount(Tray, "tray"), false, true);

    }

    mount(Prototype, path, ...args) {
        path = jet.str.to(path, ".");
        if (Prototype.$$symbol !== Serf.$$symbol) { throw new BaseErr("Passed invalid first argument (prototype) to Base.mount. Must be Serf or extend Serf"); }
        return this.serf[path] = this.serf[path] || new Prototype(this, path, ...args);
    }

    open(path, ...args) { return jet.isEmpty(path) ? this : this.mount(Serf, path, ...args); }

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
            if (k.startsWith(path) && (jet.is(Task, v) || jet.isFull(v))) { return v; }
        });
    }

    set(path, value, force) {
        path = jet.str.to(path, ".");
        force = jet.get("boolean", force, true);
        if (!path) { throw new BaseErr("The first argument of set (path) can't be empty"); }

        const oldval = this.get(path);
        if (oldval && !force) { return []; }

        const to = jet.obj.set({}, path, value, true);
        const from = Base.fit(this._duty, this._data, path, to);

        const changes = jet.obj.compare(this._data, from);

        this.debugLog("changes", changes);

        return jet.isFull(changes) ? Base.run(this._duty, this._data, changes) : changes;
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
    fit(path, exe) { return this.addDuty("fit", path, exe); }

    lock(path, val) { return this.fit(path, (v,f)=>val !== undefined ? val : f); }
    fitTo(path, type, ...args) { return this.fit(path, v=>jet.to(type, v, ...args));  }
    fitType(path, type, ...args) { return this.fit(path, v=>jet.get(type, v, ...args)); }
    fitDefault(path, def) { return this.fit(path, v=>jet.isFull(v) ? v : def); }

    store(path, save, cryptKey) {
        path = jet.str.to(path, ".");
        const { nostore, version } = this.get("_");
        const pool = this._duty.store;
        if (pool[path]) { jet.run(pool[path].cleanUp); }
        const job = [];
        return pool[path] = {
            job,
            cleanUp:this.eye(path, data=>{if (!nostore) { 
                job.unshift(jet.to("promise", save, path, version, Crypt.enObj(cryptKey, data))); 
            }})
        };
    }

    restoreSync(path, load, cryptKey) {
        path = jet.str.to(path, ".");
        const { version, nostore } = this.get("_");
        if (!nostore) { return Base.toObj(jet.run(load, path, version), cryptKey); }
    }

    async restoreAsync(path, load, cryptKey) {
        path = jet.str.to(path, ".");
        const { version, nostore } = this.get("_");
        if (!nostore) { return Base.toObj(await jet.to("promise", load, path, version), cryptKey); }
    }

    storeLocal(path, cryptKey) {
        this.store(path, (p, v, d)=>localStorage.setItem(p, Base.packData(v, d)), cryptKey);
        return this.restoreSync(path, (p, v)=>Base.unpackData(v, localStorage.getItem(p)), cryptKey);
    }

    async storeRemote(path, load, save, cryptKey) {
        this.store(path, save, cryptKey);
        return await this.restoreAsync(path, load, cryptKey);
    }

    storeSession(path, url, cryptKey) {
        return this.storeRemote(path, 
            (p, v)=>fetch(jet.str.to(url, p, v)).then(res=>Base.unpackData(v, res.json())),
            (p, v, d)=>fetch(jet.str.to(url, p, v), { method: "POST", body:Base.packData(v, d) }),
            cryptKey
        );
    }

    debugLog(...msg) { if (this.get("_.debug")) { console.log("BASE-DEBUG", ...msg); } }

    spaceCount(path, limit) {
        return jet.test.byteCount(this.get(path), limit);
    }

}


export default Base;

export {
    BaseErr
}