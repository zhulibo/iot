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
export function addStaff(data) {
  return axios({
    url: '/api/management/staff',
    method: 'post',
    data
  })
}

// 编辑公司管理员
export function editStaff(id, data) {
  return axios({
    url: '/api/management/staff/' + id,
    method: 'patch',
    data
  })
}

// 删除公司管理员
export function delStaff(id) {
  return axios({
    url: '/api/management/staff/' + id,
    method: 'delete',
  })
}
