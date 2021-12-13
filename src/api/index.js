import request from '@/utils/request'

export function farmSuperAdministrator_path(params) {
  return request({
    url: '/farm/car/farmSuperAdministrator',
    method: 'post',
    params
  })
}

export function permissionList_path(params) {
  return request({
    url: '/farm/role/permission/list',
    method: 'get',
    params
  })
}

export function helpList_path(params) {
  return request({
    url: '/farm/help/list',
    method: 'post',
    params
  })
}
