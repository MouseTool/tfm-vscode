import { LuaHelpFunctionDocument } from "./luahelp-functions";
import { LuaHelpEnumDocument } from "./luahelp-enum";
import { LuaHelpDocument, LuaHelpDocumentModes } from "./LuaHelpDocument";

export class LuaHelpMainDocument extends LuaHelpDocument {
  protected funcDoc!: LuaHelpFunctionDocument;
  protected enumDoc!: LuaHelpEnumDocument;

  parse() {
    let mode: LuaHelpDocumentModes | null;
    let bufLines: Partial<Record<LuaHelpDocumentModes, string[]>> = {};
    let modes: Record<string, LuaHelpDocumentModes | null> = {
      "Lua tree": "enums",
      Events: null, // unused, so no need to get this mode
      Functions: "functions",
    };

    for (const line of this.lines) {
      if (modes.hasOwnProperty(line)) {
        if (mode != modes[line]) {
          mode = modes[line];
          if (mode) {
            bufLines[mode] = [];
          }
          continue;
        }
      }

      if (mode) {
        bufLines[mode].push(line);
      }
    }

    this.funcDoc = new LuaHelpFunctionDocument(bufLines["functions"]);
    this.funcDoc.parse();
    this.enumDoc = new LuaHelpEnumDocument(bufLines["enums"]);
    this.enumDoc.parse();
  }

  exportSumnekoLua() {
    return {
      functions: this.funcDoc.exportSumnekoLua(),
      enums: this.enumDoc.exportSumnekoLua(),
    } as Record<LuaHelpDocumentModes, string[]>;
  }
}
