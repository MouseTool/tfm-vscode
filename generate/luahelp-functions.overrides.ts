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
    name: "debug.getCurrentThreadName",
    modify: (lfnc) => {
      lfnc.setDescription("Gets the current lua thread name.");
      // Tig forgot to add a return type
      lfnc.setReturnType(
        new FunctionParam("Returns", "string", "the current thread name", false)
      );
    },
  },

  {
    name: "system.disableChatCommandDisplay",
    modify: (lfnc) => {
      // Just a minor typo in `hide` param
      const pHide = lfnc.params.get("hide");
      pHide.description = pHide.description.replace("hided", "hidden");
    },
  },

  {
    name: "system.giveEventGift",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Event elevation only.");
    },
  },

  {
    name: "system.loadFile",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Module team only.");
    },
  },

  {
    name: "system.loadPlayerData",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Module team only.");
    },
  },

  {
    name: "system.luaEventLaunchInterval",
    modify: (lfnc) => {
      // Tig forgot to add a return type
      lfnc.setReturnType(
        new FunctionParam("Returns", "integer", "Timer interval in min", false)
      );
    },
  },

  {
    name: "system.newTimer",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Module team only.");

      // Add function signature for callback
      const pCallback = lfnc.params.get("callback");
      pCallback.type =
        "fun(timerId:integer, arg1?:any, arg2?:any, arg3?:any, arg4?:any)";
      pCallback.description =
        "The function to call. The first argument of this function is the timer's identifier";
    },
  },

  {
    name: "system.removeTimer",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Module team only.");
    },
  },

  {
    name: "system.saveFile",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Module team only.");
    },
  },

  {
    name: "system.savePlayerData",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Module team only.");
    },
  },

  {
    name: "tfm.exec.addBonus",
    modify: (lfnc) => {
      // Add some clarity
      lfnc.setDescription("Adds a defilante bonus (token) to the map.");

      // Standardise param descriptions
      const replaceDesc = [
        // TODO: x -> xPosition
        ["x", "the horizontal coordinate of the bonus"],
        ["y", "the vertical coordinate of the bonus"],
        ["id", "the identifier of the bonus"],
        ["angle", "the angle of the bonus"],
        ["visible", "whether the bonus should be visible"],
        [
          "targetPlayer",
          "the player who should see the bonus (if nil, applies to all players)",
        ],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }
    },
  },

  {
    name: "tfm.exec.addImage",
    modify: (lfnc) => {
      // Add clarity to param descs
      const replaceDesc = [
        [
          "xPosition",
          "the horizontal offset of the anchor of the image, relative to the game element (0 being the middle of the game element) ",
        ],
        [
          "yPosition",
          "the vertical offset of the anchor of the image, relative to the game element (0 being the middle of the game element)",
        ],
        ["scaleX", "the horizontal (width) scale of the image"],
        ["scaleY", "the vertical (height) scale of the image"],
        [
          "rotation",
          "the opacity of the image, from 0 (transparent) to 1 (opaque)",
        ],
        [
          "alpha",
          "the opacity of the image, from 0 (transparent) to 1 (opaque)",
        ],
        [
          "anchorX",
          "the horizontal offset (in 0 to 1 scale) of the image's anchor, relative to the image (0 being the left of the image)",
        ],
        [
          "anchorY",
          "the vertical offset (in 0 to 1 scale) of the image's anchor, relative to the image (0 being the top of the image)",
        ],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }
    },
  },

  {
    name: "tfm.exec.addJoint",
    modify: (lfnc) => {
      // Point jointDef to custom type
      const pJoint = lfnc.params.get("jointDef");
      pJoint.type = "tfm.JointDef";
      pJoint.description = "the joint configuration";
    },
  },

  {
    name: "tfm.exec.addNPC",
    modify: (lfnc) => {
      // Tig forgot to add the description
      lfnc.setDescription("Spawns an NPC.")

      // Point npcDef to custom type
      const pNpc = lfnc.params.get("npcDef");
      pNpc.type = "tfm.NPCDef";
      pNpc.description = "the NPC configuration";
    },
  },

  {
    name: "tfm.exec.addPhysicObject",
    modify: (lfnc) => {
      // Point bodyDef to custom type
      const pBody = lfnc.params.get("bodyDef");
      pBody.type = "tfm.BodyDef";
      pBody.description = "the ground configuration";
    },
  },

  {
    name: "tfm.exec.addShamanObject",
    modify: (lfnc) => {
      // Point options to custom type and make optional
      const pOptions = lfnc.params.get("options");
      pOptions.type = "tfm.ShamanObjOpt";
      pOptions.description = "the shaman object configuration";
      pOptions.defaultValue = "nil";
    },
  },

  {
    name: "tfm.exec.attachBalloon",
    modify: (lfnc) => {
      lfnc.setDescription(
        "Spawns and attaches a ghost balloon to a player, or detaches all balloons."
      );

      // Add clarity to param descs
      const replaceDesc = [
        // TODO: attach
        ["yes", "whether the balloon should be attached"],
        // TODO: colorType
        ["color", "the color type of the balloon (between 1 and 4)"],
        // TODO: ghost
        ["transparent", "whether the spawned balloon should be transparent"],
        ["speed", "the vertical speed of the balloon"],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }

      // Tig forgot to add a return type
      lfnc.setReturnType(
        new FunctionParam(
          "Returns",
          "integer",
          "the shaman object identifier of the balloon",
          false
        )
      );
    },
  },

  {
    name: "tfm.exec.chatMessage",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.addDescription("Module team only.");
    },
  },

  {
    name: "tfm.exec.freezePlayer",
    modify: (lfnc) => {
      // Standardise description
      lfnc.setDescription("Freezes the selected player.");

      // Add clarity to param descs
      const replaceDesc = [
        ["playerName", "the player to freeze"],
        ["freeze", "whether the player should be frozen"],
        ["displayIce", "whether the ice sprite should be shown on the player"],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }
    },
  },

  {
    name: "tfm.exec.getPlayerSync",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription(
        "Gets the player who is the room's current synchronizer."
      );

      // Clarify permission level
      lfnc.addDescription("Module team only.");

      // Tig forgot to add a return type
      lfnc.setReturnType(
        new FunctionParam("Returns", "string", "the player's nickname", false)
      );
    },
  },

  {
    name: "tfm.exec.removeBonus",
    modify: (lfnc) => {
      // Add some clarity
      lfnc.setDescription("Removes a defilante bonus (token).");

      // Standardise param descriptions
      const replaceDesc = [
        ["id", "the identifier of the bonus"],
        [
          "targetPlayer",
          "the player whom should have the bonus removed (if nil, applies to all players)",
        ],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }
    },
  },

  {
    name: "tfm.exec.setPlayerSync",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription(
        "Changes the room's current synchronizer (or resets it)."
      );

      // Clarify permission level
      lfnc.addDescription("Module team only.");

      // Standardise param descriptions
      const replaceDesc = [
        [
          "playerName",
          "the player who should become the room sync (use nil to let the server decide)",
        ],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }
    },
  },

  {
    name: "tfm.exec.setWorldGravity",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription(
        "Changes the world acceleration along the horizontal (wind) and vertical (gravity) axes."
      );

      // Standardise param descriptions
      const replaceDesc = [
        // TODO: x -> xAcceleration
        ["x", "the horizontal acceleration of the world"],
        ["y", "the vertical acceleration of the world"],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }
    },
  },

  {
    name: "tfm.exec.setBackgroundColor",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription(
        "Sets the map background color."
      );

      // Standardise param descriptions
      const replaceDesc = [
        ["color", "the background color, in hex code format"],
      ];
      for (const r of replaceDesc) {
        const par = lfnc.params.get(r[0]);
        par.description = r[1];
      }
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
