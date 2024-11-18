import request from '@/utils/request'
export function projectList_API(params: any) {
    return request({
        url: "/farm/project-info/page",
        method: 'get',
        params
    })
}
export function addProject_API(data: any) {
    return request({
        url: "/farm/project-info/add",
        method: 'post',
        data
    })
}
export function updateProject_API(data: any) {
    return request({
        url: "/farm/project-info/update",
        method: 'put',
        data
    })
}
export function deleteProject_API(id: any) {
    return request({
        url: `/farm/project-info/delete?id=${id}`,
        method: 'delete',
        
    })
}
export function deviceList_API(params: any) {
    return request({
        url: "/farm/project-info/car/page",
        method: 'get',
        params
    })
}
export function addDevice_API(data: any) {
    return request({
        url: "/farm/project-info/car/add",
        method: 'post',
        data
    })
}
export function updateDevice_API(data: any) {
    return request({
        url: "/farm/project-info/car/update",
        method: 'put',
        data
    })
}
export function deleteDevice_API(id: any) {
    return request({
        url: `/farm/project-info/car/delete?id=${id}`,
        method: 'delete',
        
    })
}
export function landList_API(params: any) {
    return request({
        url: "/farm/project-info/area/page",
        method: 'get',
        params
    })
}
export function deleteLand_API(params: any) {
    return request({
        url: `/farm/project-info/area/delete`,
        method: 'delete',
        params
    })
}