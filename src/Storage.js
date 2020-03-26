import jet from "@randajan/jetpack";

class Storage {

    constructor(content, saveMethod, Crypt) {
        jet.obj.addProperty(this, "save", _=>jet.run(saveMethod, Crypt ? Crypt.enObj(this) : this));
        if (Crypt) {jet.obj.addProperty(this, "Crypt", Crypt);}
        this.load(content);
    }

    load(content) {
        const data = jet.get("mapable", (this.Crypt && jet.is("string", content)) ? this.Crypt.deObj(content) : content);
        jet.obj.map(data, (v, k)=>{ this[k] = v; });
    }

    set(path, val) {
        if (!path || !jet.obj.set(this, path, val, true)) {return false;}
        return this.save();
    }

    get(path) {
        return jet.obj.get(this, path);
    }

    open(path) {
        const child = Storage.create(this.get(path), this.save.bind(this));
        this.set(path, child);
        return child;
    }

    toString() {
        return JSON.stringify(this);
    }

    toJson() {
        return this;
    }

    static create(content, saveMethod, Crypt) {
        return jet.is(Storage, content) ? content : new Storage(content, saveMethod, Crypt);
    }

}

export default Storage;