const fs = require('fs');


class Param {
    constructor(name, type, description) {
        this.name = name;
        this.type = type;
        this.description = description || "";
        this.additional_description = [];
    }

    addDescription(add) {
        this.additional_description.push(add);
    }
}

/**
 * @class TfmFunction
 */
class TfmFunction {
    constructor(name) {
        this.name = name;
        this.description = "";
        /**
         * @type {Param[]}
         * @public
         */
        this.params = [];
        this.type = null;
    }

    /**
     * 
     * @param {Param} param 
     */
    addParam(param) {
        this.params.push(param);
    }

    /**
     * 
     * @param {string} description 
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * 
     * @param {Param} type 
     */
    setType(type) {
        this.type = type;
    }
}

const FUNC_START_REGEX = /^([a-zA-Z0-9.]+?)\(.*\)$/m;
const FUNC_PARAM_REGEX = /^ {2}([a-zA-Z0-9]+) \(([a-zA-Z0-9]+)\) ([^\n]+)$/;
const FUNC_RETURNS_REGEX = /^Returns \(([a-zA-Z0-9]+)\) ([^\n]+)$/;

/**
 * 
 * @param {string} content 
 */
function parseFunctions(content) {
    var lines = content.split(/\r\n/);
    var funcs = [];
    var currentFunc = null;
    var currentParam = null;
    
    var endParam = function() {
        if (currentParam) {
            currentFunc.addParam(currentParam);
        }
        currentParam = null;
    }

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.length == 0) continue;
        let m;
        if ((m = FUNC_START_REGEX.exec(line)) !== null) {
            // save curr
            endParam();
            if (currentFunc) {
                funcs.push(currentFunc);
            }
            //if (m[1] == "tfm.exec.addPhysicObject") continue;
            currentFunc = new TfmFunction(m[1]);
        } else if (currentFunc !== null) {
            if (line.startsWith(" ".repeat(4))) {
                //param desc cont
                currentParam.addDescription(line);
            } else if (m = FUNC_PARAM_REGEX.exec(line)) {
                //param
                endParam();
                currentParam = new Param(m[1], m[2], m[3]);
            } else if (m = FUNC_RETURNS_REGEX.exec(line)) {
                currentFunc.setType(new Param("Returns", m[1], m[2]));
            } else {
                //console.log("A",line)
                currentFunc.setDescription(line);
            }
        }
    }
    endParam();
    if (currentFunc) {
        funcs.push(currentFunc);
    }

    console.log(JSON.stringify(funcs, null, 2))

    generateDocs(funcs);
}

const MAP_TO_EMMYLUA = {
    "String": "string",
    "Int": "integer",
    "Number": "integer",
    "Boolean": "boolean",
    "Table": "table",
    "Function": "function",
    "Object": "any"
}

/**
 * 
 * @param {TfmFunction[]} funcs 
 */
function generateDocs(funcs) {
    var new_lines = [];
    for (let i = 0;i < funcs.length; i++) {
        let func = funcs[i];
        let par_names = [];
        new_lines.push(`--- ${func.description}`);
        func.params.forEach((par) => {
            let type = MAP_TO_EMMYLUA[par.type];
            if (!type) throw 'no known type ' + par.type;
            new_lines.push(`--- @param ${par.name} ${type} ${par.description}`);
            par.additional_description.forEach((desc) => {
                new_lines.push(`--- ${desc}`);
            });
            par_names.push(par.name);
        });
        if (func.type) {
            let type = MAP_TO_EMMYLUA[func.type.type];
            if (!type) throw 'no known type ' + func.type.type;
            new_lines.push(`--- @return ${type} @${func.type.description}`);
        }
        new_lines.push(`function ${func.name}(${par_names.join(',')}) end`)
        new_lines.push("");
    }

    fs.writeFileSync('gen.lua', new_lines.join("\n"));
}

var buf = fs.readFile('luahelp.txt', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }

    parseFunctions(data);
});
