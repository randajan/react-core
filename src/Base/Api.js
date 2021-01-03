import jet from "@randajan/react-jetpack";

class ApiErr extends Error {
    constructor(request, response) {
        const { method, url } = request;
        const { status, statusText } = response;

        super(jet.str.to([method, url, status, statusText], " "));

        this.name = "ApiError"; // (different names for different built-in error classes)
        this.request = request;
        this.response = response;
    }
}

class Api {

    static toForm(obj) {
        const form = new FormData();
        jet.map.it(obj, (v,k)=>form.append(k,v));
        return form;
    }

    static isForm(body) {
        return jet.type.is(FormData, body) || (jet.ele.is(body) && body.tagName === "FORM");
    }

    static getContentType(body) {
        if (Api.isForm(body)) { return "multipart/form-data"; }
        if (jet.obj.is(body)) { return "application/json"; }
        return "text/plain";
    }

    constructor(url, token) {
        jet.obj.prop.add(this, {
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
        const fetchJson = jet.bol.tap(acceptJson, isJson);
        const json = response.json = fetchJson ? jet.obj.json.from(text) : undefined;

        jet.obj.prop.add(response, "body", fetchJson ? json : text, false, true, true);
        if (response.ok) { return response.body; }

        const error = new ApiErr( {method, url, headers, body}, response );
        this.errors.push(error);
        throw error;
    }

    get(path, body, headers, acceptJson) {return this.fetch("GET", path, body, headers, acceptJson);}
    post(path, body, headers, acceptJson) {return this.fetch("POST", path, body, headers, acceptJson);}
    put(path, body, headers, acceptJson) {return this.fetch("PUT", path, body, headers, acceptJson);}
    delete(path, body, headers, acceptJson) {return this.fetch("DELETE", path, body, headers, acceptJson);}

}

export default Api;