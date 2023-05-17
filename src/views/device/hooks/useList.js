import {reactive, ref} from "vue";
import {getDeviceList} from "@/api/device/device";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

export const loading = ref(false)
export const deviceList = ref([])
export const total = ref(0)
export const tableRef = ref()

export const schForm = reactive({
  userName: userStore.getUserInfo.userName,
  title: '',
  startTime: '',
  endTime: '',
  status: '',
  isSub: '',
  page: 1,
  size: 10,
})

// 获取设备列表
export const getDeviceListHandle = () => {
  loading.value = true
  getDeviceList(schForm)
    .then(res => {
      total.value = res.count
      deviceList.value = res.results
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

export const schFormRef = ref()

// 重置搜索条件
export const resetForm = () => {
  schFormRef.value.resetFields()
  getListHandle()
}

// 刷新设备
export const getListHandle = () => {
  tableRef.value.clearSort() // 重置排序
  schForm.page = 1
  getDeviceListHandle()
}
