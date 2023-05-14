import axios from "@/axios";

// 获取首页设备信息
export function getHomeDeviceInfo(params) {
  return axios({
    url: '/api/device/deviceinfo/homedeviceinfo',
    method: 'get',
    params
  })
}
