import { wktToMask } from "@/utils/wktToMask";
import type { MonitorObj } from "@/api/perception/type";

interface locationType{
  lat:string,
  lng:string
}
let mask: any = [];
let maskPoly: any = [];

function purifyBaiduData(AMap: any, data: any, _cityName: string) {
  let poly = wktToMask(AMap, data.districts[0].polyline);
  if (poly.length) {
    if (poly[0].length > 1) {
      poly[0].forEach((item: any) => {
        mask.push([item])

      });
    } else {
      mask.push([poly[0][0]])
    }
    maskPoly = [...maskPoly, ...poly];
  }
  return [mask, maskPoly];
}

function purifyCityArr(data: MonitorObj["provinceCars"]) {
  let codeArr: string[] = [];
  let location: locationType[] = [];
  data.forEach((item) => {
    if (item.code&&item.lat&&item.lng&&item.cityName) {
      codeArr.push(item.code.padEnd(6, "0"));
      location.push({lat:item.lat,lng:item.lng})
    }
  });
  return {codeArr,location};
}

export { purifyBaiduData, purifyCityArr}
export type { locationType }