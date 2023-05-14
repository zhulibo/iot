import axios from "@/axios";

// 获取设备报表
export function getDataReport(params) {
  return axios({
    url: '/api/device/deviceinfo/devicedatareport',
    method: 'get',
    params
  })
}
