import {reactive, ref} from "vue";
import {ElLoading, ElMessage} from "element-plus";
import Socket from "@/utils/socket";
import {getDeviceTypeList} from "@/api/device/device";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

export let dialogUpgradeVisible = ref(false)
export let upgradeDeviceFormRef = ref()
export const deviceUpgradeForm = reactive({
  fileUrl: '',
})
export const deviceUpgradeRules = reactive({
  fileUrl: [{ required: true, message: '请上传', trigger: 'blur' }],
})

// 升级
export const upgradeHandle = (row) => {
  deviceUpgradeForm.fileUrl = ''
  deviceUpgradeForm.deviceSingleUpgradeId = row.id
  dialogUpgradeVisible.value = true
}

// 提交升级
export const submitUpgradeDeviceForm = () => {
  upgradeDeviceFormRef.value.validate(valid => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '升级中，请勿关闭页面！',
        background: 'rgba(255, 255, 255, 0.8)',
      })
      let socket = new Socket({
        url: `/apiws/deviceSingleUpgrade?authorization=${userStore.getUserInfo.token}`,
        onmessage: (res) => {
          if(res.code === '0') {
            let data = deviceUpgradeForm
            data.userDeviceSingleUpgradeClose = 'ok'
            socket.send(data)
            socket.destroy()
            dialogUpgradeVisible.value = false
            loading.close()
            ElMessage.success('升级成功')
          }
        }
      })
      deviceUpgradeForm.userName = userStore.getUserInfo.userName
      socket.send(deviceUpgradeForm)
    }
  })
}

export let deviceTypeList = ref([])
getDeviceTypeList()
  .then(res => {
    deviceTypeList.value = res.data
  })
export let dialogMultiUpgradeVisible = ref(false)
export let multiUpgradeDeviceFormRef = ref()
export const deviceMultiUpgradeForm = reactive({
  deviceMultiUpgradeType: '',
  fileUrl: '',
})
export const deviceMultiUpgradeRules = reactive({
  deviceMultiUpgradeType: [{ required: true, message: '请选择', trigger: 'blur' }],
  fileUrl: [{ required: true, message: '请上传', trigger: 'blur' }],
})

// 批量升级
export const multiUpgradeHandle = () => {
  deviceMultiUpgradeForm.deviceMultiUpgradeType = ''
  deviceMultiUpgradeForm.fileUrl = ''
  dialogMultiUpgradeVisible.value = true
}

// 提交批量升级
export const submitMultiUpgradeDeviceForm = () => {
  multiUpgradeDeviceFormRef.value.validate(valid => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '升级中，请勿关闭页面！',
        background: 'rgba(255, 255, 255, 0.8)',
      })
      let socket = new Socket({
        url: `/apiws/deviceMultiUpgrade?authorization=${userStore.getUserInfo.token}`,
        onmessage: (res) => {
          if(res.code === '0') {
            let data = deviceMultiUpgradeForm
            data.userDeviceMultiUpgradeClose = 'ok'
            socket.send(data)
            socket.destroy()
            dialogMultiUpgradeVisible.value = false
            loading.close()
            ElMessage.success('升级成功')
          }
        }
      })
      deviceMultiUpgradeForm.userName = userStore.getUserInfo.userName
      socket.send(deviceMultiUpgradeForm)
    }
  })
}
