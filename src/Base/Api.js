import jet from "@randajan/jetpack";

class ApiErr extends Error {
    constructor(request, response) {
        const { method, url } = request;
        const { status, statusText } = response;

        super([method, url, status, statusText].joins(" "));

        this.name = "ApiError"; // (different names for different built-in error classes)
        this.request = request;
        this.response = response;
    }
}

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
            errors:[]
        }, null, false, true)
    }

    toForm(obj) { return Api.toForm(obj); }
    isForm(obj) { return Api.isForm(obj); }
    getContentType(body) { return Api.getContentType(body); }

    fetchOptions(method, body, headers, acceptJson) {
        const type = Api.getContentType(body);
        const accept = acceptJson ? "application/json" : undefined;
        if (type === "application/json") { body = jet.str.to(body); }
        return {
            method, body,
            credentials: "include",
            headers: {
                ...headers,
                accept,
                origin: window.origin,
                authorization: jet.str.to(this.token)
            }
        };
    }

    async fetch(method, path, body, headers, acceptJson) {
        const options = this.fetchOptions(method, body, headers, acceptJson);
        path = jet.str.to(path);
        const url = this.url+(path.startsWith("/") ? path : "/"+path);
        const response = await fetch(url, options);
        const text = response.text = await response.text();
        const isJson = response.headers.get("content-type") === "application/json";
        const fetchJson = jet.get("boolean", acceptJson, isJson);
        const json = response.json = fetchJson ? jet.obj.fromJSON(text) : undefined;

        jet.obj.addProperty(response, "body", fetchJson ? json : text, false, true, true);
        if (response.ok) { return response.body; }

        const error = new ApiErr( {method, url, headers, body}, response );
        this.errors.push(error);
        return error;
    }

    get(path, body, headers, acceptJson) {return this.fetch("GET", path, body, headers, acceptJson);}
    post(path, body, headers, acceptJson) {return this.fetch("POST", path, body, headers, acceptJson);}
    put(path, body, headers, acceptJson) {return this.fetch("PUT", path, body, headers, acceptJson);}
    delete(path, body, headers, acceptJson) {return this.fetch("DELETE", path, body, headers, acceptJson);}

}

export default Api;