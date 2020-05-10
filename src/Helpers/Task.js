import jet from "@randajan/jetpack";

class Task {
    constructor(name, onChange) {
        jet.obj.addProperty(this, "name", name, false, true);
        jet.obj.addProperty(this, "onChange", new jet.RunPool()); // not passing this to runpool
        this.onChange.add(onChange);
        
        Object.defineProperty(this, "ms", {
            enumerable:true,
            get:_=>this.startPoint ? (this.endPoint||performance.now())-this.startPoint : 0
        });
    }

    start() {
        if (this.startPoint) {return this;}
        jet.obj.addProperty(this, "startPoint", performance.now());
        this.onChange.run(true);
        return this;
    }

    end(error) {
        if (!this.startPoint || this.endPoint) {return this;}
        jet.obj.addProperty(this, "endPoint", performance.now());
        jet.obj.addProperty(this, {error, done:!error}, null, false, true);
        this.onChange.run(false, error);
        return this;
    }

    toString() {return jet.obj.join(this.name, ":") || this.name;}
}

export default Task;