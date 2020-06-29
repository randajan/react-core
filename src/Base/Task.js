import jet from "@randajan/react-jetpack";

import Serf from "./Serf";

class Task extends Serf {

    static getAge(date) {
        return jet.to("amount", date ? Number(new Date())-jet.num.to(date) : 0, "ms");
    }

    static isOld(date, amnt) {
        return Task.getAge(date) > jet.to("amount", amnt, "ms");
    }

    constructor(parent, path, fetchMethod, cache) {
        super(parent, path);

        cache = jet.to("amount", cache||0, "ms");

        this.lock("promise");
        this.fitTo("cancel", "boolean");
        this.fitTo("ready", "boolean");
        this.fitTo("done", "boolean");

        this.fit((t,f)=>{
            [t, f] = jet.get([["object", t], ["object", f]]);
            const init = !f.start && t.ready;

            if (t.error) { jet.to("error", t.error); }

            t.start = jet.to("date", init ? t.start : f.start);
            t.end = jet.to("date", init ? t.end : f.end);
            t.length = jet.to("amount", (init ? t.length : f.length) || 0, "ms");

            if (init) { return t; }
            
            t.loading = f.loading;

            if ((t.fetch && !f.start) || Task.isOld(t.end, cache) || jet.isFull(jet.obj.compare(t.fetch, f.fetch))) { //new request
                t.fetch = jet.arr.wrap(t.fetch);
                t.loading = true;
                t.start = new Date();
                t.promise = jet.to("promise", fetchMethod, ...t.fetch)
                t.ready = false;
                t.cancel = false;
                delete t.error;
                delete t.end;
                delete t.length;
            } else if (f.loading && (t.done || t.cancel || t.error)) {
                t.loading = false;
                t.ready = t.done = !t.cancel && t.done;
                t.end = new Date();
                t.length = new jet.Amount(t.end - t.start, "ms");
            }

            return t;
        });

        this.eye("promise", promise=>!promise ? null : promise.then(
            data=>this.is("promise", promise) && this.get("loading") && this.done(data),
            error=> this.is("promise", promise) && this.get("loading") && this.error(jet.to("error", error)),
        ));

    }

    isLoading() { return this.get("loading"); }
    isError() { return !!this.get("error"); }
    isReady() { return !this.isLoading() && !this.isError(); }

    getAge() { return Task.getAge(this.get("end"));}

    fetch(...args) { return this.set("fetch", args); }

    done(data) { return this.push({done:true, data}); }
    error(error) { return this.set("error", error); }
    cancel() { return this.set("cancel", true); }

    then(res, err) {
        const promise = this.get("promise");
        if (promise) { promise.then(res, err); }
        return this;
    }

    catch(err) {
        const promise = this.get("promise");
        if (promise) { promise.catch(err); }
        return this;
    }

}


export default Task;