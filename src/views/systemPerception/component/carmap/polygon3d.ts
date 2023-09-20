export function poly3d(AMap:any,maskPoly:any,map:any,polylines:any){
  for (let i = 0; i < maskPoly.length; i += 1) {
    const polyline = new AMap.Polyline({
      path: maskPoly[i],
      strokeColor: "rgba(215, 221, 218)",
      strokeWeight: 5,
      fillColor:'transparent',
      map: map.value,
  });
  // let res3d = polygon3d(AMap, maskPoly[i]);
  //   const polyline2 =  new AMap.Polygon({
  //     path: res3d,
  //     strokeColor: "rgba(215, 221, 218)",
  //     strokeWeight: 5,
  //     strokeOpacity: 0.8,
  //     fillColor:'transparent',
  //     map: map.value,
  //   });
    polylines.push(polyline);
    // polylines.push(polyline2);
}
}

function polygon3d(AMap:any,maskPoly:any){
  let polygon= maskPoly.map((item:any)=>{
    return item.map((lngLat: any) => {
         // 获取经度和纬度
         let lng = lngLat.getLng();
         let lat = lngLat.getLat();
         // 创建新的AMap.LngLat对象，经度和纬度减少一定值以形成3D效果
         return new AMap.LngLat(lng - 0.025, lat - 0.025); // 将经度和纬度减少的值调小，使得3D轮廓比原来的轮廓小一圈
       });
   })
   return polygon
 }

