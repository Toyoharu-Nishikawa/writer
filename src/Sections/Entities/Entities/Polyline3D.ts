import Entity from "../Entity.js";
import Vertex from "./Vertex.js";
import Tag from "../../../Internals/Tag.js";

export default class Polyline3D extends Entity
{
    get flag(): number {
        return this._flag;
    }
    get points(): number[][] {
        return this._points;
    }
    private readonly _points: number[][];
    private readonly _flag: number;
    private _vertexes: Vertex[] = [];
    private readonly _seqHandle: string;
    public constructor(points: number[][], flag: number) {
        super('POLYLINE', 'AcDb3dPolyline');
        this._points = points;
        this._flag = flag;
        this.points.forEach((point) => {
            this._vertexes.push(new Vertex(point, 32));
        });
        this._seqHandle = this.handleSeed();
    }

    public tags(): Tag[] {
        let tags: Tag[] = super.tags();
        tags.push(new Tag(66, 1));
        tags.push(new Tag(10, 0));
        tags.push(new Tag(20, 0));
        tags.push(new Tag(30, 0));
        tags.push(new Tag(70, this.flag));
        this._vertexes.forEach((vertex) => {
            tags = tags.concat(vertex.tags());
        });
        tags.push(new Tag(0, 'SEQEND'));
        tags.push(new Tag(5, this._seqHandle));
        tags.push(new Tag(100, 'AcDbEntity'));
        tags.push(new Tag(8, this.layerName));

        return tags;
    }
}
