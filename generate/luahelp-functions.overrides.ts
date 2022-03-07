import { FunctionParam, LuaHelpFunction } from "./luahelp-functions";

interface IOverrideModify {
  name: string;
  modify: (lfnc: LuaHelpFunction) => void;
}

interface IOverrideAdd {
  name: string;
  lfnc: LuaHelpFunction;
}

// Edit modifiers here
const modifiers: IOverrideModify[] = [
  {
    name: "d",
    modify: (lfnc) => {
      //lfnc.addParam(new FunctionParam(""));
    },
  },
];

// Edit adders here
// TODO: not supported
const adders: IOverrideAdd[] = [];

type OverrideType =
  | ({ type: "modify" } & IOverrideModify)
  | ({ type: "add" } & IOverrideAdd);

export const overrides: Record<string, OverrideType> = {};

// Populate record
for (const m of modifiers) {
  overrides[m.name] = {
    type: "modify",
    ...m,
  };
}
for (const m of adders) {
  overrides[m.name] = {
    type: "add",
    ...m,
  };
}
