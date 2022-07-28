import { describe, expect, it } from 'vitest';
import { Dxifier } from '../../../../src';
import Point from '../../../../src/Sections/EntitiesSection/Entities/Point';

describe('Point', () => {
	const dataState = {
		instancesCount: 0,
	};
	it('should return the subClassName given.', () => {
		const entity = new Point(0, 0, 0, {});
		dataState.instancesCount++;
		expect(entity.subclassMarker).toBe('AcDbPoint');
	});

	it('should the given parameters.', () => {
		const entity = new Point(
			2444578787454548787878455454.33578787,
			4.54874541454545454,
			0.141111222155555555444,
			{}
		);
		dataState.instancesCount++;
		expect(entity.x).toBe(2444578787454548787878455454.33578787);
		expect(entity.y).toBe(4.54874541454545454);
		expect(entity.z).toBe(0.141111222155555555444);
	});

	it('should return the correct dxf string.', () => {
		const entity = new Point(
			24445787874545.336,
			47854548454.54874,
			0.14111122215556,
			{}
		);
		dataState.instancesCount++;
		const handle = dataState.instancesCount.toString(16).toUpperCase();
		let entityString = `0\nPOINT\n5\n${handle}\n100\nAcDbEntity\n8\n0\n100\nAcDbPoint\n`;
		entityString +=
			'10\n24445787874545.336\n20\n47854548454.54874\n30\n0.14111122215556';
		const mg = new Dxifier();
		entity.dxify(mg);
		expect(mg.stringify()).toBe(entityString);
	});
});
