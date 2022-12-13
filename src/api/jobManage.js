import request from "@/utils/request";

export function groupList_path(params) {
  return request({
    url: "/farm/paddyWork/group/list",
    method: "post",
    params,
  });
}

export function historyList_path(params) {
  return request({
    url: "/farmPoint/paddyWork/history/list",
    method: "get",
    params,
  });
}
export function provinceList_path(params) {
  return request({
    url: "/farm/paddyWork/province/list",
    method: "post",
    params,
  });
}
export function paddyWorkUpdate_path(data) {
  return request({
    url: "/farm/paddyWork/update",
    method: "post",
    data,
  });
}
