import request from '@/utils/request'
import { carModuleInfoResponseData, PageObj, newRecordsObj, editResponseData, changeResponseData, SaleResponseData, carModuleInfoOperationLogResponseData, carMoudleInfoDeleteResponseData } from './type'
export function carModuleInfo_API(params: PageObj) {
  return request<any, carModuleInfoResponseData>({
    url: "/carModuleInfo/page",
    method: 'get',
    params
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
    url: "/carModuleInfo/update",
    method: 'put',
    data
  })
}
export function carModuleInfoGet_API(data: newRecordsObj) {
  return request<any, SaleResponseData>({
    url: "/carModuleInfo/get",
    method: 'get',
    data
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