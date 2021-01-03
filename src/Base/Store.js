
import jet from "@randajan/jetpack";

import Crypt from "./Crypt";

class Store {

    constructor() {
        jet.obj.prop.add(this, {
            saves:[],
            loads:[],
            method:{},
            proof:{}
        });
    }

    encrypt(cryptKey) {
        jet.obj.prop.add(this.proof, {cryptKey});
        return this;
    }

    version(version) {
        jet.obj.prop.add(this.proof, {version});
        return this;
    }

    setSave(save, pack) {
        this.method.save = jet.fce.tap(save);
        this.method.pack = jet.fce.tap(pack);
        return this;
    }

    setLoad(load, unpack) {
        this.method.load = jet.fce.tap(load);
        this.method.unpack = jet.fce.tap(unpack);
        return this;
    }

    encode(data) {
        const { cryptKey, version } = this.proof;
        return Crypt.enObj(cryptKey, version ? { version, data } : data);
    }

    decode(hash) {
        const { cryptKey, version } = this.proof;
        const wrap = Crypt.deObj(cryptKey, hash);
        if (!version) { return wrap; }
        if (wrap && (version !== "test") && (wrap.version === version)) { return wrap.data; }
    }

    load(timeout, unpack, ...a) {
        const { method, loads } = this;
        if (!method.load) { return jet.eng.to(false); }
        let prom = jet.prom.to(method.load, this, ...a).then(this.decode.bind(this));
        if (unpack && method.unpack) { prom = prom.then(data=>method.unpack(this, data)); }
        const eng = jet.eng(prom, timeout);
        loads.unshift(eng);
        return eng;
    }

    pull(timeout, ...a) { return this.load(timeout, false, ...a); }
    fill(timeout, ...a) { return this.load(timeout, true, ...a); }

    save(timeout, ...a) {
        const { method, saves } = this;
        if (!method.save || !method.pack) { return jet.eng.to(false); }
        const hash = this.encode(jet.fce.run(method.pack, this));
        const eng = jet.eng(jet.prom.to(method.save, this, hash, ...a), timeout);
        saves.unshift(eng);
        return eng;
    }

    getLast(method) {
        const engs = method === "save" ? this.saves : this.loads;
        return engs[engs.length-1];
    }

    getState(method) {
        const last = this.getLast(method);
        if (last) { return last.state; }
    }

    isState(method, state) { return this.getState(method) === state; }

    isLoaded() { return this.isState("load", "result"); }
    isSaved() { return this.isState("save", "result"); }
}



export default Store;