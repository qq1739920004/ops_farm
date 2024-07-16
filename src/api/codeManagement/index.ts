import request from '@/utils/request'

export function sacredCowQrList_path(params: any) {
  return request<any, any>({
    url: "/farm/sacredCowQr/list",
    method: 'post',
    params
  })
}

export function sacredCowQrSave_path(params: any) {
  return request<any, any>({
    url: "/farm/sacredCowQr/save",
    method: 'post',
    params
  })
}
// 编辑信息
export function sacredCowQrUpdate_path(params: any) {
  return request<any, any>({
    url: '/farm/sacredCowQr/update',
    method: 'post',
    params
  })
}
// 删除
export function sacredCowQrRemove_path(params:any) {
  return request<any, any>({
    url: '/farm/sacredCowQr/remove',
    method: 'post',
    params
  })
}
export function sacredCowQrExport_path(params:any) {
  return request<any, any>({
    url: '/farm/sacredCowQr/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}