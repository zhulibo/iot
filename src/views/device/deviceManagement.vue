<script setup>

// 引入element-plus图标
import {
  Delete,
} from '@element-plus/icons-vue'
import { ref } from "vue";
import {
  createTopic,
  delDevice,
  switchSub,
} from "@/api/device/device";
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { useUserStore } from "@/stores/user";
import Uploader from "@/components/uploader/Uploader.vue";
import {
  loading,
  deviceList,
  total,
  tableRef,
  schForm,
  getDeviceListHandle,
  schFormRef,
  resetForm,
  getListHandle,
} from "./hooks/useList";

import {
  dialogUpgradeVisible,
  upgradeDeviceFormRef,
  deviceUpgradeForm,
  deviceUpgradeRules,
  upgradeHandle,
  submitUpgradeDeviceForm,
  deviceTypeList,
  dialogMultiUpgradeVisible,
  multiUpgradeDeviceFormRef,
  deviceMultiUpgradeForm,
  deviceMultiUpgradeRules,
  multiUpgradeHandle,
  submitMultiUpgradeDeviceForm,
} from "./hooks/useUpgrade";

import {
  dialogEditVisible,
  deviceFormRef,
  addDeviceHandle,
  dialogMapVisible,
  address,
  openMap,
  confirmMap,
  deviceForm,
  deviceRules,
  submitDeviceForm,
} from "./hooks/useEdit";

const userStore = useUserStore()

// 获取设备列表
getDeviceListHandle()

