import request from '@/utils/request'

export function catStartList_API(data: any) {
  return request<any, any>({
    url: "/farm/carStat/list",
    method: 'post',
    data
  })
}

export function provinceChart_API(data: any) {
  return request<any, any>({
    url: "/farm/carStat/list/province",
    method: 'post',
    data
  })
}

export function CarStatPaddyChart_API(data: any) {
  return request<any, any>({
    url: "/farm/carStat/CarStatPaddy",
    method: 'post',
    data
  })
}
export function alarmRecordChart_API(data: any) {
  return request<any, any>({
    url: "/farm/alarmRecord/stat/list",
    method: 'post',
    data
  })
}
export function statPage_API(data: any) {
  return request<any, any>({
    url: "/farm/alarmRecord/stat/page",
    method: 'post',
    data
  })
}