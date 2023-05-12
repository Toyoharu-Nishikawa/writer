import { Units, XData, XHandle, XTagsManager } from "../utils";
import { Entry } from "./entry";
import { XTable } from "./table";

export interface BlockRecordOptions {
  name: string;
  layoutObjectHandle?: string;
  insertionUnits?: number;
  explodability?: number;
  scalability?: number;
  bitmapPreview?: string;
}

export class BlockRecordEntry extends Entry {
  name: string;
  layoutObjectHandle: string;
  insertionUnits: number;
  explodability: number;
  scalability: number;
  bitmapPreview?: string;
  acadXData: XData;

  constructor(options: BlockRecordOptions, handle: XHandle) {
    super("BLOCK_RECORD", handle);
    this.name = options.name;
    this.layoutObjectHandle = options.layoutObjectHandle || "0";
    this.insertionUnits = options.insertionUnits ?? Units.Unitless;
    this.explodability = options.explodability ?? 1;
    this.scalability = options.scalability ?? 0;
    this.acadXData = new XData("ACAD");
  }

  override tagify(mg: XTagsManager): void {
    super.tagify(mg);
    mg.add(100, "AcDbBlockTableRecord");
    mg.add(2, this.name);
    mg.add(340, this.layoutObjectHandle);
    mg.add(70, this.insertionUnits);
    mg.add(280, this.explodability);
    mg.add(281, this.scalability);
    mg.add(310, this.bitmapPreview);
    this.acadXData.tagify(mg);
  }
}

export class XBlockRecord extends XTable {
  constructor(handle: XHandle) {
    super("BLOCK_RECORD", handle);
  }

  add(options: BlockRecordOptions) {
    const block = new BlockRecordEntry(options, this.handle);
    this.entries.push(block);
    return block;
  }
}
