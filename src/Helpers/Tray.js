import jet from "@randajan/jetpack";

import Task from "./Task";

class Tray {
    constructor(onChange) {
        jet.obj.addProperty(this, "onChange", new jet.RunPool(this)); //not passing this to runpool
        jet.obj.addProperty(this, {
            pending:new jet.Pool(Task),
            error:new jet.Pool(Task),
            done:new jet.Pool(Task),
        }, null, false, true);
        
        this.onChange.add(onChange);
    }

    isPending() {return jet.isFull(this.pending);}
    isError() {return jet.isFull(this.error);}
    isReady() {return !this.isPending() && !this.isError();}

    addTask(name, onChange) {
        return new Task(name, [task=>{
            if (task.pending) { this.pending.add(task); }
            else { this.pending.pass(task.error ? this.error : this.done, task); }
        }, this.onChange.run.bind(this.onChange), onChange]);
    }

    runSync(name, fce, onChange) {
        const task = this.addTask(name, onChange);
        if (jet.is("function", fce)) {
            try { task.start().end(fce(task)); } catch(e) { task.stop(e); }
        };
        return task;
    }

    async runAsync(name, fce, onChange) {
        const task = this.addTask(name, onChange);
        if (jet.is("function", fce) || jet.is(Promise, prom)) {
            try { task.start().end(await fce(task)); } catch(e) { task.stop(e); }
        };
        return task;
    }

    fetchTasks(kind) {
        return kind ? Array.from(new Set(Array.from(this[kind]).map(task=>task.name))) : JSON.parse(JSON.stringify(this));
    }

    static create(...args) {
        return new Tray(...args);
    }

}

export default Tray;