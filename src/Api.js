import jet from "@randajan/jetpack";

class Api {
    Core;
    Storage;
    origin = window.location.protocol+"//"+window.location.host;
    url;

    constructor(Core, url) {
        jet.obj.addProperty(this, {
            Core,
            Storage:Core.Storage.open("api"),
            url,
        }, null, false, true);
    }

    formatOptions(method, data, headers) {
        const options = {
            method: method,
            dataType: "JSON",
            credentials: 'include',
            headers: {
                ...headers,
                Accept: 'application/json',
                Origin: this.origin,
                Authorization: this.Core.Auth.getAccessToken(true),
                //"X-CSRF-Token": this.Storage.get("csrf")
            }
        };
    
        if (method === "GET") {}
        else if (method === "POST") {options.body = Api.dataToForm(data);}

        return options;
    }

    async fetch(method, path, data, headers) {
        return fetch(this.url + path, this.formatOptions(method, data, headers))
            .then(resp => {
                this.Storage.set("csrf", resp.headers.get("x-csrf-token"));
                return resp.json();
            })
            .catch(err => console.log(err));
    }

    async get(path, data, headers) {return this.fetch("GET", path, data, headers);}
    async post(path, data, headers) {return this.fetch("POST", path, data, headers);}
    async put(path, data, headers) {return this.fetch("PUT", path, data, headers);}
    async delete(path, data, headers) {return this.fetch("DELETE", path, data, headers);}

    static dataToForm(data) {
        const form = new FormData();
        for (let i in data) {form.append(i, data[i]);}
        return form;
    }

    static create(...args) {return new Api(...args);}

}

export default Api;