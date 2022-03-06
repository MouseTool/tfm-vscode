export interface LuaHelpDocument {
  parse(): void;
  exportSumnekoLua(): string[];
}

export abstract class LuaHelpDocument {
  protected lines: string[];

  constructor(protected buf: string | string[]) {
    this.lines = typeof buf === "string" ? buf.split(/\r?\n/) : buf;
  }
}
