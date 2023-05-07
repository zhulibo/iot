import axios from "@/axios";

// 获取设备列表
export function getDeviceList(params) {
  return axios({
    url: '/api/device/deviceinfo',
    method: 'get',
    params
  })
}

// 新增设备
export function addDevice(data) {
  return axios({
    url: '/api/device/deviceinfo',
    method: 'post',
    data
  })
}

// 编辑设备
export function editDevice(data) {
  return axios({
    url: '/api/user/update',
    method: 'put',
    data
  })
}

// 创建主题
export function createTopic(data) {
  return axios({
    url: '/api/deviceHandle/iotsubdev',
    method: 'post',
    data
  })
}

// 切换订阅设备
export function switchSub(data) {
  return axios({
    url: '/api/deviceHandle/iotsubdev/subscribe',
    method: 'post',
    data
  })
}

// 删除设备
export function delDevice(id) {
  return axios({
    url: '/api/device/deviceinfo/' + id,
    method: 'delete',
  })
}

// 升级设备
export function upgradeDevice(params, data) {
  return axios({
    url: '/api/device/upgradeDevice',
    method: 'post',
    params,
    data,
  })
}

// 批量升级设备
export function multiUpgradeDevice(params, data) {
  return axios({
    url: '/api/device/multiUpgradeDevice',
    method: 'post',
    params,
    data,
  })
}

// 获取升级类型
export function getDeviceTypeList() {
  return axios({
    url: '/api/device/devicetypeinfo',
    method: 'get',
  })
}
