import request from '@/utils/request'
//公用的相关请求接口-
export function selectUserRecentVisitList_path(params:any) {
  return request({
    url: '/farm/gateway/auth/user/selectUserRecentVisitList',
    method: 'get',
    params
  })
}
