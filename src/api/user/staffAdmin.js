import axios from '@/axios'

// 获取公司管理员列表
export function getStaffList(params) {
  return axios({
    url: '/api/management/staff',
    method: 'get',
    params
  })
}

// 新增公司管理员
export function addStaff(data, params) {
  return axios({
    url: '/api/management/staff',
    method: 'post',
    data,
    params,
  })
}

// 编辑公司管理员
export function editStaff(id, token, data) {
  return axios({
    url: '/api/management/staff/' + id,
    method: 'patch',
    params: token,
    data
  })
}

// 删除公司管理员
export function delStaff(id, params) {
  return axios({
    url: '/api/management/staff/' + id,
    method: 'delete',
    params
  })
}