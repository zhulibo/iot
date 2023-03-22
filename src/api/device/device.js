import axios from "@/axios";

// 获取设备数据
export function getDeviceMeasurement(params) {
  return axios({
    url: '/api/device/measurements/',
    method: 'get',
    params
  })
}