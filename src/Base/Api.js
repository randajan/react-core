import jet from "@randajan/jetpack";

class Api {

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

    constructor(url, token) {

        jet.obj.addProperty(this, {
            url,
            token,
            error:[]
        }, null, false, true)
    }

    toForm(obj) { return Api.toForm(obj); }
    isForm(obj) { return Api.isForm(obj); }
    getContentType(body) { return Api.getContentType(body); }

    fetchOptions(method, body, headers) {
        const type = Api.getContentType(body);
        if (type === "application/json") { body = jet.str.to(body); }
        return {
            method, body,
            credentials: "include",
            headers: {
                ...headers,
                accept: "application/json",
                origin: window.origin,
                authorization: jet.str.to(this.token),
                //"X-CSRF-Token": this.Storage.get("csrf")
            }
        };
    }

    async fetch(method, path, body, headers) {
        const options = this.fetchOptions(method, body, headers);
        const url = this.url+"/"+jet.str.to(path);
        return fetch(url, options);
    }

    async fetchJSON(method, path, body, headers) {
        let reply = "";
        try {
            reply = await this.fetch(method, path, body, headers).then(resp=>resp.text())
            return JSON.parse(reply);
        } catch (error) {
            this.error.push({ method, path, body, headers, reply, error})
            throw error;
        }
    }

    get(path, body, headers) {return this.fetch("GET", path, body, headers);}
    post(path, body, headers) {return this.fetch("POST", path, body, headers);}
    put(path, body, headers) {return this.fetch("PUT", path, body, headers);}
    delete(path, body, headers) {return this.fetch("DELETE", path, body, headers);}

    getJSON(path, body, headers) {return this.fetchJSON("GET", path, body, headers);}
    postJSON(path, body, headers) {return this.fetchJSON("POST", path, body, headers);}
    putJSON(path, body, headers) {return this.fetchJSON("PUT", path, body, headers);}
    deleteJSON(path, body, headers) {return this.fetchJSON("DELETE", path, body, headers);}

}

export default Api;