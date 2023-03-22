<script setup lang="ts">
import {nextTick, reactive, ref} from "vue";
import {getUserList, addUser, editUser, delUser} from "@/api/user/user";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";

const schForm = reactive({
  userName: '',
  startTime: '',
  endTime: '',
  status: undefined,
  page: 1,
  rows: 10
})

const loading = ref(true)
const userList = ref([])
const total = ref(0)
const tableRef = ref()

// 获取示例列表
const getUserListHandle = () => {
  loading.value = true
  getUserList(schForm)
    .then(res => {
      total.value = res.total
      userList.value = res.data
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
getUserListHandle()

const schFormRef = ref()

// 重置搜索条件
const resetForm = () => {
  schFormRef.value.resetFields()
  getListHandle()
}

// 刷新示例
const getListHandle = () => {
  tableRef.value.clearSort() // 重置排序
  schForm.page = 1
  getUserListHandle()
}

// 切换示例状态
const switchStatus = (row) => {
  loading.value = true
  const data = {
    userId: row.userId,
    status: row.status,
  }
  editUser(data).then(res => {
    ElMessage.success(res.msg)
    getUserListHandle()
  }).catch(() => {
    getUserListHandle()
  })
}

// 删除示例
const delUserHandle = (row) => {
  ElMessageBox.confirm('确定删除 ' + row.userName, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delUser(row.userId)
        .then(res => {
          ElMessage.success(res.msg)
          getUserListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

const dialogEditVisible = ref(false)
const userFormRef = ref()

// 新增示例
const addUserHandle = async() => {
  dialogEditVisible.value = true
  await nextTick()
  resetUserForm()
}

// 编辑示例
const editUserHandle = async(row) => {
  dialogEditVisible.value = true
  await nextTick()
  resetUserForm()
  for (const key in userForm) {
    userForm[key] = row[key]
  }
  userForm.userId = row.userId
}

// 重置示例表单
const resetUserForm = () => {
  userFormRef.value.resetFields()
  delete userForm.userId
}

const userForm = reactive({
  userName: '',
  phone: '',
  email: '',
  userDeviceLoginid: '',
  status: 1
})

const userRules = reactive({
  userName: [{ required: true, message: '请输入', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入', trigger: 'blur' }],
  email: [{ required: true, message: '请输入', trigger: 'blur' }],
  userDeviceLoginid: [{ required: true, message: '请输入', trigger: 'blur' }],
  status: [{ required: true, message: '请输入', trigger: 'blur' }],
})

// 提交示例表单
const submitUserForm = () => {
  userFormRef.value.validate(valid => {
    if(valid) {
      if(userForm.userId) {
        editUser(userForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getUserListHandle()
          })
      }else{
        addUser(userForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getUserListHandle()
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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="schForm.name" placeholder="请输入" style="width: 200px;" clearable @change="getListHandle" />
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
        <el-button type="primary" @click="addUserHandle"><icon name="add" />新增</el-button>
      </div>
    </div>
    <el-table ref="tableRef" :data="userList" v-loading="loading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="200" sortable></el-table-column>
      <el-table-column prop="userName" label="用户名" min-width="140" sortable></el-table-column>
      <el-table-column prop="name" label="姓名" min-width="140" sortable></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" min-width="140" sortable></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="220" sortable></el-table-column>
      <el-table-column prop="userDeviceLoginid" label="设备id" min-width="140" sortable></el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120" sortable>
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="switchStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="manage-td">
        <template #default="scope">
          <el-button type="primary" link @click="editUserHandle(scope.row)"><icon name="edit" />修改</el-button>
          <el-button type="warning" link @click="delUserHandle(scope.row)"><icon name="del" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page v-model:currentPage="schForm.page" :total="total" @getList="getUserListHandle"></Page>
    <el-dialog v-model="dialogEditVisible" title="编辑示例" width="800px">
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="userName">
              <el-input v-model="userForm.userName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备id" prop="userDeviceLoginid">
              <el-input v-model="userForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch v-model="userForm.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="pcss" scoped>
</style>
