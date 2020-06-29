import jet from "@randajan/jetpack";

import Serf from "../Base/Serf";

class Api extends Serf {

    static toForm(obj) {
        const form = new FormData();
        jet.obj.map(obj, (v,k)=>form.append(k,v));
        return form;
    }

    static isForm(body) {
        return jet.is(FormData, body) || (jet.is("element", body) && body.tagName === "FORM");
    }

    static getContentType(body) {
        const type = jet.type(body);
        if (Api.isForm(body)) { return "multipart/form-data"; }
        if (type === "object") { return "application/json"; }
        return "text/plain";
    }

    constructor(Core, path, url, token) {
        super(Core, path);
        const origin = window.origin;
        
        jet.obj.addProperty(this, {
            pending:{},
            cache:{},
        }, null, false, true);

        this.lock("origin", origin);

        this.set({
            origin,
            url,
            token
        });
    }

    toForm(obj) { return Api.toForm(obj); }
    isForm(obj) { return Api.isForm(obj); }
    getContentType(body) { return Api.getContentType(body); }

    fetchOptions(method, body, headers) {
        const { origin, token } = this.get();

        const type = Api.getContentType(body);
        if (type === "application/json") { body = jet.str.to(body); }
        return {
            method, body,
            credentials: "include",
            headers: {
                ...headers,
                origin,
                accept: "application/json",
                authorization: jet.str.to(token),
                //"X-CSRF-Token": this.Storage.get("csrf")
            }
        };
    }

    toCache(id, data) {
        return this.cache[id] = { timestamp:new Date(), data };
    }

    fromCache(id, timeout) {
        const cache = this.cache[id];
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

        const prom = this.pending[id] = fetch(this.get("url")+"/"+path, this.fetchOptions(method, body, headers)).then(resp=>resp.json())

        reply = await prom;
        delete this.pending[id];
        if (cache) { this.toCache(id, reply); }
        return reply;
    }

    GET(path, body, headers, cache) {return this.fetch("GET", ...jet.untie({path, body, headers, cache}));}
    POST(path, body, headers, cache) {return this.fetch("POST", ...jet.untie({path, body, headers, cache}));}
    PUT(path, body, headers, cache) {return this.fetch("PUT", ...jet.untie({path, body, headers, cache}));}
    DELETE(path, body, headers, cache) {return this.fetch("DELETE", ...jet.untie({path, body, headers, cache}));}

}

export default Api;