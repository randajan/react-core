import jet from "@randajan/jetpack";

class Storage {

    constructor(content, saveMethod, version, Crypt) {
        jet.obj.addProperty(this, "save", _=>jet.isFull(jet.run(saveMethod, Crypt ? Crypt.enObj(this) : this)));
        if (version) {Object.defineProperty(this, "version", {set:_=>_, get:_=>version, enumerable:true});}
        if (Crypt) {jet.obj.addProperty(this, "Crypt", Crypt);}
        this.load(content);
    }

    load(content) {
        const data = jet.get("mapable", (this.Crypt && jet.is("string", content)) ? this.Crypt.deObj(content) : content);
        if (data.version === this.version) {jet.obj.map(data, (v, k)=>this[k] = v);}
    }

    set(path, val, force) {
        force = jet.get("boolean", force, true);
        const from = this.get(path, val);

        if (from === val) {return true;} //no change

        if (!force && from != null) { return false; }
        if (path && !jet.obj.set(this, path, val, true)) { return false; }
        else if (!path) {
            for (var i in this) {delete this[i];}
            jet.obj.map(val, (v, k)=>this[k] = v);
        }
        return this.save();
    }

    get(path, force) {
        const val = path ? jet.obj.get(this, path) : this;
        if (force) {this.set(path);}
        return val;   
    }

    push(path, val, force) {
        force = jet.get("boolean", force, true);
        const mapable = jet.isMapable(val);
        return this.set(path, mapable ? jet.obj.merge(force?null:val, this.get(path), force?val:null) : val, force || mapable);
    }

    open(path) {
        if (!path) {return this;}
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

    static create(content, saveMethod, version, Crypt) {
        return jet.is(Storage, content) ? content : new Storage(content, saveMethod, version, Crypt);
    }

}

export default Storage;