// 获得输入的城市
let inputCity = ref('')
const searchCitys = () => {
  const map = new BMap.Map("map");
  // 设置地图可缩放
  map.enableScrollWheelZoom(true)
  const point = new BMap.Point(116.331398, 39.897445);
  map.centerAndZoom(point, 12);
  // 创建地址解析器实例
  const myGeo = new BMap.Geocoder();
  // 将地址解析结果显示在地图上,并调整地图视野
  myGeo.getPoint(inputCity.value, function (point) {
    if (point) {
      map.centerAndZoom(point, 16);
      map.addOverlay(new BMap.Marker(point));
    } else {
      alert("您选择地址没有解析到结果!");
    }
    // 地址为空的话默认就是搜索北京市
  }, point);
  address.latitude = ""
  address.longitude = ""
  map.addEventListener("click", function (e) {
    console.log("我被点击了");
    map.clearOverlays()
    let pt = e.point
    let marker = new BMap.Marker(new BMap.Point(pt.lng, pt.lat))
    map.addOverlay(marker)
    let geoc = new BMap.Geocoder()
    geoc.getLocation(pt, function () {
      address.latitude = pt.lat
      address.longitude = pt.lng
    })
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

let multipleSelection = ref([])

// 多选
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 批量删除
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

// 激活
const createTopicHandle = (row) => {
  let data = {
    userName: userStore.getUserInfo.userName,
    deviceid: row.id,
  }
  createTopic(data)
    .then(res => {
      ElMessage.success(res.msg)
      getDeviceListHandle()
    })
}

// 切换订阅状态
const switchSubHandle = (row) => {
  let data = {
    deviceid: row.id,
    status: row.topicStatus === 'UNSUBSCRIBED' ? 'SUBSCRIBE' : 'UNSUBSCRIBE'
  }
  switchSub(data)
    .then(res => {
      ElMessage.success(res.msg)
      getDeviceListHandle()
    })
}
</script>

<template>
  <div class="wrapper">
    <div class="table-head">
      <!-- 搜索 -->
      <div class="sch">
        <el-form ref="schFormRef" :inline="true" :model="schForm">
          <el-form-item label="设备名称" prop="title">
            <el-input v-model="schForm.title" placeholder="请输入" style="width: 200px;" clearable @change="getListHandle" />
          </el-form-item>
          <el-form-item label="创建时间" prop="startTime">
            <el-date-picker v-model="schForm.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="起"
              style="width: 200px;" @change="getListHandle"></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker v-model="schForm.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="至"
              style="width: 200px;" @change="getListHandle"></el-date-picker>
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
        <el-button type="success" @click="multiUpgradeHandle">
          <icon name="add" />批量升级
        </el-button>
        <el-button type="primary" @click="addDeviceHandle">
          <icon name="add" />新增
        </el-button>
      </div>
    </div>
    <!-- table -->
    <el-table ref="tableRef" :data="deviceList" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="created" label="创建时间" align="center" width="180" sortable></el-table-column>
      <el-table-column prop="id" label="设备id" width="300" sortable></el-table-column>
      <el-table-column prop="title" label="名称" min-width="140" sortable></el-table-column>
      <el-table-column prop="registerCode" label="设备序列号" min-width="120" sortable></el-table-column>
      <el-table-column prop="deviceType" label="设备类型" min-width="140" sortable></el-table-column>
      <el-table-column prop="topicStatus" label="订阅状态" min-width="200" sortable>
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.status === 'ACTIVE'">已激活</el-tag>
          <el-tag type="info" v-else>未激活</el-tag>
          <el-tag type="success" v-if="scope.row.topicStatus === 'SUBSCRIBED'">已订阅</el-tag>
          <el-tag type="info" v-else>未订阅</el-tag>
          <el-tag type="success" v-if="scope.row.onOffLineStatus === 'ONLINE'">在线</el-tag>
          <el-tag type="info" v-else>离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right" width="200" fixed="right" class-name="manage-td">
        <template #default="scope">
          <el-button type="success" link v-if="scope.row.status === 'ACTIVE'" @click="upgradeHandle(scope.row)">
            <icon name="add" />升级
          </el-button>
          <el-button type="primary" link v-if="scope.row.status === 'UNACTIVE'" @click="createTopicHandle(scope.row)">
            <icon name="edit" />激活
          </el-button>
          <el-button type="primary" link v-if="scope.row.status === 'ACTIVE' && scope.row.topicStatus === 'UNSUBSCRIBED'"
            @click="switchSubHandle(scope.row)">
            <icon name="edit" />订阅
          </el-button>
          <el-button type="primary" link v-if="scope.row.status === 'ACTIVE' && scope.row.topicStatus === 'SUBSCRIBED'"
            @click="switchSubHandle(scope.row)">
            <icon name="edit" />退订
          </el-button>
          <el-button type="warning" link @click="delDeviceHandle(scope.row)">
            <icon name="del" />删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 多选 -->
    <div style="margin-top: 10px">
      <el-button type="danger" plain style="margin-left: 10px;" @click="multiDel"
        :disabled="multipleSelection.length === 0">
        <icon name="del" />删除
      </el-button>
    </div>
    <!-- 分页 -->
    <Page v-model:currentPage="schForm.page" :total="total" @getList="getDeviceListHandle"></Page>
    <!-- 编辑设备 -->
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
              <p v-if="deviceForm.latitude" style="margin-right: 10px;">经纬度 {{ deviceForm.longitude }},
                {{ deviceForm.latitude }}</p>
              <el-button plain type="primary" @click="openMap">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="deviceForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入" />
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


    <!-- 选择坐标 -->
    <el-dialog v-model="dialogMapVisible" title="选择坐标" fullscreen>
      <!-- 添加新代码的地方 -->
      <el-input v-model="inputCity" placeholder="请输入您要寻找的城市" class="searchCity" />
      <el-button type="danger" :icon="Delete" circle size="small" @click="inputCity = ''" />
      <el-button type="primary" size="large" @click="searchCitys">搜索</el-button>

      <div class="map-ct">
        <div id="map"></div>
        <div class="address-ct">
          <div class="address">坐标：{{ address.longitude }} {{ address.latitude }}</div>
          <div class="btn">
            <el-button @click="dialogMapVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmMap">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 升级设备 -->
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
    <!-- 批量升级设备 -->
    <el-dialog v-model="dialogMultiUpgradeVisible" title="批量升级设备" width="800px">
      <el-form ref="multiUpgradeDeviceFormRef" :model="deviceMultiUpgradeForm" :rules="deviceMultiUpgradeRules"
        label-width="auto">
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

.el-dialog__body{
  padding:0px;
  padding:0px
}
.searchCity{
  width:300px
}
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
.el-tag + .el-tag{
  margin-left: 10px;
}
.el-button--danger{
  margin-left:10px
}
</style>
