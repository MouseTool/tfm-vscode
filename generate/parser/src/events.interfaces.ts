export interface LuaHelpEventParameter {
  name: string;
  description: string;
  /**
   * Additional descriptions, each being defined as texts per line, after `description`.
   */
  // TODO: Seems that all additional descriptions have "-" before them in each line... should we strip that away?
  additionalDescriptions: string[];
  type: string;
}

export interface LuaHelpEvent {
  name: string;
  description: string;
  parameters: LuaHelpEventParameter[];
}
