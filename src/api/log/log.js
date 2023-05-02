import axios from "@/axios";

// 获取设备日志
export function getDeviceLog(params) {
  return axios({
    url: '/api/device/devicelogdata',
    method: 'get',
    params
  })
}
