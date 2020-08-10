
import jet from "@randajan/jetpack";

import Serf from "../Base/Serf";

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

        if (eng.msg && eng.pending) {
            this.set(["pending", id], eng.msg);
        }

        return eng;
    }

    getPending() { return jet.arr.to(this.get("pending")).filter(_=>_); }
    getCancel() { return jet.arr.to(this.get("cancel")).filter(_=>_); }
    getTimeout() { return jet.arr.to(this.get("timeout")).filter(_=>_); }
    getError() { return jet.arr.to(this.get("error")).filter(_=>_); }
    getResult() { return jet.arr.to(this.get("result")).filter(_=>_); }

    isPending() { return this.isFull("pending"); }
    isCancel() { return this.isFull("cancel"); }
    isTimeout() { return this.isFull("timeout"); }
    isError() { return this.isFull("error"); }
    isResult() { return this.isFull("result"); }

}



export default Tray;