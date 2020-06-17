import jet from "@randajan/jetpack";

class Task {
    constructor(name, onChange) {
        jet.obj.addProperty(this, {
            name,
            onChange:new jet.RunPool(this)
        }, null, false, true);
        
        Object.defineProperties(this, {
            started: { enumerable:true, get:_=>!!this.startPoint },
            ended: { enumerable:true, get:_=>!!this.endPoint },
            pending:{ enumerable:true, get:_=>this.started && !this.ended },
            done:{ enumerable:true, get:_=>this.ended && !this.error },
            ms:{ enumerable:true, get:_=>this.started ? (this.endPoint||performance.now())-this.startPoint : 0}
        });

        this.onChange.add(onChange);
    }

    start() {
        if (this.started) {return this;}
        jet.obj.addProperty(this, { startPoint:performance.now() }, null, false, true);
        this.onChange.run(true);
        return this;
    }

    stop(error) {
        if (!this.pending) {return this;}
        jet.obj.addProperty(this, { endPoint:performance.now(), error }, null, false, true);
        this.onChange.run(false);
        return this;
    }

    end(result) {
        if (!this.pending) {return this;}
        jet.obj.addProperty(this, { endPoint:performance.now(), result }, null, false, true);
        this.onChange.run(false);
        return this;
    }

    toString() {return jet.obj.join(this.name, ":") || this.name;}
}

export default Task;