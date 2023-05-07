<script setup>
import {nextTick, reactive, ref} from "vue";
import {getStaffList, addStaff, editStaff, delStaff} from "@/api/user/staffAdmin";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useUserStore} from "@/stores/user";
import {setDataAes} from "@/utils/aes2";
import {deepCopy} from "js-fragment";
import {useRoute} from "vue-router";

const userStore = useUserStore()
const route = useRoute()

const schForm = reactive({
  title: route.meta.title,
  userName: '',
  fullName: '',
  startTime: '',
  endTime: '',
  status: undefined,
  page: 1,
  size: 10
})

const loading = ref(true)
const staffList = ref([])
const total = ref(0)
const tableRef = ref()

// 获取公司管理员列表
const getStaffListHandle = () => {
  loading.value = true
  getStaffList(schForm)
    .then(res => {
      total.value = res.count
      staffList.value = res.results
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
getStaffListHandle()

const schFormRef = ref()

// 重置搜索条件
const resetForm = () => {
  schFormRef.value.resetFields()
  getListHandle()
}

// 刷新公司管理员
const getListHandle = () => {
  tableRef.value.clearSort() // 重置排序
  schForm.page = 1
  getStaffListHandle()
}

// 切换公司管理员状态
const switchStatus = (row) => {
  loading.value = true
  const data = {
    userId: row.userId,
    status: row.status,
  }
  editStaff(data).then(res => {
    ElMessage.success(res.msg)
    getStaffListHandle()
  }).catch(() => {
    getStaffListHandle()
  })
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
    return item.userId
  })
  data = data.join()
  ElMessageBox.confirm('确定删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delStaff({
        userId: data
      })
        .then(res => {
          ElMessage.success(res.msg)
          getStaffListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

// 删除公司管理员
const delStaffHandle = (row) => {
  ElMessageBox.confirm('确定删除 ' + row.userName, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delStaff(row.id)
        .then(res => {
          ElMessage.success(res.msg)
          getStaffListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

const dialogEditVisible = ref(false)
const staffFormRef = ref()

// 新增公司管理员
const addStaffHandle = async() => {
  dialogEditVisible.value = true
  await nextTick()
  resetStaffForm()
}

// 编辑公司管理员
const editStaffHandle = async(row) => {
  dialogEditVisible.value = true
  await nextTick()
  resetStaffForm()
  for (const key in staffForm) {
    staffForm[key] = row[key]
  }
  staffForm.id = row.id
}

// 重置公司管理员表单
const resetStaffForm = () => {
  staffFormRef.value.resetFields()
  delete staffForm.id
}

const staffForm = reactive({
  userName: '',
  passWord: '',
  fullName: '',
  phone: '',
  email: '',
  status: 1
})

const staffRules = reactive({
  userName: [{ required: true, message: '请输入', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入', trigger: 'blur' }],
  // status: [{ required: true, message: '请输入', trigger: 'blur' }],
})

// 提交公司管理员表单
const submitStaffForm = () => {
  staffFormRef.value.validate(valid => {
    if(valid) {
      staffForm.isCompany = false
      staffForm.isStaff = true
      if(staffForm.id) {
        delete staffForm.passWord
        delete staffForm.userName
        editStaff(staffForm.id, staffForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getStaffListHandle()
          })
      }else{
        let form = deepCopy(staffForm)
        form.passWord = setDataAes(form.passWord)
        addStaff(form)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getStaffListHandle()
          })
      }
    }
  })
}
</script>

<template>
  <div class="wrapper">
    <div class="table-head">
      <div class="sch">
        <el-form ref="schFormRef" :inline="true" :model="schForm">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="schForm.userName" placeholder="请输入" style="width: 200px;" clearable @change="getListHandle" />
          </el-form-item>
          <el-form-item label="姓名" prop="fullName">
            <el-input v-model="schForm.fullName" placeholder="请输入" style="width: 200px;" clearable @change="getListHandle" />
          </el-form-item>
          <el-form-item label="创建时间" prop="startTime">
            <el-date-picker v-model="schForm.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="起" style="width: 200px;" @change="getListHandle"></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker v-model="schForm.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="至" style="width: 200px;" @change="getListHandle"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="schForm.status" @change="getListHandle">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="0">禁用</el-radio-button>
              <el-radio-button :label="1">正常</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="getListHandle">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="new-item">
        <el-button type="primary" @click="addStaffHandle"><icon name="add" />新增</el-button>
      </div>
    </div>
    <el-table ref="tableRef" :data="staffList" v-loading="loading" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="index" width="50"></el-table-column>-->
      <el-table-column type="selection" width="40" />
      <el-table-column prop="createTime" label="创建时间" align="center" width="200" sortable></el-table-column>
      <el-table-column prop="userName" label="用户名" min-width="140" sortable></el-table-column>
      <el-table-column prop="fullName" label="姓名" min-width="100" sortable></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" min-width="140" sortable></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="260" sortable></el-table-column>
      <!--      <el-table-column prop="status" label="状态" align="center" min-width="120" sortable>-->
      <!--        <template #default="scope">-->
      <!--          <el-switch-->
      <!--            v-model="scope.row.status"-->
      <!--            :active-value="1"-->
      <!--            :inactive-value="0"-->
      <!--            @change="switchStatus(scope.row)"-->
      <!--          >-->
      <!--          </el-switch>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="manage-td">
        <template #default="scope">
          <el-button type="primary" link @click="editStaffHandle(scope.row)"><icon name="edit" />修改</el-button>
          <el-button type="warning" link @click="delStaffHandle(scope.row)"><icon name="del" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <el-button type="danger" plain style="margin-left: 10px;" @click="multiDel" :disabled="multipleSelection.length === 0"><icon name="del" />删除</el-button>
    </div>
    <Page v-model:currentPage="schForm.page" :total="total" @getList="getStaffListHandle"></Page>
    <el-dialog v-model="dialogEditVisible" title="编辑公司管理员" width="800px">
      <el-form ref="staffFormRef" :model="staffForm" :rules="staffRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="userName" :disabled="staffForm.id">
              <el-input v-model="staffForm.userName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!staffForm.id">
            <el-form-item label="密码" prop="passWord" :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
              <el-input v-model="staffForm.passWord" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="fullName">
              <el-input v-model="staffForm.fullName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="staffForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="staffForm.email" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch v-model="staffForm.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="submitStaffForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="pcss" scoped>
</style>
