declare module "d3-delaunay" {
  export class Delaunay {
    static from(points: Array<[number, number]>): Delaunay;
    voronoi(bounds: [number, number, number, number]): {
      cellPolygon(index: number): Array<[number, number]> | null;
    };
  }
}
