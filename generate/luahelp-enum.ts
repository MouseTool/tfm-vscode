import { LuaHelpDocument } from "./LuaHelpDocument";

const TREE_DATA = /^(\s*)([a-zA-Z0-9]+)$/m;
const ENUM_VALUE = /^(\s*)([a-zA-Z0-9]+)\s:\s(\d+)$/m;

export class LuaHelpEnum {
  constructor(public name: string, public value: number) {}
}

export class LuaHelpEnumContainer {
  public containers: LuaHelpEnumContainer[];
  public enums: LuaHelpEnum[];

  constructor(public name: string, public parent?: LuaHelpEnumContainer) {
    this.containers = [];
    this.enums = [];
  }

  addContainer(container: LuaHelpEnumContainer) {
    this.containers.push(container);
  }

  addEnum(_enum: LuaHelpEnum) {
    this.enums.push(_enum);
  }
}

export class LuaHelpEnumDocument extends LuaHelpDocument {
  private _enum: LuaHelpEnumContainer;

  constructor(buf: string | string[]) {
    super(buf);
  }

  parse() {
    let _enum = new LuaHelpEnumContainer("tfm.enum");
    let inEnum = false;
    let identation = 2;

    for (const line of this.lines) {
      if (line.length === 0) continue;
      let m = TREE_DATA.exec(line);
      if (!inEnum) {
        if (m !== null) {
          inEnum = m[2] === "enum";
        }
        continue;
      }

      let e = ENUM_VALUE.exec(line);
      if (!m && !e) continue;

      let spaces = (m || e)[1].length / 2; // either m or e
      while (spaces < identation) {
        if (!_enum.parent) {
          this._enum = _enum;
          return;
        }
        _enum = _enum.parent;
        identation--;
      }

      if (spaces > identation) {
        throw new Error("Malformed luahelp.txt: unexpected identation");
      }

      if (m) {
        const container = new LuaHelpEnumContainer(
          `${_enum.name}.${m[2]}`,
          _enum
        );
        _enum.addContainer(container);
        _enum = container;
        identation++;
      } else {
        _enum.addEnum(new LuaHelpEnum(e[2], parseInt(e[3])));
      }
    }

    while (_enum.parent) {
      _enum = _enum.parent;
    }
    this._enum = _enum;
  }

  exportSumnekoLua(_enum?: LuaHelpEnumContainer) {
    _enum = _enum || this._enum;
    const newLines: string[] = [`${_enum.name} = {}`];

    for (const container of _enum.containers) {
      newLines.push(...this.exportSumnekoLua(container));
    }

    for (const entry of _enum.enums) {
      newLines.push(`${_enum.name}.${entry.name} = ${entry.value}`);
    }
    newLines.push("");

    return newLines;
  }
}
