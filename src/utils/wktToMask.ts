//导入处理wkt的库
import * as wkx from "wkt";

// 将WKT数据转换为坐标点数组
export function wktToMask(AMap:any,wktString: string){
  const geometry:any = wkx.parse(wktString);
  let result = [];
  // 根据几何类型进行处理
  if (geometry.type === 'Polygon') {
      // 如果是多边形，转换坐标并将结果放入一个数组中
      result.push(geometry.coordinates[0].map((coord:any) => new AMap.LngLat(coord[0], coord[1])));
  } else if (geometry.type === 'MultiPolygon') {
      // 如果是多多边形，处理每个多边形
      geometry.coordinates.forEach((polygon: any) => {
        polygon.forEach((ring: any) => {
            const ringCoords = ring.map((coord: any) => new AMap.LngLat(coord[0], coord[1]));
            result.push(ringCoords);
        });
    });
  } else {
      throw new Error('Provided WKT is neither a Polygon nor a MultiPolygon');
  }

  return [result];
}