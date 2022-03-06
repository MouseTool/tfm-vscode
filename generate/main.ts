import { promises as fsp } from "fs";
import { LuaHelpMainDocument } from "./luahelp-main";

function generate(luaHelpBuf: string) {
  const doc = new LuaHelpMainDocument(luaHelpBuf);
  doc.parse();
  return doc.exportSumnekoLua().join("\n");
}

(async () => {
  console.log("Generating output...");
  const output = generate((await fsp.readFile("./luahelp.txt")).toString());
  console.log("Generated.");
  await fsp.writeFile("luaLib/library/tfm.functions.lua", output);
  console.log("Wrote output to file.");
})();
