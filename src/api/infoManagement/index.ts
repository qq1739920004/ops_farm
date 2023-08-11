import request from '@/utils/request'
//信息模块接口
// 分页查询
import { carMoudleInfoGetLeftResponseData, carModuleInfoResponseData, PageObj, newRecordsObj, editResponseData, changeResponseData, carModuleInfoOperationLogResponseData, carMoudleInfoDeleteResponseData } from './type'
export function carModuleInfo_API(data: PageObj) {
  return request<any, carModuleInfoResponseData>({
    url: "/carModuleInfo/page",
    method: 'post',
    data
  })
}
export function carModuleInfoSave_API(data: newRecordsObj) {
  return request<any, changeResponseData>({
    url: "/carModuleInfo/save",
    method: 'post',
    data
  })
}
export function carModuleInfoUpdate_API(data: newRecordsObj) {
  return request<any, editResponseData>({
    url: `/carModuleInfo/update`,
    method: 'put',
    data
  })
}
export function carModuleInfoGet_API(id: Number) {
  return request<any, carMoudleInfoGetLeftResponseData>({
    url: `/carModuleInfo/get?id=${id}`,
    method: 'get',
  })
}
export function carModuleInfoOperationLog_API(id: number) {
  return request<any, carModuleInfoOperationLogResponseData>({
    url: `/carModuleInfo/operationLog/${id}`,
    method: 'get',
  })
}
export function carModuleInfoOperationDelete_API(data: any) {
  return request<any, carMoudleInfoDeleteResponseData>({
    url: `/carModuleInfo/delete?id=${data}`,
    method: 'delete',
  })
}