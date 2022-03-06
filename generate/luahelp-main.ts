import { LuaHelpFunctionDocument } from "./luahelp-functions";
import { LuaHelpDocument } from "./LuaHelpDocument";

type LuaHelpMainDocumentModes = "function";

export class LuaHelpMainDocument extends LuaHelpDocument {
  protected funcDoc!: LuaHelpFunctionDocument;

  parse() {
    let mode: LuaHelpMainDocumentModes | null;
    let bufLines: Partial<Record<LuaHelpMainDocumentModes, string[]>> = {};

    for (const line of this.lines) {
      if (line == "Functions") {
        if (mode != "function") {
          mode = "function";
          bufLines[mode] = [];
        }
        continue;
      }

      if (mode == "function") {
        bufLines[mode].push(line);
      }
    }

    this.funcDoc = new LuaHelpFunctionDocument(bufLines["function"]);
    this.funcDoc.parse();
  }

  exportSumnekoLua(): string[] {
    return this.funcDoc.exportSumnekoLua();
  }
}
