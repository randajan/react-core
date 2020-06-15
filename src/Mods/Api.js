import jet from "@randajan/jetpack";

import Core from "./Core";

class Api {

    origin = window.location.protocol+"//"+window.location.host;

    constructor(Storage, url) {
        jet.obj.addProperty(this, {
            Storage,
            url:jet.get("string", url),
            pending:{}
        }, null, false, true);
    }

    fetchOptions(method, body, headers) {
        return {
            method,
            body,
            headers: {
                "content-type": Api.getContentType(body),
                ...headers,
                Accept: 'application/json',
                Origin: this.origin,
                Authorization: this.Core.Auth.getAccessToken(true),
                //"X-CSRF-Token": this.Storage.get("csrf")
            }
        };
    }

    toCache(id, data) {
        return this.Storage.set(["cache", id], {timestamp:new Date(), data}, true);
    }

    fromCache(id, timeout) {
        const cache = this.Storage.get(["cache", id]);
        if (!cache) { return }
        const msleft = new jet.Amount(timeout, "s").valueOf("ms");
        if (new Date().getTime() < new Date(cache.timestamp).getTime()+msleft) {
            return cache.data;
        }
    }

    async fetch(method, path, body, headers, cache) {
        [method, path, body, headers, cache] = jet.untie({method, path, body, headers, cache});
        const id = jet.obj.toJSON([method, path, body, headers]);

        let reply = this.fromCache(id, cache);

        if (reply != null) { return reply; }

        if (this.pending[id]) { return await this.pending[id]; }

        const prom = this.pending[id] = fetch(this.url + path, this.fetchOptions(method, body, headers))
            .then(resp=>{
                this.Storage.set("csrf", resp.headers.get("x-csrf-token"));
                return resp.json();
            })

        reply = await prom;
        delete this.pending[id];
        if (cache) { this.toCache(id, reply); }
        return reply;
    }

    get(path, body, headers, cache) {return this.fetch("GET", ...jet.untie({path, body, headers, cache}));}
    post(path, body, headers, cache) {return this.fetch("POST", ...jet.untie({path, body, headers, cache}));}
    put(path, body, headers, cache) {return this.fetch("PUT", ...jet.untie({path, body, headers, cache}));}
    delete(path, body, headers, cache) {return this.fetch("DELETE", ...jet.untie({path, body, headers, cache}));}

    static create(...args) {return new Api(...args);}

    static toForm(obj) {
        const form = new FormData();
        jet.obj.map(obj, (v,k)=>form.append(k, v));
        return form;
    }

    static isForm(body) {
        return jet.is(FormData, body) || (jet.is("element", body) && body.tagName === "FORM");
    }

    static getContentType(body) {
        const type = jet.type(body);
        if (type === "string" || type === "number") { return "text/plain"; }
        if (Api.isForm(body)) { return "multipart/form-data"; }
        if (type === "object") { return "application/json"; }
    }

    static use(...path) {
        return Core.use("Api", ...path);
    }

    static useStorage(...path) {
        return Api.use("Storage", ...path);
    }

}

export default Api;