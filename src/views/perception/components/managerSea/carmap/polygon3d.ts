export function poly3d(AMap: any, maskPoly: any, map: any, polylines: any) {
  for (let i = 0; i < maskPoly.length; i += 1) {
      const path = maskPoly[i];
      const sampledPath = path.map((subpath:any) => samplePoints(subpath, 3));
      
      const polyline = new AMap.Polyline({
          path: sampledPath,
          strokeColor: "rgb(157, 254, 175)",
          strokeWeight: 1.2,
          fillColor: 'transparent',
          map: map.value,
      });

      // let res3d = polygon3d(AMap, sampledPath);

      // const polyline2 = new AMap.Polygon({
      //     path: res3d,
      //     strokeColor: "rgba(215, 221, 218)",
      //     strokeWeight: 5,
      //     strokeOpacity: 0.8,
      //     fillColor: 'transparent',
      //     map: map.value,
      // });

      polylines.push(polyline);
      // polylines.push(polyline2);
  }
}

function samplePoints(subpath: any[], interval: number) {
  return subpath.filter((_, index) => index % interval === 0);
}

function polygon3d(AMap: any, maskPoly: any) {
  let polygon = maskPoly.map((item: any) => {
      return item.map((lngLat: any) => {
          let lng = lngLat.getLng();
          let lat = lngLat.getLat();
          return new AMap.LngLat(lng - 0.1, lat - 0.1);
      });
  })
  return polygon;
}