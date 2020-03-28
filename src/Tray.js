import jet from "@randajan/jetpack";

class Task {
    constructor(name, onChange) {
        jet.obj.addProperty(this, "name", name, false, true);
        jet.obj.addProperty(this, {onChange:new Set([onChange])});
        
        Object.defineProperty(this, "ms", {
            enumerable:true,
            get:_=>this.startPoint ? (this.endPoint||performance.now())-this.startPoint : 0
        });
    }

    start() {
        if (this.startPoint) {return this;}
        jet.obj.addProperty(this, "startPoint", performance.now());
        jet.run(this.onChange, true);
        return this;
    }

    end(error) {
        if (!this.startPoint || this.endPoint) {return this;}
        jet.obj.addProperty(this, "endPoint", performance.now());
        jet.obj.addProperty(this, {error, done:!error}, null, false, true);
        jet.run(this.onChange, false, error);
        return this;
    }

    toString() {return jet.obj.join(this.name, ":") || this.name;}
}

class Tray {
    constructor(onChange) {
        jet.obj.addProperty(this, {onChange:new Set([onChange])});
        jet.obj.addProperty(this, {
            pending:new jet.zoo.Pool(Task),
            error:new jet.zoo.Pool(Task),
            done:new jet.zoo.Pool(Task),
        }, null, false, true);

    }

    isPending() {return jet.isFull(this.pending);}
    isError() {return jet.isFull(this.error);}
    isReady() {return !this.isPending() && !this.isError();}

    add(name, start) {
        const task = new Task(name, (pending, error)=>{
            if (pending) {this.pending.add(task);}
            else {this.pending.pass(error ? this.error : this.done, task);}
            jet.run(this.onChange, task);
        });
        return start ? task.start() : task;
    }

    sync(name, fce) {
        if (!jet.is("function", fce)) { return; }
        const task = this.add(name, true);
        try {
            const result = fce(task);
            task.end();
            return result;
        } catch(e) { task.end(e); }
    }

    async async(name, prom) {
        let task;
        if (jet.is("function", prom)) {
            task = this.add(name, true);
            try {prom = prom(task);} catch(e) {task.end(e);}
        }
        if (jet.is(Promise, prom)) {
            task = task || this.add(name, true);
            const end = task.end.bind(task); 
            return prom.then(prom=>{end(); return prom;}, end).catch(end);
        }
        if (task) {
            task.end();
            return prom;
        }
    }

    fetchTasks(kind) {
        return Array.from(new Set(Array.from(this[kind]).map(task=>task.name)));
    }

    static create(...args) {
        return new Tray(...args);
    }

}

export default Tray;
export {
    Task
}