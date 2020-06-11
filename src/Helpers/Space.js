import jet from "@randajan/jetpack";

class Space {

    constructor(content, onChange) {
        this.set(content);
        jet.obj.addProperty(this, "onChange", new jet.RunPool(this));
        this.onChange.add(onChange);
    }

    actualize() {
        return this.onChange ? this.onChange.run() : [];
    }

    set(path, val, force) {
        if (val === undefined && jet.isMapable(path)) {
            val = path;
            path = null;
        }
        force = jet.get("boolean", force, true);
        const from = this.get(path);

        if (from === val) {return true;} //no change
        if (jet.isMapable(val) && jet.isMapable(from) && jet.isEmpty(jet.obj.compare(from, val)) && jet.isEmpty(jet.obj.compare(val, from))) { //no change
            return true;
        }
        
        if (!force && from != null) { return false; }
        if (path && !jet.obj.set(this, path, val, true)) { return false; }
        else if (!path) {
            for (var i in this) {delete this[i];}
            jet.obj.map(val, (v, k)=>this[k] = v);
        }
        this.actualize();
        return true;
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

    toString() {
        return jet.obj.toJSON(this);
    }

    static create(...args) {
        return new Space(...args);
    }
}

export default Space;