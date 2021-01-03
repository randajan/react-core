import jet from "@randajan/jetpack";

class BaseErr extends Error {
    constructor(message) {
        super(message)
        this.name = "BaseError"; // (different names for different built-in error classes)
    }
}

function filterChanges(path, changes) {
    const result = [];
    path = jet.str.to(path, ".");
    jet.map.it(changes, v=>{ if (v !== path && v.startsWith(path)) { result.push(v.splice(0, path.length+1)); } } );
    return result;
}

function untieArgs(path, a1, a2, t1, t2, d2) {
    const args = [ path, a1, a2];
    if ( a2 === undefined && jet.type.is(t1, path) && (a1 === undefined || jet.type.is(t2, a1))) { args.unshift(""); }
    args[0] = jet.str.to(args[0], ".");
    args[2] = jet.type.only(t2, args[2], d2);
    return args;
}

export {
    BaseErr,
    filterChanges,
    untieArgs,
}