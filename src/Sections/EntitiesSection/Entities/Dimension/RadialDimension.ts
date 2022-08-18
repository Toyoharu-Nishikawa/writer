import { Dxifier } from '../../../../Internals/Dxifier';
import { vec3_t } from '../../../../Internals/Helpers';
import { Dimension, DimensionOptions, DimensionType } from './Dimension';

export interface RadialDimOptions extends DimensionOptions {
	leaderLength?: number;
}

export class RadialDimension extends Dimension {
	first: vec3_t;
	leaderLength?: number;

	constructor(first: vec3_t, second: vec3_t, options?: RadialDimOptions) {
		super(options);
		this.dimensionType =
			DimensionType.Radius | DimensionType.ReferencedByThis;
		this.first = first;
		this.definitionPoint = second;
		this.leaderLength = options?.leaderLength;
	}

	override dxify(dx: Dxifier): void {
		super.dxify(dx);
		dx.subclassMarker('AcDbRadialDimension');
		dx.push(15, this.first.x);
		dx.push(25, this.first.y);
		dx.push(35, this.first.z);
		dx.push(40, this.leaderLength);
	}
}