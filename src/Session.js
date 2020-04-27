
import jet from "@randajan/jetpack";
import Storage from "./Storage";

class Session extends Storage {
    constructor(url, version, Crypt, onChange) {
        super(null, async content => fetch(url, { method: "POST", body: Api.dataToForm({content}) }), version, Crypt);
        jet.obj.addProperty(this, "url", url);
    }

    async start() {
        const content = jet.obj.get(await fetch(this.url).then(data => data.json()), "content");
        this.load(content);
        return this;
    }

    static create(url, Crypt) {return new Session(url, Crypt);}
}

export default Session;