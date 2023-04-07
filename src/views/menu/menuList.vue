<script setup>
import {nextTick, reactive, ref, watch} from "vue"
import { getMenuList, addMenu, editMenu, delMenu } from '@/api/menu/menu'
import {ElMessage, ElMessageBox, ElTable} from 'element-plus'

const loading = ref(true)
const menuList = ref([])

// 获取菜单列表
const getMenuListHandle = () => {
  loading.value = true
  getMenuList()
    .then(res => {
      menuList.value = res.data
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

getMenuListHandle()

const tableRef = ref()

// 刷新
const getListHandle = () => {
  getMenuListHandle()
}

// 切换状态
const switchStatus = (row) => {
  loading.value = true
  const data = {
    id: row.id,
    status: row.status,
  }
  editMenu(data).then(res => {
    ElMessage.success('操作成功')
    getMenuListHandle()
  }).catch(() => {
    getMenuListHandle()
  })
}

// 删除菜单
const delMenuHandle = (row) => {
  ElMessageBox.confirm('确定删除 ' + row.title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delMenu(row.id)
        .then(res => {
          ElMessage.success(res.msg)
          getMenuListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

const dialogEditVisible = ref(false)
const menuFormRef = ref()

// 新增菜单
const addMenuHandle = async() => {
  dialogEditVisible.value = true
  await nextTick()
  resetMenuForm()
}

// 编辑菜单
const editMenuHandle = async(row) => {
  dialogEditVisible.value = true
  resetMenuForm()
  await nextTick()
  for (const key in menuForm) {
    menuForm[key] = row[key]
  }
  menuForm.id = row.id

  // 合成el-cascader所绑定的id数组
  const parentId = Number(row.parentId)
  const temArr = []
  let hasFind = false
  function findItem(list) {
    for (let i = 0; i < list.length; i++) {
      if(hasFind) {
        break
      }
      if(list[i].id === parentId){
        temArr.push(list[i].id)
        hasFind = true
      }else{
        if (list[i].children && list[i].children.length > 0) {
          // 添加list[i].id，开始查找children项
          temArr.push(list[i].id)
          findItem(list[i].children)
        }else{
          // children里不存在要找的目标，删除list[i].id
          if(i === list.length - 1){
            temArr.pop()
          }
        }
      }
    }
  }
  findItem(menuList.value)
  parent.value = temArr
}

// 重置编辑菜单表单
const resetMenuForm = () => {
  menuFormRef.value.resetFields()
  parent.value = []
  delete menuForm.id
}

const parent = ref([])
const menuForm = reactive({
  parentId: '',
  title: '',
  name: '',
  path: '',
  component: '',
  orderNum: 0,
  hidden: 0,
  cache: 0,
  status: 1,
})

const menuRules = reactive({
  title: [{ required: true, message: '请输入', trigger: 'blur' }],
  component: [{ required: true, message: '请输入', trigger: 'blur' }],
  name: [{ required: true, message: '请输入', trigger: 'blur' }],
  path: [{ required: true, message: '请输入', trigger: 'blur' }],
})

// 提交菜单表单
const submitMenuForm = () => {
  menuFormRef.value.validate(valid => {
    if(valid) {
      if(menuForm.id) {
        editMenu(menuForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getMenuListHandle()
          })
      }else{
        addMenu(menuForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getMenuListHandle()
          })
      }
    }
  })
}

watch(() => parent, parent => {
  // 选择时是数组
  if(Array.isArray(parent.value)) {
    if (parent.value.length > 0) {
      menuForm.parentId = String(parent.value[parent.value.length - 1])
    } else {
      menuForm.parentId = ''
    }
  }
  // 清空时是null
  else if(parent.value === null) {
    menuForm.parentId = ''
  }
}, {deep: true})

</script>

<template>
  <div class="wrapper">
    <div class="table-head">
      <div class="new-item">
        <el-button type="primary" plain @click="getListHandle"><icon name="refresh" />刷新</el-button>
        <el-button type="primary" @click="addMenuHandle"><icon name="add" />新增</el-button>
      </div>
    </div>
    <el-table ref="tableRef" :data="menuList" v-loading="loading" row-key="id" default-expand-all>
      <el-table-column prop="createTime" label="时间" align="center" width="200"></el-table-column>
      <el-table-column prop="title" label="菜单名称" min-width="160">
        <template #default="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="文件路径" min-width="180">
        <template #default="scope">{{scope.row.component}}</template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称" min-width="120">
        <template #default="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" min-width="120">
        <template #default="scope">{{scope.row.path}}</template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center" min-width="120">
        <template #default="scope">{{scope.row.orderNum}}</template>
      </el-table-column>
      <el-table-column prop="hidden" label="是否隐藏" align="center" min-width="120">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.hidden === 1">是</el-tag>
          <el-tag type="info" v-else-if="scope.row.hidden === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cache" label="是否缓存" align="center" min-width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.cache"
            :active-value="1"
            :inactive-value="0"
            @change="switchStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
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
      <el-table-column label="操作" align="center" width="150" fixed="right" class-name="manage-td">
        <template #default="scope">
          <el-button type="primary" link @click="editMenuHandle(scope.row)"><icon name="edit" />修改</el-button>
          <el-button type="warning" link @click="delMenuHandle(scope.row)"><icon name="del" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogEditVisible" title="编辑菜单" width="800px">
      <el-form ref="menuFormRef" :model="menuForm" :rules="menuRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上级菜单" prop="parent">
              <el-cascader
                v-model="parent"
                :options="menuList"
                :props="{ value: 'id', label: 'title', children: 'children', checkStrictly: true, expandTrigger: 'hover' }"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="menuForm.title" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由名称" prop="name">
              <el-input v-model="menuForm.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menuForm.path" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件路径" prop="component">
              <el-input v-model="menuForm.component" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="orderNum">
              <el-input v-model="menuForm.orderNum" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否隐藏" prop="hidden">
              <el-switch v-model="menuForm.hidden" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否缓存" prop="cache">
              <el-switch v-model="menuForm.cache" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch v-model="menuForm.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="submitMenuForm">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="pcss" scoped>
</style>
