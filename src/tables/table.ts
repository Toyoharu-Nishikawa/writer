import { AppDefined, Handle, TagsManager } from "@/utils";
import { Entry } from "./entry";
import { Taggable } from "@/types";

export class Table implements Taggable {
  readonly handle: Handle;
  readonly handleSeed: string;
  ownerObjectHandle: string;
  protected entries: Entry[];

  readonly xdictionary: AppDefined;

  constructor(public readonly name: string, handle: Handle) {
    this.handle = handle;
    this.handleSeed = handle.next();
    this.ownerObjectHandle = "0";
    this.entries = [];
    this.xdictionary = new AppDefined("ACAD_XDICTIONARY");
  }

  addEntry<E extends Entry>(entry: E) {
    entry.ownerObjectHandle = this.handleSeed;
    this.entries.push(entry);
    return entry;
  }

  tagify(mg: TagsManager): void {
    mg.add(0, "TABLE");
    mg.add(2, this.name);
    mg.add(5, this.handleSeed);
    this.xdictionary.tagify(mg);
    mg.add(330, this.ownerObjectHandle);
    mg.add(100, "AcDbSymbolTable");
    mg.add(70, this.entries.length);
    this.entries.forEach((e) => e.tagify(mg));
    mg.add(0, "ENDTAB");
  }
}