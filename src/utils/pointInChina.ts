
import { mainLand_array, taiWan_array } from './geoData_array'
/* eslint-disable */

//中国大致经纬度 纬度 73.55-135.08   经度:3.85 - 53.55

function pointInChina(position = [31.172800343248, 121.406021546488]) {
    if (position.length !== 2) {
        console.error('The argument is an array of longitude and latitude, with longitude first and latitude last')
        return;
    };
    if ((position[0] < 3.85 || position[0] > 53.55) || (position[1] < 73.55) || position[1] > 135.08) {
        console.log('Must be abroad')
        return false;
    }

    function isDotInPolygon(point: any, polygonPoints: any) {
        var flag = false,
            p1,
            p2;
        for (var i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
            p1 = polygonPoints[i];
            p2 = polygonPoints[j];
            // 这里判断是否刚好被测点在多边形的边上
            //   if(isDotInLineSegment(point, p1, p2)) return true;
            if ((p1.y > point.y != p2.y > point.y) && (point.x < (point.y - p1.y) * (p1.x - p2.x) / (p1.y - p2.y) + p1.x)) {
                flag = !flag;
            }
        }
        return flag;
    }

    function isInPolygon(checkPoint: any, polygonPoints: any) {
        var counter = 0;
        var i;
        var xinters;
        var p1, p2;
        var pointCount = polygonPoints.length;
        p1 = polygonPoints[0];
        for (i = 1; i <= pointCount; i++) {
            p2 = polygonPoints[i % pointCount];
            if (checkPoint[0] > Math.min(p1[0], p2[0]) && checkPoint[0] <= Math.max(p1[0], p2[0])) {
                if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
                    if (p1[0] != p2[0]) {
                        xinters = (checkPoint[0] - p1[0]) * (p2[1] - p1[1]) / (p2[0] - p1[0]) + p1[1];
                        if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                            counter++;
                        }
                    }
                }
            }
            p1 = p2;
        }
        if (counter % 2 == 0) {
            return false;
        } else {
            return true;
        }
    }

    try {
        let a = isInPolygon(position, mainLand_array);
        let b = isInPolygon(position, taiWan_array);
        if (a || b) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

export default pointInChina