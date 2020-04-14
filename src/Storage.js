import jet from "@randajan/jetpack";

class Storage {

    constructor(content, saveMethod, version, Crypt) {
        jet.obj.addProperty(this, "save", _=>jet.isFull(jet.run(saveMethod, Crypt ? Crypt.enObj(this) : this)));
        if (version) {Object.defineProperty(this, "version", {set:_=>_, get:_=>version, enumerable:true});}
        if (Crypt) {jet.obj.addProperty(this, "Crypt", Crypt);}
        this.load(content);
    }

    load(content) {
        if (jet.is("string", content)) {
            content = this.Crypt ? this.Crypt.deObj(content) : jet.obj.fromJSON(content, false)
        }
        
        content = jet.get("mapable", content);

        if (content.version === this.version) {
            jet.obj.map(content, (v, k)=>this[k] = v);
        }
    }

    set(path, val, force) {
        force = jet.get("boolean", force, true);
        const from = this.get(path);

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

    static create(content, saveMethod, version, Crypt) {
        return jet.is(Storage, content) ? content : new Storage(content, saveMethod, version, Crypt);
    }

    static createLocal(id, version, Crypt) {
        return Storage.create(localStorage.getItem(id), async data => localStorage.setItem(id, data) || true, version, Crypt);
    }

    static byteCount(obj) {
        const list = [];
        const Q = jet.zoo.Quantity;
        let s, sum = Q.create(0, "kB", 2);
        jet.obj.map(obj, (v,k,p)=>{
            if (v != null) {
                sum.val += s = (k.length+v.length)*2/1024;
                list.push([p.join("."), Q.create(s, "kB", 2).toString()]);
            }
            return v;
        }, true);
        return {sum:sum.toString(), list:list.sort((r1, r2)=>r2[1]-r1[1])};
    }
}


export default Storage;