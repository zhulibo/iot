import axios from 'axios'
import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

let userStore

axios.defaults.timeout = 1000 * 60
// http request 拦截器
axios.interceptors.request.use(
  config => {

    if(!userStore) userStore = useUserStore()

    const token = userStore.getUserInfo?.token ?? ''
    if (token) {
      if(!config.params) config.params = {}
      config.params.token = token
      // config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  res => {
    switch (res.data.code) {
      case 0:
        return res.data
      default:
        console.log(res)
        ElMessage.error(res.data.msg + res.data.code)
        return Promise.reject(res) // 抛出reject对象进入catch函数，避免异常数据进入then函数引起页面报错
    }
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 401:
          userStore.resetUserInfo()
          router.push({path: '/login'})
          err.message = '请重新登录(401)'
          break;
        case 403:
          userStore.resetUserInfo()
          router.push({path: '/login'})
          err.message = '请重新登录(403)'
          break;
        case 500:
          err.message = '服务器错误(500)'
          break;
        default:
          err.message = `连接出错(${err.response.status})！`
      }
    } else {
      err.message = '连接服务器失败！'
    }

    console.log(err)
    ElMessage.error(err.message)
    return Promise.reject(err)
  }
)

export default axios
