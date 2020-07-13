
import jet from "@randajan/jetpack";

import Serf from "./Serf";

class Tray extends Serf {

    constructor(parent, path) {
        super(parent, path)

        jet.obj.addProperty(this, {
            all:{},
            pending: {},
            cancel: {},
            timeout: {},
            error: {},
            result: {},
        }, null, false, true);

    }

    watch(eng, state, msg) {
        eng = jet.to("engage", eng).echo(state, msg);
        const id = eng.id;

        this.all[id] = eng;
        this.pending[id] = eng;

        eng.finally(_=>{
            delete this.pending[id];
            const { state, msg } = eng;
            this[state][id] = eng;
            if (!msg) { this.rem(["pending", id]); }
            else { this.push({pending:{[id]:null}, [state]:{[id]:msg}}); }
        });

        if (eng.msg && (eng.is("waiting") || eng.is("pending"))) {
            this.set(["pending", id], eng.msg);
        }

        return eng;
    }

    getPending() { return this.get("pending"); }
    getCancel() { return this.get("cancel"); }
    getTimeout() { return this.get("timeout"); }
    getError() { return this.get("error"); }
    getResult() { return this.get("result"); }

    isPending() { return this.isFull("pending"); }
    isCancel() { return this.isFull("cancel"); }
    isTimeout() { return this.isFull("timeout"); }
    isError() { return this.isFull("error"); }
    isResult() { return this.isFull("result"); }

}



export default Tray;