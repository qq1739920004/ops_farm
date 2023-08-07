import request from '@/utils/request'
export function getInfoMangementInfoAPI(params: any) {
  return request({
    url: "/carModuleInfo/page",
    method: 'get',
    params
  })
}
export function addInfoMangementInfoAPI(data: any) {
  return request({
    url: "/carModuleInfo/save",
    method: 'post',
    data
  })
}
export function editInfoMangementInfoAPI(data: any) {
  return request({
    url: "/carModuleInfo/update",
    method: 'put',
    data
  })
}