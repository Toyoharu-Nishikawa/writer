import { point2d_t, point3d_t } from './Internals/TagsManager';
import DxfDocument from './DxfDocument';
import { values_t } from './Sections/HeaderSection/DxfVariable';
import GlobalState from './GlobalState';
import { options_t } from './Sections/EntitiesSection/Entity';
import {
	lwPolylineOptions_t,
	lwPolylineVertex_t,
} from './Sections/EntitiesSection/Entities/LWPolyline';
import { rectangleOptions_t } from './Internals/Utils';
import { insertOptions_t } from './Sections/EntitiesSection/Entities/Insert';
import { SplineArgs_t } from './Sections/EntitiesSection/Entities/Spline';
import { faceOptions_t } from './Sections/EntitiesSection/Entities/Face';
import {
	HatchBoundaryPaths,
	HatchGradientOptions_t,
	HatchOptions_t,
	HatchPatternOptions_t,
} from './Sections/EntitiesSection/Entities/Hatch';
import { ImageOptions_t } from './Sections/EntitiesSection/Entities/Image';
import { polylineOptions_t } from './Sections/EntitiesSection/Entities/Polyline';

/**
 * The base class for creating the dxf content.
 * @public
 */
export class DxfWriter {
	private readonly document: DxfDocument;

	get header() {
		return this.document.header;
	}

	get tables() {
		return this.document.tables;
	}

	get blocks() {
		return this.document.blocks;
	}

	get entities() {
		return this.document.entities;
	}

	constructor() {
		this.document = new DxfDocument();
	}

	/**
	 * Add a block to the blocks tables.
	 * @param name - The block name.
	 * @returns The added block.
	 */
	addBlock(name: string) {
		return this.document.blocks.addBlock(name);
	}

	/**
	 * Add a header variable to the dxf if not exist.
	 * If exist it will updates values.
	 *
	 * @example
	 * ```js
	 * const dxf = new DxfWriter();
	 * dxf.setVariable("$ANGDIR", {70: 1});
	 * dxf.setVariable("$EXTMAX", {10: 500, 20: 500, 30: 0});
	 * ```
	 * @param name - The name of the variable. Ex: $ANGDIR, $EXTMAX, ...
	 * @param values - The values correspanding to the variable.
	 */
	public setVariable(name: string, values: values_t) {
		this.document.header.setVariable(name, values);
	}

	/**
	 * Add a new LineType to the dxf.
	 *
	 * @param name - Name of the lineType.
	 * @param descriptive - The descriptive of the line ex: __ __ . __ __ .
	 * @param elements - An array of elements of the pattern. 📝 Need more explications 😭!
	 *
	 */
	public addLType(name: string, descriptive: string, elements: number[]) {
		return this.document.tables.addLType(name, descriptive, elements);
	}

	/**
	 * Add a Hatch entity to the dxf.
	 *
	 * @param boundaryPath - The boundary paths.
	 * @param fill - The fill aka solid or gradient.
	 * @param options - The options of the hatch entity.
	 * @returns The added hatch entity.
	 */
	public addHatch(
		boundaryPath: HatchBoundaryPaths,
		fill: HatchPatternOptions_t | HatchGradientOptions_t,
		options?: HatchOptions_t
	) {
		return this.document.modelSpace.addHatch(boundaryPath, fill, options);
	}

	/**
	 * Add a new Layer to the dxf.
	 *
	 * @param name - The name of the layer.
	 * @param color - The color number. See [AutoCAD Color Index](https://gohtx.com/acadcolors.php).
	 * @param lineType - The lineType name.
	 * @param flags - Layer standard flags (bit-coded values).
	 * @returns Return the current object of DxfWriter.
	 */
	public addLayer(name: string, color: number, lineType: string, flags = 0) {
		return this.document.tables.addLayer(name, color, lineType, flags);
	}

	/**
	 * Set the current layer name of the dxf.
	 * @throws
	 * @param name - The layer name.
	 * @returns Return the current object of DxfWriter.
	 */
	public setCurrentLayerName(name: string) {
		this.document.setCurrentLayerName(name);
	}

	/**
	 * Set the units of the dxf.
	 *
	 * @throws
	 * @param units - Use DXFWriter.units to set the unit.
	 * @returns Return the current object of DxfWriter.
	 */
	public setUnits(units: number) {
		if (Object.values(GlobalState.units).indexOf(units) > -1) {
			GlobalState.units = units;
		} else {
			throw new Error(`The ${units} is not a valid Units.`);
		}
	}

