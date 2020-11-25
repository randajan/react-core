
import jet from "@randajan/jetpack";

import Crypt from "./Crypt";

class Store {

    constructor() {
        jet.obj.addProperty(this, {
            saves:[],
            loads:[],
            method:{},
            proof:{}
        });
    }

    encrypt(cryptKey) {
        jet.obj.addProperty(this.proof, {cryptKey});
        return this;
    }

    version(version) {
        jet.obj.addProperty(this.proof, {version});
        return this;
    }

    setSave(save, pack) {
        this.method.save = jet.get("function", save);
        this.method.pack = jet.get("function", pack);
        return this;
    }

    setLoad(load, unpack) {
        this.method.load = jet.get("function", load);
        this.method.unpack = jet.get("function", unpack);
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
        if (!method.load) { return jet.to("engage", false); }
        let prom = jet.to("promise", method.load, this, ...a).then(this.decode.bind(this));
        if (unpack && method.unpack) { prom = prom.then(data=>method.unpack(this, data)); }
        const eng = prom.engage(timeout);
        loads.unshift(eng);
        return eng;
    }

    pull(timeout, ...a) { return this.load(timeout, false, ...a); }
    fill(timeout, ...a) { return this.load(timeout, true, ...a); }

    save(timeout, ...a) {
        const { method, saves } = this;
        if (!method.save || !method.pack) { return jet.to("engage", false); }
        const hash = this.encode(jet.run(method.pack, this));
        const eng = jet.to("promise", method.save, this, hash, ...a).engage(timeout)
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