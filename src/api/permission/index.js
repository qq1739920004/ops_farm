import request from "@/utils/request";

//公用的相关请求接口-
export function getUserCompanyManager_path(params) {
  return request({
    url: "/usercenter/user/getUserCompanyManager",
    method: "get",
    params,
  });
}

export function userAuthApply_path(data) {
  return request({
    url: "/usercenter/userAuthApply/add",
    method: "post",
    data,
  });
}
export function menusPermissionByUser(params) {
  return request({
    url: "/usercenter/menus/permissionByUser",
    method: "post",
    params,
  });
}