	/**
	 * Add a Line entity to the dxf.
	 *
	 * @param startPoint - The start point of the line.
	 * @param endPoint - The end point of the line.
	 * @param options - The options of the line entity.
	 * @returns Return the current object of DxfWriter.
	 */
	public addLine(
		startPoint: point3d_t,
		endPoint: point3d_t,
		options?: options_t
	) {
		return this.document.modelSpace.addLine(startPoint, endPoint, options);
	}

	/**
	 * Add a LWPolyline entity to the dxf.
	 *
	 * [Dxf Polyline](http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-ABF6B778-BE20-4B49-9B58-A94E64CEFFF3)
	 *
	 * The Polyline entity can represent the Rectangle and the Polygon
	 * just pass the array of points and LWPolylineFlags.Closed flag.
	 *
	 * @param points - An array of {@link lwPolylineVertex_t}.
	 * @param options - The options of LWPolyline entity.
	 *
	 * @returns Return the current object of DxfWriter.
	 */
	public addLWPolyline(
		points: lwPolylineVertex_t[],
		options: lwPolylineOptions_t = {}
	) {
		return this.document.modelSpace.addLWPolyline(points, options);
	}

	/**
	 * Add a Rectangle as closed lwpolyline entity to the dxf.
	 * In DXF Reference there is no entity called Rectangle or Polygon.
	 * To represent this entities (Rectangle and Polygon) use Polyline entity (Closed).
	 *
	 * @param topLeft - The topleft corner of the rectangle.
	 * @param bottomRight - The bottom right corner of the rectangle.
	 * @param options - The options to apply to the rectangle.
	 * @returns Return the current object of DxfWriter.
	 */
	public addRectangle(
		topLeft: point2d_t,
		bottomRight: point2d_t,
		options?: rectangleOptions_t
	) {
		return this.document.modelSpace.addRectangle(
			topLeft,
			bottomRight,
			options || {}
		);
	}

	/**
	 * Add a 3D Polyline entity to the dxf.
	 *
	 * @param points - An array of points.
	 * @param options - The options to apply to the polyline.
	 *
	 * @returns Return the current object of DxfWriter.
	 */
	public addPolyline3D(
		points: (point3d_t | point2d_t)[],
		options?: polylineOptions_t
	) {
		return this.document.modelSpace.addPolyline3D(points, options);
	}

	/**
	 * Add a Point entity to the dxf.
	 *
	 * @param x - The X coordinate of the point.
	 * @param y - The Y coordinate of the point.
	 * @param z - The Z coordinate of the point.
	 * @param options - The options to apply to the point.
	 * @returns Return the current object of DxfWriter.
	 */
	public addPoint(x: number, y: number, z: number, options?: options_t) {
		return this.document.modelSpace.addPoint(x, y, z, options);
	}

	/**
	 * Add a Circle entity to the dxf.
	 *
	 * @param center - The center point of the circle.
	 * @param radius - The radius of the circle.
	 * @param options - The Circle entity options;
	 * @returns Return the current object of DxfWriter.
	 */
	public addCircle(center: point3d_t, radius: number, options?: options_t) {
		return this.document.modelSpace.addCircle(center, radius, options);
	}

	/**
	 * Add an Arc entity to the dxf.
	 *
	 * @param center - The center of the arc.
	 * @param radius - The radius of the arc.
	 * @param startAngle - The start of the angle (begining of arc) in degrees Anticlockwise.
	 * @param endAngle - The end of the angle (end of arc) in degrees Anticlockwise. \
	 * 					 Angles always start from X-axis towards anticlockwise.
	 * @param options - Arc entity options.
	 * @returns Return the current object of DxfWriter.
	 */
	public addArc(
		center: point3d_t,
		radius: number,
		startAngle: number,
		endAngle: number,
		options?: options_t
	) {
		return this.document.modelSpace.addArc(
			center,
			radius,
			startAngle,
			endAngle,
			options
		);
	}

	/**
	 * Add a Spline entity to the dxf. It's a NURBS.
	 *
	 * NURBS, Non-Uniform Rational B-Splines, are mathematical representations of 3D geometry that
	 * can accurately describe any shape from a simple 2D line, circle, arc, or curve to the most
	 * complex 3D organic free-form surface or solid. Because of their flexibility and accuracy,
	 * NURBS models can be used in any process, from illustration and animation to manufacturing.
	 *
	 * For more informations see : [NURBS](https://www.rhino3d.com/features/nurbs/) and
	 * [Dxf Spline](http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-E1F884F8-AA90-4864-A215-3182D47A9C74)
	 *
	 * @param splineArgs - The Spline arguments. See {@link SplineArgs}.
	 * @param options - The options of the spline entity.
	 * @returns
	 */
	public addSpline(splineArgs: SplineArgs_t, options?: options_t) {
		return this.document.modelSpace.addSpline(splineArgs, options);
	}

