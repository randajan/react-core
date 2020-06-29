
import jet from "@randajan/jetpack";

import { BaseErr, filterChanges, untieArgs } from "./Helpers";

import Crypt from "./Crypt";

import Serf from "./Serf";
import Task from "./Task";

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
            const isin = p.startsWith(path);
            const ison = !isin && path.startsWith(p);
            const pool = duty.fit[p];
           
            if (!jet.isMapable(data)) { jet.obj.set(from, p, data, true); } //create copy
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

    constructor(version, nocache, debug) {

        jet.obj.addProperty(this, {
            version:jet.str.to(version),
            nocache:jet.to("boolean", nocache),
            debug:jet.to("boolean", debug),
            serf:{},
        }, null, false, true);

        jet.obj.addProperty(this, {
            _versionKey:"__version__",
            _data:{},
            _duty:{}
        });

        jet.obj.addProperty(this._duty, {
            fit:{},
            eye:{},
            spy:{},
            mark:{},
            loading:{},
            error:{}
        }, null, false, true);
  
    }

    mount(Prototype, path, ...args) {
        if (Prototype.$$symbol !== Serf.$$symbol) { throw new BaseErr("Passed invalid first argument (prototype) to Base.mount. Must be Serf or extend Serf"); }
        return this.serf[path] = this.serf[path] || new Prototype(this, path, ...args);
    }

    open(path, ...args) { return jet.isEmpty(path) ? this : this.mount(Serf, path, ...args); }

    is(path, value) { return this.get(path) === value; }
    isType(path, type, soft) { return jet.is(type, this.get(path), soft); }
    isFull(path) { return jet.isFull(this.get(path)); }
    isEmpty(path) { return jet.isEmpty(this.get(path)); }

    isError(path) { return jet.isFull(this.getError(path)); }
    isLoading(path) { return jet.isFull(this.getLoading(path)); }
    isReady(path) { return !this.isLoading(path) && !this.isError(path); }

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
    getError(path) { return this.getDuty("error", path); }
    getLoading(path) { return this.getDuty("loading", path); }

    set(path, value, force) {
        force = jet.get("boolean", force, true);
        path = jet.str.to(path);
        if (!path) { throw new BaseErr("The first argument of set (path) can't be empty"); }

        const oldval = this.get(path);
        if (oldval && !force) { return []; }

        const to = jet.obj.set({}, path, value, true);
        const from = Base.fit(this._duty, this._data, path, to);
        const changes = jet.obj.compare(this._data, from);

        return jet.isFull(changes) ? Base.run(this._duty, this._data, changes) : changes;
    }

    push(path, value, force) {
        return this.set(path, jet.obj.merge(force?null:value, this.get(path), force?value:null), true);
    }

    rem(path) { return this.set(path, null); }
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

    addTask(path, fetchMethod, cache) {
        const duty = this._duty;
        const task = this.mount(Task, path, fetchMethod, cache);
        
        task.eye(data=>{
            if (data.loading) { duty.loading[path] = task; } else { delete duty.loading[path]; }
            if (data.error) { duty.error[path] = task; } else { delete duty.error[path]; }
        })
        return task;
    }

    getMarkPath(path) {
        const pool = this._duty.mark;
        path = jet.arr.to(path, ".");
        for (let k in path) {
            const p = path.slice(0, Number(k)+1).join(".");
            if (pool[p]) { return p; }
        };
    }

    getMark(path) { return this._duty.mark[this.getMarkPath(path)] || "base"; }

    setMark(path, mark) {
        const pool = this._duty.mark;
        const curr = this.getMarkPath(path);
        path = jet.str.to(path, ".");
        mark = jet.str.to(mark);
        if (curr) { 
            throw new BaseErr("Unable to set mark '"+mark+"' at '"+path+"' because '"+curr+"' is allready marked as '"+pool[curr]+"'"); 
        }
        jet.obj.addProperty(pool, path, mark, false, true);
    }

    storeData(data, cryptKey) {
        const { nocache, version, _versionKey } = this;
        if (nocache) { return; }
        data = jet.get("object", data);
        if (version) { data[_versionKey] = version; }
        const hash = Crypt.enObj(cryptKey, data);
        delete data[_versionKey];
        return hash;
    }

    restoreData(hash, cryptKey) {
        const { nocache, version, _versionKey } = this;
        if (nocache) { return; }
        const data = jet.get("object", Crypt.deObj(cryptKey, hash));
        if (data[_versionKey] !== version) { return; }
        delete data[_versionKey];
        return data;
    }

    spaceCount(path, limit) {
        return jet.test.byteCount(this.get(path), limit);
    }

}

export default Base;

export {
    BaseErr
}