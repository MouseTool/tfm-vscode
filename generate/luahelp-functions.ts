import { overrides } from "./luahelp-functions.overrides";
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

export class FunctionParam {
  public description: string;
  public additionalDescription: string[];
  public defaultValue?: string;
  public type: string;

  constructor(
    public name: string,
    type: string,
    description: string = "",
    isTypeFromLuaHelp = true
  ) {
    if (isTypeFromLuaHelp) {
      this.type = MAP_TO_EMMYLUA[type];
      if (!this.type) throw "no known type " + type;
    } else {
      this.type = type;
    }
    this.additionalDescription = [];

    // Strip away the default value
    const m = description.match(/(.*?)\s*\(default (.*?)\)\s*$/m);
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

export class LuaHelpFunction {
  public description: string;
  public additionalDescription: string[];
  public params: Map<string, FunctionParam>;
  public returnType?: FunctionParam;

  constructor(public name: string) {
    this.description = "";
    this.additionalDescription = [];
    this.params = new Map<string, FunctionParam>();
    this.returnType = null;
  }

  addParam(param: FunctionParam) {
    this.params.set(param.name, param);
  }

  setDescription(description: string) {
    this.description = description;
  }

  addDescription(desc: string) {
    this.additionalDescription.push(desc);
  }

  setReturnType(type: FunctionParam) {
    this.returnType = type;
  }
}

const FUNC_START_REGEX = /^([a-zA-Z0-9.]+?)\(.*\)$/m;
const FUNC_PARAM_REGEX = /^ {2}([a-zA-Z0-9]+) \(([a-zA-Z0-9]+)\) ([^\n]+)$/;
const FUNC_RETURNS_REGEX = /^Returns \(([a-zA-Z0-9]+)\) ([^\n]+)$/;

export class LuaHelpFunctionDocument extends LuaHelpDocument {
  private funcs: LuaHelpFunction[];

  constructor(buf: string | string[], private disableOverrides = false) {
    super(buf);
  }

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

    const endFunc = () => {
      if (currentFunc) {
        // Override if needed
        if (!this.disableOverrides) {
          const o = overrides[currentFunc.name];
          if (o) {
            if (o.type == "add") {
              throw `Your override "${o.name}" is an existing LuaHelp function. Please remove it!`;
            }
            o.modify(currentFunc);
          }
        }
        funcs.push(currentFunc);
      }
      currentFunc = null;
    };

    for (const line of this.lines) {
      if (line.length == 0) continue;
      let m = FUNC_START_REGEX.exec(line);
      if (m !== null) {
        // save curr
        endParam();
        endFunc();
        currentFunc = new LuaHelpFunction(m[1]);
      } else if (currentFunc !== null) {
        if (line.startsWith(" ".repeat(4))) {
          // param desc cont
          currentParam.addDescription(line);
        } else if ((m = FUNC_PARAM_REGEX.exec(line))) {
          endParam();
          currentParam = new FunctionParam(m[1], m[2], m[3]);
        } else if ((m = FUNC_RETURNS_REGEX.exec(line))) {
          currentFunc.setReturnType(new FunctionParam("Returns", m[1], m[2]));
        } else {
          currentFunc.setDescription(line);
        }
      }
    }

    endParam();
    endFunc();
    console.debug(JSON.stringify(funcs, null, 2));

    this.funcs = funcs;
  }

  exportSumnekoLua() {
    const newLines: string[] = [];

    for (const func of this.funcs) {
      const parNames = [];
      newLines.push(`--- ${func.description}`);
      for (const desc of func.additionalDescription) {
        newLines.push(`--- ${desc}`);
      }

      for (const par of func.params.values()) {
        newLines.push(
          `--- @param ${par.name}${par.isOptional ? "?" : ""} ${par.type} ${
            par.description
          }${par.defaultValue ? ` (default \`${par.defaultValue}\`)` : ""}`
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
