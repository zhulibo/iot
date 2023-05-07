<script setup>
import {nextTick, reactive, ref} from "vue";
import {
  addDevice,
  createTopic,
  delDevice,
  editDevice,
  getDeviceList,
  switchSub,
  getDeviceTypeList,
} from "@/api/device/device";
import {ElLoading, ElMessage, ElMessageBox, ElTable} from "element-plus";
// import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user";
import Uploader from "@/components/uploader/Uploader.vue";
import Socket from "@/utils/socket";

// const router = useRouter()
const userStore = useUserStore()

const schForm = reactive({
  userName: userStore.getUserInfo.userName,
  title: '',
  startTime: '',
  endTime: '',
  status: '',
  isSub: '',
  page: 1,
  size: 10,
})

const loading = ref(false)
const deviceList = ref([])
const total = ref(0)
const tableRef = ref()

// 获取设备列表
const getDeviceListHandle = () => {
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
getDeviceListHandle()

const schFormRef = ref()

// 重置搜索条件
const resetForm = () => {
  schFormRef.value.resetFields()
  getListHandle()
}

// 刷新设备
const getListHandle = () => {
  tableRef.value.clearSort() // 重置排序
  schForm.page = 1
  getDeviceListHandle()
}

let multipleSelection = ref([])
// 多选
const handleSelectionChange = (val) => {
  console.log(val)
  multipleSelection.value = val
}
// 多选删除
const multiDel = () => {
  let data = multipleSelection.value.map(item => {
    return item.deviceId
  })
  data = data.join()
  ElMessageBox.confirm('确定删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delDevice({
        deviceId: data
      })
        .then(res => {
          ElMessage.success(res.msg)
          getDeviceListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

// 删除设备
const delDeviceHandle = (row) => {
  ElMessageBox.confirm('确定删除 ' + row.title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delDevice(row.id)
        .then(res => {
          ElMessage.success(res.msg)
          getDeviceListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

const dialogEditVisible = ref(false)
const deviceFormRef = ref()

// 切换订阅状态
// const switchStatus = (row) => {
//   loading.value = true
//   const data = {
//     deviceId: row.deviceId,
//     isSub: row.isSub,
//   }
//   editDevice(data).then(res => {
//     ElMessage.success(res.msg)
//     getDeviceListHandle()
//   }).catch(() => {
//     getDeviceListHandle()
//   })
// }

// 新增设备
const addDeviceHandle = async() => {
  dialogEditVisible.value = true
  await nextTick()
  resetDeviceForm()
}
const dialogMapVisible = ref(false)
let address = reactive({
  latitude: '',
  longitude: '',
})
// 打开地图
const openMap = async() => {
  dialogMapVisible.value = true
  await nextTick()
  //实例化地图
  // eslint-disable-next-line no-undef
  let map = new BMap.Map('map')
  // eslint-disable-next-line no-undef
  map.centerAndZoom(new BMap.Point(110,35), 6)
  map.enableScrollWheelZoom(true)
  // eslint-disable-next-line no-undef
  let geoc = new BMap.Geocoder()
  map.addEventListener('click', function(e){
    map.clearOverlays()
    let pt = e.point
    // eslint-disable-next-line no-undef
    let marker = new BMap.Marker(new BMap.Point(pt.lng, pt.lat))
    map.addOverlay(marker)
    geoc.getLocation(pt, function(){
      address.latitude = pt.lat
      address.longitude = pt.lng
    })
  })
}
const confirmMap = () => {
  deviceForm.latitude = address.latitude
  deviceForm.longitude = address.longitude
  dialogMapVisible.value = false
}
// 编辑设备
// const editDeviceHandle = async(row) => {
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

const deviceForm = reactive({
  title: '',
  registerCode: '',
  deviceType: '',
  latitude: '',
  longitude: '',
  description: '',
  owner: userStore.getUserInfo.userName,
})

const deviceRules = reactive({
  title: [{ required: true, message: '请输入', trigger: 'blur' }],
  registerCode: [{ required: true, message: '请输入', trigger: 'blur' }],
  deviceType: [{ required: true, message: '请输入', trigger: 'blur' }],
  latitude: [{ required: true, message: '请选择', trigger: 'blur' }],
  longitude: [{ required: true, message: '请选择', trigger: 'blur' }],
})

// 提交设备表单
const submitDeviceForm = () => {
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

// 激活
const createTopicHandle = (row) => {
  let data = {
    userName: userStore.getUserInfo.userName,
    deviceid: row.id,
  }
  createTopic(data)
    .then(res => {
      ElMessage.success(res.msg)
      dialogEditVisible.value = false
      getDeviceListHandle()
    })
}

// 切换订阅
const switchSubHandle = (row) => {
  let data = {
    deviceid: row.id,
    status: row.topicStatus === 'UNSUBSCRIBED' ? 'SUBSCRIBE' : 'UNSUBSCRIBE'
  }
  switchSub(data)
    .then(res => {
      ElMessage.success(res.msg)
      dialogEditVisible.value = false
      getDeviceListHandle()
    })
}

// 升级
let dialogUpgradeVisible = ref(false)
let upgradeDeviceFormRef = ref()
const deviceUpgradeForm = reactive({
  fileUrl: '',
})

const deviceUpgradeRules = reactive({
  fileUrl: [{ required: true, message: '请上传', trigger: 'blur' }],
})
const upgradeHandle = (row) => {
  deviceUpgradeForm.fileUrl = ''
  deviceUpgradeForm.deviceSingleUpgradeId = row.id
  dialogUpgradeVisible.value = true
}
const submitUpgradeDeviceForm = () => {
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
// 批量升级
let deviceTypeList = ref([])
getDeviceTypeList()
  .then(res => {
    deviceTypeList.value = res.data
  })
let dialogMultiUpgradeVisible = ref(false)
let multiUpgradeDeviceFormRef = ref()
const deviceMultiUpgradeForm = reactive({
  deviceMultiUpgradeType: '',
  fileUrl: '',
})

const deviceMultiUpgradeRules = reactive({
  deviceMultiUpgradeType: [{ required: true, message: '请选择', trigger: 'blur' }],
  fileUrl: [{ required: true, message: '请上传', trigger: 'blur' }],
})
const multiUpgradeHandle = () => {
  deviceMultiUpgradeForm.deviceMultiUpgradeType = ''
  deviceMultiUpgradeForm.fileUrl = ''
  dialogMultiUpgradeVisible.value = true
}
const submitMultiUpgradeDeviceForm = () => {
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

// const handleSuccess = () => {
//
// }
// const toLog = (row) => {
//   router.push({ path: '/login', query: {deviceId: row.deviceId}})
// }
</script>

<template>
  <div class="wrapper">
    <div class="table-head">
      <div class="sch">
        <el-form ref="schFormRef" :inline="true" :model="schForm">
          <el-form-item label="设备名称" prop="title">
            <el-input v-model="schForm.title" placeholder="请输入" style="width: 200px;" clearable @change="getListHandle" />
          </el-form-item>
          <el-form-item label="创建时间" prop="startTime">
            <el-date-picker v-model="schForm.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="起" style="width: 200px;" @change="getListHandle"></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker v-model="schForm.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="至" style="width: 200px;" @change="getListHandle"></el-date-picker>
          </el-form-item>
          <el-form-item label="设备状态" prop="status">
            <el-radio-group v-model="schForm.status" @change="getListHandle">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="0">未激活</el-radio-button>
              <el-radio-button :label="1">离线</el-radio-button>
              <el-radio-button :label="2">在线</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订阅状态" prop="isSub">
            <el-radio-group v-model="schForm.isSub" @change="getListHandle">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="0">已订阅</el-radio-button>
              <el-radio-button :label="1">未订阅</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="getListHandle">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="new-item">
        <el-button type="success" @click="multiUpgradeHandle"><icon name="add" />批量升级</el-button>
        <el-button type="primary" @click="addDeviceHandle"><icon name="add" />新增</el-button>
      </div>
    </div>
    <el-table ref="tableRef" :data="deviceList" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="created" label="创建时间" align="center" width="250" sortable></el-table-column>
      <el-table-column prop="id" label="设备id" min-width="260" sortable></el-table-column>
      <el-table-column prop="title" label="名称" min-width="140" sortable></el-table-column>
      <el-table-column prop="registerCode" label="设备序列号" min-width="140" sortable></el-table-column>
      <el-table-column prop="deviceType" label="设备类型" min-width="140" sortable></el-table-column>
<!--      <el-table-column prop="status" label="设备状态" min-width="140" sortable>-->
<!--        <template #default="scope">-->
<!--          <el-button v-if="scope.row.status === '1'" type="info" link>未激活</el-button>-->
<!--          <el-button v-else-if="scope.row.status === '2'" type="warning" link>离线</el-button>-->
<!--          <el-button v-else-if="scope.row.status === '3'" type="success" link>在线</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="topicStatus" label="订阅状态" min-width="120" sortable>
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.topicStatus === 'SUBSCRIBED'">订阅</el-tag>
          <el-tag type="info" v-else-if="scope.row.topicStatus === 'UNSUBSCRIBED'">未订阅</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column prop="isSub" label="订阅状态" min-width="140" sortable>-->
<!--        <template #default="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.isSub"-->
<!--            :active-value="1"-->
<!--            :inactive-value="0"-->
<!--            @change="switchStatus(scope.row)"-->
<!--          >-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="right" width="260" fixed="right" class-name="manage-td">
        <template #default="scope">
          <el-button type="success" link v-if="scope.row.status === 'ACTIVE'" @click="upgradeHandle(scope.row)"><icon name="add" />升级</el-button>
          <el-button type="primary" link v-if="scope.row.status === 'UNACTIVE'" @click="createTopicHandle(scope.row)"><icon name="edit" />激活</el-button>
          <el-button type="primary" link v-if="scope.row.status === 'ACTIVE' && scope.row.topicStatus === 'UNSUBSCRIBED'" @click="switchSubHandle(scope.row)"><icon name="edit" />订阅</el-button>
          <el-button type="primary" link v-if="scope.row.status === 'ACTIVE' && scope.row.topicStatus === 'SUBSCRIBED'" @click="switchSubHandle(scope.row)"><icon name="edit" />退订</el-button>
<!--          <el-button type="primary" link @click="toLog(scope.row)"><icon name="deviceLog" />日志</el-button>-->
<!--          <el-button type="primary" link @click="editDeviceHandle(scope.row)" disabled><icon name="edit" />修改</el-button>-->
          <el-button type="warning" link @click="delDeviceHandle(scope.row)"><icon name="del" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <el-button type="danger" plain style="margin-left: 10px;" @click="multiDel" :disabled="multipleSelection.length === 0"><icon name="del" />删除</el-button>
    </div>
    <Page v-model:currentPage="schForm.page" :total="total" @getList="getDeviceListHandle"></Page>
    <el-dialog v-model="dialogEditVisible" title="编辑设备" width="600px">
      <el-form ref="deviceFormRef" :model="deviceForm" :rules="deviceRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称" prop="title">
              <el-input v-model="deviceForm.title" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备序列号" prop="registerCode">
              <el-input v-model="deviceForm.registerCode" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备类型" prop="deviceType">
              <el-input v-model="deviceForm.deviceType" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="坐标" prop="latitude">
              <p v-if="deviceForm.latitude" style="margin-right: 10px;">经纬度 {{deviceForm.longitude}}, {{deviceForm.latitude}}</p>
              <el-button plain type="primary" @click="openMap">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="deviceForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDeviceForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogMapVisible" title="选择坐标" fullscreen>
      <div class="map-ct">
        <div id="map"></div>
        <div class="address-ct">
          <div class="address">坐标：{{address.longitude}} {{address.latitude}}</div>
          <div class="btn">
            <el-button @click="dialogMapVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmMap">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogUpgradeVisible" title="升级设备" width="800px">
      <el-form ref="upgradeDeviceFormRef" :model="deviceUpgradeForm" :rules="deviceUpgradeRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="升级文件" prop="fileUrl">
              <Uploader v-model="deviceUpgradeForm.fileUrl"></Uploader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUpgradeVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpgradeDeviceForm">升级</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogMultiUpgradeVisible" title="批量升级设备" width="800px">
      <el-form ref="multiUpgradeDeviceFormRef" :model="deviceMultiUpgradeForm" :rules="deviceMultiUpgradeRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="设备类型" prop="deviceMultiUpgradeType">
              <el-select v-model="deviceMultiUpgradeForm.deviceMultiUpgradeType">
                <el-option v-for="item in deviceTypeList" :label="item" :key="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="升级文件" prop="fileUrl">
              <Uploader v-model="deviceMultiUpgradeForm.fileUrl"></Uploader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogMultiUpgradeVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMultiUpgradeDeviceForm">升级</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="pcss" scoped>
.map-ct{
  position: relative;
  width: 100%;
  height: calc(100vh - 115px);
  & #map{
    width: 100%;
    height: 100%;
  }
  & .address-ct{
    position: absolute;
    display: inline-block;
    top: 20px;
    right: 20px;
    & .address{
      margin-bottom: 10px;
      padding: 5px 10px;
      font-size: 16px;
      min-width: 200px;
      background-color: rgba(255, 255, 255, 0.8);
    }
    & .btn{
      text-align: right;
    }
  }
}
</style>
