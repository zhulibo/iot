import axios from "@/axios";

// 获取设备数据
export function getDeviceMeasurement(params) {
  return axios({
    url: '/api/device/measurements/',
    method: 'get',
    params
  })
}


// 获取设备列表
export function getDeviceList(params) {
  // return new Promise(resolve => {
  //   resolve({
  //     code: 0,
  //     data: [
  //       {
  //         createTime: '2021-12-29 16:50:55',
  //         deviceId: '111111111111',
  //         status: '1',
  //         isSub: 0,
  //       },
  //       {
  //         createTime: '2021-12-29 16:50:55',
  //         deviceId: '22222222',
  //         status: '2',
  //         isSub: 1,
  //       },
  //       {
  //         createTime: '2021-12-29 16:50:55',
  //         deviceId: '3333',
  //         status: '3',
  //         isSub: 1,
  //       }
  //     ],
  //     total: 2
  //   })
  // })
  return axios({
    url: '/api/device/devicelistinfo',
    method: 'get',
    params
  })
}

// 新增设备
export function addDevice(data) {
  return axios({
    url: '/api/user/add',
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

// 删除设备
export function delDevice(data) {
  return axios({
    url: '/api/user/del',
    method: 'delete',
    data
  })
}