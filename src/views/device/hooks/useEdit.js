import {nextTick, reactive, ref} from "vue";
import {addDevice, editDevice} from "@/api/device/device";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores/user";
import {getDeviceListHandle} from "@/views/device/hooks/useList";

const userStore = useUserStore()

export const dialogEditVisible = ref(false)
export const deviceFormRef = ref()

// 新增设备
export const addDeviceHandle = async() => {
  dialogEditVisible.value = true
  await nextTick()
  resetDeviceForm()
}
export const dialogMapVisible = ref(false)
export let address = reactive({
  latitude: '',
  longitude: '',
})

let map
let myGeo
// 打开地图
export const openMap = async() => {
  address.latitude = ''
  address.longitude = ''
  dialogMapVisible.value = true
  await nextTick()
  map = new BMap.Map("map")
  myGeo = new BMap.Geocoder()
  map.centerAndZoom(new BMap.Point(110,35), 6)
  map.enableScrollWheelZoom(true)
  map.addEventListener('click', function(e){
    map.clearOverlays()
    let pt = e.point
    // eslint-disable-next-line no-undef
    let marker = new BMap.Marker(new BMap.Point(pt.lng, pt.lat))
    map.addOverlay(marker)
    myGeo.getLocation(pt, function(){
      address.latitude = pt.lat
      address.longitude = pt.lng
    })
  })
}

// 获得输入的城市
export let inputCity = ref('')
export const searchCitys = () => {
  // 将地址解析结果显示在地图上,并调整地图视野
  console.log(inputCity.value)
  myGeo.getPoint(inputCity.value, function (point) {
    if(point) {
      address.latitude = point.lat
      address.longitude = point.lng
      map.centerAndZoom(point, 12)
      map.addOverlay(new BMap.Marker(point))
    } else {
      ElMessage.warning("您选择地址没有解析到结果!")
    }
  }, map)
}

// 保存地图坐标
export const confirmMap = () => {
  deviceForm.latitude = address.latitude
  deviceForm.longitude = address.longitude
  dialogMapVisible.value = false
}

// 编辑设备
// export const editDeviceHandle = async(row) => {
//   dialogEditVisible.value = true
//   await nextTick()
//   resetDeviceForm()
//   for (const key in deviceForm) {
//     deviceForm[key] = row[key]
//   }
//   deviceForm.deviceId = row.deviceId
// }

// 重置设备表单
const resetDeviceForm = () => {
  deviceFormRef.value.resetFields()
  delete deviceForm.deviceId
}

export const deviceForm = reactive({
  title: '',
  deviceType: '',
  latitude: '',
  longitude: '',
  description: '',
  owner: userStore.getUserInfo.userName,
})

export const deviceRules = reactive({
  title: [{ required: true, message: '请输入', trigger: 'blur' }],
  deviceType: [{ required: true, message: '请输入', trigger: 'blur' }],
  latitude: [{ required: true, message: '请选择', trigger: 'blur' }],
  longitude: [{ required: true, message: '请选择', trigger: 'blur' }],
})

// 提交设备表单
export const submitDeviceForm = () => {
  getDeviceListHandle()
  deviceFormRef.value.validate(valid => {
    if(valid) {
      if(deviceForm.deviceId) {
        editDevice(deviceForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getDeviceListHandle()
          })
      }else{
        addDevice(deviceForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getDeviceListHandle()
          })
      }
    }
  })
}
