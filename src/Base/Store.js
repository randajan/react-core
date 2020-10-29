
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

    pack(data) {
        const { cryptKey, version } = this.proof;
        return Crypt.enObj(cryptKey, version ? { version, data } : data);
    }

    unpack(data) {
        const { cryptKey, version } = this.proof;
        data = Crypt.deObj(cryptKey, data);
        if (data && (!version || version === data.version)) { return data; }
    }

    load(timeout, unpack, ...a) {
        const { method, loads } = this;
        if (!method.load) { return jet.to("engage", false); }
        let prom = jet.to("promise", method.load, this, ...a).then(this.unpack.bind(this));
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
        const data = this.pack(jet.run(method.pack, this));
        const eng = jet.to("promise", method.save, this, data, ...a).engage(timeout)
        saves.unshift(eng);
        return eng;
    }
}



export default Store;