	/**
	 * Add an Ellipse entity to the dxf.
	 *
	 * @param center - The center point of the ellipse.
	 * @param endPointOfMajorAxis - The end point of major axis, relative to the center of the ellipse.
	 * @param ratioOfMinorAxisToMajorAxis - The ratio of minor axis to major axis.
	 * @param startParameter - The start parameter (this value is 0.0 for a full ellipse).
	 * @param endParameter - The end parameter (this value is 2pi for a full ellipse).
	 * @returns Return the current object of DxfWriter.
	 */
	public addEllipse(
		center: point3d_t,
		endPointOfMajorAxis: point3d_t,
		ratioOfMinorAxisToMajorAxis: number,
		startParameter: number,
		endParameter: number,
		options?: options_t
	) {
		return this.document.modelSpace.addEllipse(
			center,
			endPointOfMajorAxis,
			ratioOfMinorAxisToMajorAxis,
			startParameter,
			endParameter,
			options
		);
	}

	/**
	 * Add an Image entity to the dxf.
	 * @example
	 * ```js
	 * const dxf = new DxfWriter();
	 * dxf.addImage(
	 * 	'.\\test.png',		 // Or the absolute path if not in the same folder.
	 * 	'test',				// The name of the image.
	 * 	point3d(10, 10, 0),	// The insertion point.
	 * 	600,				   // The width of the image in pixels.
	 * 	600, 				  //The height of the image in pixels.
	 * 	1, 					// The scale to be applied to the image.
	 * 	0 					 //The scale to be applied to the image.
	 * );
	 * ```
	 * @param imagePath - The path of the image.
	 * @param name - The name of the image.
	 * @param insertionPoint - The insertion point.
	 * @param width - The width of the image in pixels.
	 * @param height - The height of the image in pixels.
	 * @param scale - The scale to be applied to the image.
	 * @param rotation - The rotation angle (Degrees) to be applied to the image.
	 * @returns Return the current object of DxfWriter.
	 */
	public addImage(
		imagePath: string,
		name: string,
		insertionPoint: point3d_t,
		width: number,
		height: number,
		scale: number,
		rotation: number,
		options?: ImageOptions_t
	) {
		return this.document.addImage(
			imagePath,
			name,
			insertionPoint,
			width,
			height,
			scale,
			rotation,
			options
		);
	}

	/**
	 * Add a 3D Face entity to the dxf.
	 *
	 * @param firstCorner - The first corner of the 3d face.
	 * @param secondCorner - The first corner of the 3d face.
	 * @param thirdCorner - The first corner of the 3d face.
	 * @param fourthCorner - The first corner of the 3d face. \
	 * If you want only three corners, make this is the same as the third corner
	 * @param options - The options of the 3dFace antity.
	 * @returns Return the current object of DxfWriter.
	 */
	public add3dFace(
		firstCorner: point3d_t,
		secondCorner: point3d_t,
		thirdCorner: point3d_t,
		fourthCorner: point3d_t,
		options?: faceOptions_t
	) {
		return this.document.modelSpace.add3dFace(
			firstCorner,
			secondCorner,
			thirdCorner,
			fourthCorner,
			options
		);
	}

	/**
	 * Add a text entity to the dxf.
	 * @param firstAlignementPoint - The first alignment point of the text.
	 * @param height - The text height.
	 * @param value - The default value (the string itself).
	 * @returns Return the current object of DxfWriter.
	 */
	public addText(
		firstAlignementPoint: point3d_t,
		height: number,
		value: string,
		options?: options_t
	) {
		return this.document.modelSpace.addText(
			firstAlignementPoint,
			height,
			value,
			options
		);
	}

	/**
	 * Add an insert entity to the dxf.
	 *
	 * @param blockName - The name of the block to insert.
	 * @param insertionPoint - The point where the block is to be inserted.
	 * @param options - The options of the Insert entity.
	 * @returns Return the current object of DxfWriter.
	 */
	public addInsert(
		blockName: string,
		insertionPoint: point3d_t,
		options?: insertOptions_t
	) {
		return this.document.modelSpace.addInsert(
			blockName,
			insertionPoint,
			options
		);
	}

	/**
	 * Get the content of the dxf.
	 *
	 * @returns Return the dxf string.
	 */
	public stringify(): string {
		return this.document.stringify();
	}
}