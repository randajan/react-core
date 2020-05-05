import jet from "@randajan/jetpack";

class Space {

    constructor(content, onChange) {
        this.set(content);
        jet.obj.addProperty(this, "onChange", new Set([onChange]));
    }

    actualize() {
        return jet.run(this.onChange);
    }

    set (path, val, force) {
        if (val == null && jet.is("mapable", path)) {
            val = path;
            path = null;
        }
        force = jet.get("boolean", force, true);
        const from = this.get(path);

        if (from === val) {return true;} //no change
        
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