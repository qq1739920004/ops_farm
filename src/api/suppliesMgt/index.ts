import request from '@/utils/request'

// 获取农资列表参数类型
export interface GetSuppliesListParams {
  farmId: number; // 关联农场ID（必需）
  name?: string; // 农资名称（模糊查询，可选）
  type?: number; // 农资类型（1种子、2农药、3肥料、4其他，可选）
  current: number; // 当前页码（必需）
  size: number; // 每页条数（必需）
}

// 农资列表项类型
export interface SuppliesItem {
  id: number;
  imageUrl: string;
  name: string;
  type: number;
  typeName: string;
  productionEnterprise: string;
  unit: string;
  createTime: string;
  stockQuantity: number;
  stockFlowCount: number;
}

// 获取农资列表返回类型
export interface GetSuppliesListResponse {
  code: number;
  message: string;
  data: {
    total: number;
    records: SuppliesItem[];
  };
  type: number;
}

// 获取农资列表
export function getSuppliesList_API(params: GetSuppliesListParams) {
  return request<any, GetSuppliesListResponse>({
    url: "/farm/agricultural-material/page-with-stock",
    method: 'get',
    params
  })
}

// 创建农资
export function createSupplies_API(data: any) {
  return request<any, any>({
    url: `/farm/agricultural-material/addAm`,
    method: 'post',
    data
  })
}

// // 更新农资
// export function updateSupplies_API(data: any) {
//   return request<any, any>({
//     url: `/farm/supplies/updateSupplies`,
//     method: 'put',
//     data
//   })
// }

// // 删除农资
// export function deleteSupplies_API(params: any) {
//   return request<any, any>({
//     url: `/farm/supplies/deleteSupplies`,
//     method: 'delete',
//     params
//   })
// }

// // 农资详情
// export function getSuppliesDetail_API(params: any) {
//   return request<any, any>({
//     url: `/farm/supplies/detail`,
//     method: 'get',
//     params
//   })
// }

// 农资入库
export function inStockSupplies_API(data: any) {
  return request<any, any>({
    url: `/farm/agricultural-material/in`,
    method: 'post',
    data
  })
}

// 农资出库
export function outStockSupplies_API(data: any) {
  return request<any, any>({
    url: `/farm/agricultural-material/out`,
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
    url: `/farm/vehicle/uploadImage`,
    method: 'post',
    data,
    headers: { "Content-Type": "multipart/form-data" },
  })
}

// // 获取农资类型字典
// export function getSuppliesType_API() {
//   return request<any, any>({
//     url: "/farm/supplies/getSuppliesType",
//     method: 'get',
//   })
// }

// // 农资统计
// export function getSuppliesStats_API(params?: any) {
//   return request<any, any>({
//     url: "/farm/supplies/getStats",
//     method: 'get',
//     params
//   })
// }
