import { LuaHelpEvent } from "./events.interfaces";
import { LuaHelpFunction } from "./functions.interfaces"
import { LuaHelpTreeRootNode } from "./tree.interfaces"

export interface LuaHelp {
    tree: LuaHelpTreeRootNode;
    events: LuaHelpEvent[];
    functions: LuaHelpFunction[];
    version: string;
}
