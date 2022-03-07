import { LuaHelpDocument } from "./LuaHelpDocument";

const MAP_TO_EMMYLUA: Record<string, string> = {
  String: "string",
  Int: "integer",
  Number: "number",
  Boolean: "boolean",
  Table: "table",
  Function: "function",
  Object: "any",
};

class FunctionParam {
  public description: string;
  public additionalDescription: string[];
  public defaultValue?: string;
  public type: string;

  constructor(
    public name: string,
    luaHelpType: string,
    description: string = ""
  ) {
    this.type = MAP_TO_EMMYLUA[luaHelpType];
    if (!this.type) throw "no known type " + luaHelpType;
    this.additionalDescription = [];

    // Strip away the default value
    const m = description.match(/(.*)\(default (.*)\)\s?$/m);
    if (m != null) {
      const [_, strippedDesc, defaultVal] = m;
      this.description = strippedDesc;
      this.defaultValue = defaultVal;
    } else {
      this.description = description;
    }
  }

  get isOptional() {
    return this.defaultValue != null;
  }

  addDescription(desc: string) {
    this.additionalDescription.push(desc);
  }
}

class LuaHelpFunction {
  private _description: string;
  private _params: FunctionParam[];
  private _returnType?: FunctionParam;

  constructor(public name: string) {
    this._description = "";
    this._params = [];
    this._returnType = null;
  }

  public get description() {
    return this._description;
  }

  public get params() {
    return this._params;
  }

  public get returnType() {
    return this._returnType;
  }

  addParam(param: FunctionParam) {
    this._params.push(param);
  }

  setDescription(description: string) {
    this._description = description;
  }

  setReturnType(type: FunctionParam) {
    this._returnType = type;
  }
}

const FUNC_START_REGEX = /^([a-zA-Z0-9.]+?)\(.*\)$/m;
const FUNC_PARAM_REGEX = /^ {2}([a-zA-Z0-9]+) \(([a-zA-Z0-9]+)\) ([^\n]+)$/;
const FUNC_RETURNS_REGEX = /^Returns \(([a-zA-Z0-9]+)\) ([^\n]+)$/;

export class LuaHelpFunctionDocument extends LuaHelpDocument {
  private funcs: LuaHelpFunction[];

  parse() {
    const funcs: LuaHelpFunction[] = [];
    let currentFunc: LuaHelpFunction | null = null;
    let currentParam: FunctionParam | null = null;

    const endParam = () => {
      if (currentParam) {
        currentFunc.addParam(currentParam);
      }
      currentParam = null;
    };

    for (const line of this.lines) {
      if (line.length == 0) continue;
      let m = FUNC_START_REGEX.exec(line);
      if (m !== null) {
        // save curr
        endParam();
        if (currentFunc) {
          funcs.push(currentFunc);
        }
        currentFunc = new LuaHelpFunction(m[1]);
      } else if (currentFunc !== null) {
        if (line.startsWith(" ".repeat(4))) {
          //param desc cont
          currentParam.addDescription(line);
        } else if ((m = FUNC_PARAM_REGEX.exec(line))) {
          //param
          endParam();
          currentParam = new FunctionParam(m[1], m[2], m[3]);
        } else if ((m = FUNC_RETURNS_REGEX.exec(line))) {
          currentFunc.setReturnType(new FunctionParam("Returns", m[1], m[2]));
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
    console.debug(JSON.stringify(funcs, null, 2));

    this.funcs = funcs;
  }

  exportSumnekoLua() {
    const newLines: string[] = [];

    for (const func of this.funcs) {
      const parNames = [];
      newLines.push(`--- ${func.description}`);

      for (const par of func.params) {
        newLines.push(
          `--- @param ${par.name}${par.isOptional ? "?" : ""} ${par.type} ${
            par.description
          }${par.defaultValue ? `(default \`${par.defaultValue}\`)` : ""}`
        );
        for (const desc of par.additionalDescription) {
          newLines.push(`--- ${desc}`);
        }
        parNames.push(par.name);
      }
      if (func.returnType) {
        newLines.push(
          `--- @return ${func.returnType.type} @${func.returnType.description}`
        );
      }
      newLines.push(`function ${func.name}(${parNames.join(", ")}) end`);
      newLines.push("");
    }

    return newLines;
  }
}
