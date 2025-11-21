import request from '@/utils/request'

// 获取农资列表
export function getSuppliesList_API(params: any) {
  return request<any, any>({
    url: "/farm/supplies/pageSupplies",
    method: 'get',
    params
  })
}

// 创建农资
export function createSupplies_API(data: any) {
  return request<any, any>({
    url: `/farm/supplies/createSupplies`,
    method: 'post',
    data
  })
}

// 更新农资
export function updateSupplies_API(data: any) {
  return request<any, any>({
    url: `/farm/supplies/updateSupplies`,
    method: 'put',
    data
  })
}

// 删除农资
export function deleteSupplies_API(params: any) {
  return request<any, any>({
    url: `/farm/supplies/deleteSupplies`,
    method: 'delete',
    params
  })
}

// 农资详情
export function getSuppliesDetail_API(params: any) {
  return request<any, any>({
    url: `/farm/supplies/detail`,
    method: 'get',
    params
  })
}

// 农资入库
export function inStockSupplies_API(data: any) {
  return request<any, any>({
    url: `/farm/supplies/inStock`,
    method: 'post',
    data
  })
}

// 农资出库
export function outStockSupplies_API(data: any) {
  return request<any, any>({
    url: `/farm/supplies/outStock`,
    method: 'post',
    data
  })
}

// 获取库存流水
export function getSuppliesFlow_API(params: any) {
  return request<any, any>({
    url: `/farm/supplies/getStockFlow`,
    method: 'get',
    params
  })
}

// 上传农资图片
export function uploadSuppliesImg_API(data: any) {
  return request<any, any>({
    url: `/farm/supplies/uploadImage`,
    method: 'post',
    data,
    headers: { "Content-Type": "multipart/form-data" },
  })
}

// 获取农资类型字典
export function getSuppliesType_API() {
  return request<any, any>({
    url: "/farm/supplies/getSuppliesType",
    method: 'get',
  })
}

// 农资统计
export function getSuppliesStats_API(params?: any) {
  return request<any, any>({
    url: "/farm/supplies/getStats",
    method: 'get',
    params
  })
}
