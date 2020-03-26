
import jet from "@randajan/jetpack";
import Storage from "./Storage";
import Api from "./Api";

class Session extends Storage {
    constructor(url, Crypt) {
        super(null, async content => fetch(url, { method: "POST", body: Api.dataToForm({content}) }), Crypt);
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