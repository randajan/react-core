

import Serf from "../Helpers/Task";

import Core from "./Core";

class Images extends Serf {

    constructor(core, path, files) {
        super(core, path);

        this.fit("files", Core.fetchFiles);

        this.set({ files });
    }



}

export default Images;