//导入处理wkt的库
import * as wkx from "wkt";

// 将WKT数据转换为坐标点数组
export function wktToMask(AMap:any,wktString: string){
  const geometry:any = wkx.parse(wktString);
  let result:any = [];
  // 根据几何类型进行处理
  if (geometry.type === 'Polygon') {
      // 如果是多边形，转换坐标并将结果放入一个数组中
      geometry.coordinates.forEach((ring: any) => {
        result.push(ring.map((coord: any) => new AMap.LngLat(coord[0], coord[1])));
      })
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

export function convertGeojsonToAMapLngLat(AMap:any,geojson: any){
  // 结果数组，用于存储转换后的AMap.LngLat对象
  let result:any = [];
  // 遍历geojson的features属性
  geojson.features.forEach((feature:any) => {
      let resultItem:any=[];
      // 获取geometry中的坐标数据
      let coordinates = feature.geometry.coordinates
      // 遍历坐标数据
      coordinates.forEach((coordinateGroup:any) => {
          //用下方的isArray函数替换
          isArray(resultItem,coordinateGroup,AMap)
      });
      result.push([resultItem]);
  });

  // 返回结果数组
  return result;
}
function isArray(resultItem:any[],data:any,AMap:any){
  if(Array.isArray(data[0])){
    data.forEach((item:any)=>{
      isArray(resultItem,item,AMap)
    })
  }else{
    resultItem.push(new AMap.LngLat(data[0],data[1]));
  }
}