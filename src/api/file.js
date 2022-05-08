import request from '@/utils/request'
export function getFileProductList(params) {
    return request({
      url: '/lu/log/productTypeDir',
      method: 'post',
      data: params
    })
  }
  export function getFileSnList(params) {
    return request({
      url: '/lu/log/snForProductTypeDir',
      method: 'post',
      data: params
    })
  }
  export function getChildrenFileList(params) {
    return request({
      url: '/lu/log/filesForSn',
      method: 'post',
      data: params
    })
  }
  export function searchFileSnList(params) {
    return request({
      url: '/lu/log/fuzzySearchBySn',
      method: 'post',
      data: params
    })
  }


export function getBackFileSnList(params) {
  return request({
    url: '/lu/log/ftpDirListFiles',
    method: 'post',
    data:params
  })
}