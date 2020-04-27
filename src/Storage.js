import jet from "@randajan/jetpack";
import Space from "./Space";
import Crypt from "./Crypt";

// constructor(content, saveMethod, version, Crypt) {
//     jet.obj.addProperty(this, "save", _=>jet.isFull(jet.run(saveMethod, Crypt ? Crypt.enObj(this) : this)));
//     if (version) {Object.defineProperty(this, "version", {set:_=>_, get:_=>version, enumerable:true});}
//     if (Crypt) {jet.obj.addProperty(this, "Crypt", Crypt);}
//     this.load(content);
// }

// load(content) {
//     if (jet.is("string", content)) {
//         content = this.Crypt ? this.Crypt.deObj(content) : jet.obj.fromJSON(content, false)
//     }
    
//     content = jet.get("mapable", content);

//     if (content.version === this.version) {
//         jet.obj.map(content, (v, k)=>this[k] = v);
//     }
// }

class Storage extends Space {
    constructor(content, version, crypt, onChange) {
        super(Storage.unpack(content, version, crypt), onChange);
        jet.obj.addProperty(this, "actualize", _=>jet.run(this.onChange, this, Storage.pack(this, version, crypt)));
    }

    open(path) {
        if (!path) {return this;}
        const child = Storage.create(this.get(path), null, null, this.actualize.bind(this));
        this.set(path, child);
        return child;
    }

    static create(content, version, crypt, onChange) {
        return jet.is(Storage, content) ? content : new Storage(content, version, crypt, onChange);
    }

    static createLocal(id, version, crypt) {
        return Storage.create(localStorage.getItem(id), version, crypt, async (Storage, data)=> localStorage.setItem(id, data) || true);
    }

    static unpack(content, version, crypt) {
        if (jet.is("string", content)) {
            content = crypt ? crypt.deObj(content) : jet.obj.fromJSON(content, false);
        };
        if (jet.obj.get(content, "_version") === version) {
            return content;
        };
    }

    static pack(content, version, crypt) {
        content = jet.get("object", content);
        content._version = version;
        return crypt ? crypt.enObj(content) : jet.obj.toJSON(content);
    }

}

export default Storage;