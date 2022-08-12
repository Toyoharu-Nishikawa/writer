import { Dxifier } from '../../Internals/Dxifier';
import { point3d, point3d_t } from '../../Internals/Utils';
import EntitiesManager from '../EntitiesSection/EntitiesManager';
import DxfObjectsSection from '../ObjectsSection/DxfObjectsSection';
import EndBlk from './DxfEndBlk';

export enum BlockFlags {
	None = 0,
	AnonymousBlock = 1,
	HasNonConstantAttribute = 2,
	XRef = 4,
	XRefOverlay = 8,
	ExternallyDependent = 16,
	ResolvedXRef = 32,
	ReferencedXRef = 64,
}

export default class DxfBlock extends EntitiesManager {
	readonly name: string;
	readonly endBlk: EndBlk;
	stringifyEntities = true;
	ownerObjectHandle?: string;
	flags: BlockFlags;
	basePoint: point3d_t;
	xrefPathName: string;

	constructor(name: string, objects: DxfObjectsSection) {
		super(objects, '0');
		this.name = name;
		this.flags = BlockFlags.None;
		this.endBlk = new EndBlk();
		this.basePoint = point3d(0, 0, 0);
		this.xrefPathName = '';
	}

	setlayerName(layerName: string) {
		this.layerName = layerName;
	}

	override dxify(dx: Dxifier): void {
		dx.type('BLOCK');
		dx.handle(this.handle);
		dx.push(330, this.ownerObjectHandle);
		dx.subclassMarker('AcDbEntity');
		dx.layerName(this.layerName);
		dx.subclassMarker('AcDbBlockBegin');
		dx.name(this.name);
		dx.push(70, this.flags);
		dx.point3d(this.basePoint);
		dx.name(this.name, 3);
		dx.push(1, this.xrefPathName);
		if (this.stringifyEntities) super.dxify(dx);
		this.endBlk.dxify(dx);
	}
}
