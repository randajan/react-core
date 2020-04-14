import React from 'react';

import jet from "@randajan/jetpack";

const ICONS = [];

class Icons {

    constructor(Core, prefix, list, size, onChange) {
        const id = ICONS.push({})-1;

        prefix = jet.get("string", prefix, "Ico");
        size = jet.get("number", size)||24;
        list = Icons.fetchList(list);

        jet.obj.addProperty(this, {
            Core,
            Storage:Core.Cache.open("ico"), 
            onChange:new Set([onChange]),
            id,
            prefix,
            size,
            list,
            state:{}
        }, null, false, true);

        Object.defineProperty(this, "viewBox", {enumerable:true, get:_=>`0 0 ${size} ${size}`})

    }

    get(props) {
        const { prefix, viewBox } = this;
        const { src, className, title } = props;
        const fullId = this.getFullId(src);
        this.load(src);
        return (
            <svg {...props} className={jet.obj.join([prefix, src, className]," ")} viewBox={viewBox}>
                {title ? <title>{title}</title> : null}
                <use className="svgShadow" xlinkHref={"#"+fullId}/>
                <use xlinkHref={"#"+fullId}/>
            </svg>
        )
    }

    getFullId(id) {
        return [this.prefix, this.id, id].join("-");
    }

    getSymbol(id) {
        const __html = this.Storage.get(id);
        if (__html) {
            return <symbol key={id} id={this.getFullId(id)} viewBox={this.viewBox} dangerouslySetInnerHTML={{__html}}/>
        }
    }

    getSymbols() {
        const symbols = [];
        jet.obj.map(this.Storage.get(), (strap, id)=>symbols.push(this.getSymbol(id)))
        return symbols;
    }

    getDefs() {
        const props = {
            xmlns:'http://www.w3.org/2000/svg',
            xmlnsXlink:'http://www.w3.org/1999/xlink',
            viewBox:this.viewBox,
            style:{display:"none"}
        }   
        return (
            <svg {...props}>
                <defs>
                    {this.getSymbols()}
                </defs>
            </svg>
        )
    }

    async load(id) {
        if (this.state[id] != null) {return false;}
        this.state[id] = true;
        const svg = await this.fetch(id);
        const strap = Icons.svgStrap(svg);
        this.state[id] = !!strap;
        this.Storage.set(id, strap);
        jet.run(this.onChange, this);
        return true;
    }

    async fetch(id) {
        const path = this.list[id];
        if (!path) { return }
        return fetch(path).then(resp=>resp.text());
    }

    static create(...args) {
        return new Icons(...args);
    }

    static fetchList(list) {
        const nlist = jet.get("object", list);
        if (jet.is("array", list)) {
            list.map(path=>nlist[path.match(/[^\/\s\n\r\.]+(?=\.)/)[0]] = path);
        }
        return nlist;
    }

    static svgStrap(svg) {
        return jet.get("string", svg).replace(/^[\S\s]*<svg [^>]*>/, "").replace(/<\/svg>[\S\s]*/, "");
    }

}

export default Icons;