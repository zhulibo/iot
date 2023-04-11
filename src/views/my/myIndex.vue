<script setup>
import {getUserDetail, resetPassword} from "@/api/user/user";
import {useUserStore} from "@/stores/user";
import {nextTick, reactive, ref} from "vue";
import {filterNone} from "@/utils/filter";
import {ElMessage} from "element-plus";
import {validPwd} from "@/utils/validate";
import {setDataAes} from "@/utils/aes2";
import {editStaff} from "@/api/user/staffAdmin";

const userStore = useUserStore()

let userDetail = reactive({})
const getUserDetailHandle = () => {
  let data = {
    token: userStore.getUserInfo.token
  }
  getUserDetail(userStore.getUserInfo.id, data)
    .then(res => {
      userDetail.email = res.data.usersInfo.email
      userDetail.fullName = res.data.usersInfo.fullName
      userDetail.id = res.data.usersInfo.id
      userDetail.phone = res.data.usersInfo.phone
      userDetail.userName = res.data.usersInfo.userName
    })
}
getUserDetailHandle()

const dialogInfoVisible = ref(false)
const userInfoFormRef = ref()

// 编辑用户资料
const editUserInfoHandle = async() => {
  dialogInfoVisible.value = true
  await nextTick()
  for (const key in userInfoForm) {
    userInfoForm[key] = userDetail[key]
  }
  userInfoForm.id = userDetail.id
}
const userInfoForm = reactive({
  fullName: '',
  email: '',
})

const userInfoRules = reactive({
  fullName: [{ required: true, message: '请输入', trigger: 'blur' }],
  email: [{ required: true, message: '请输入', trigger: 'blur' }],
})

// 提交用户资料表单
const submitUserInfoForm = () => {
  userInfoFormRef.value.validate(valid => {
    if(valid) {
      let data = {
        token: userStore.getUserInfo.token
      }
      editStaff(userStore.getUserInfo.id, data, userInfoForm)
        .then(res => {
          ElMessage.success(res.msg)
          dialogInfoVisible.value = false
          getUserDetailHandle()
        })
    }
  })
}

const dialogPhoneVisible = ref(false)
const phoneFormRef = ref()

// 编辑手机号
const editPhoneHandle = async () => {
  dialogPhoneVisible.value = true
  await nextTick()
  phoneForm.phone = ''
}
const phoneForm = reactive({
  phone: '',
})

const phoneRules = reactive({
  phone: [{ required: true, message: '请输入', trigger: 'blur' }],
})

// 提交手机号表单
const submitPhoneForm = () => {
  phoneFormRef.value.validate(valid => {
    if(valid) {
      let data = {
        token: userStore.getUserInfo.token
      }
      editStaff(userStore.getUserInfo.id, data, phoneForm)
        .then(res => {
          ElMessage.success(res.msg)
          dialogPhoneVisible.value = false
          getUserDetailHandle()
        })
      // resetPassword(phoneForm)
      //   .then(res => {
      //     ElMessage.success(res.msg)
      //     dialogPhoneVisible.value = false
      //   })
    }
  })
}

const dialogPasswordVisible = ref(false)
const passwordFormRef = ref()

// 编辑密码
const editPasswordHandle = async () => {
  dialogPasswordVisible.value = true
  await nextTick()
  passwordForm.password = ''
  passwordForm.rePassword = ''
}
const passwordForm = reactive({
  password: '',
  rePassword: '',
})

const passwordRules = reactive({
  password: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: validPwd, trigger: 'blur' }
  ],
  rePassword: [
    { required: true, message: '请输入', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
})

// 提交密码表单
const submitPasswordForm = () => {
  passwordFormRef.value.validate(valid => {
    if(valid) {
      let data = {
        token: userStore.getUserInfo.token
      }
      let data2 = {
        passWord: setDataAes(passwordForm.password)
      }
      editStaff(userStore.getUserInfo.id, data, data2)
        .then(res => {
          ElMessage.success(res.msg)
          dialogPasswordVisible.value = false
          getUserDetailHandle()
        })
      // let data = {
      //   phone: userStore.getUserInfo.phone,
      //   passWord: setDataAes(passwordForm.password)
      // }
      // resetPassword(data)
      //   .then(res => {
      //     ElMessage.success(res.msg)
      //     dialogPasswordVisible.value = false
      //   })
    }
  })
}

</script>

<template>
  <div class="wrapper">
    <div class="info">
      <div class="tt">
        <h3>个人资料</h3>
        <el-button type="primary" class="r" link @click="editUserInfoHandle">编辑</el-button>
      </div>
      <ul>
        <li>用户名：<span>{{filterNone(userDetail.userName)}}</span></li>
        <li>姓名：<span>{{filterNone(userDetail.fullName)}}</span></li>
        <li>邮箱：<span>{{filterNone(userDetail.email)}}</span></li>
      </ul>
    </div>
    <el-divider></el-divider>
    <div class="phone">
      <h6>手机号</h6>
      <span>{{filterNone(userDetail.phone)}}</span>
      <el-button type="primary" class="r" link @click="editPhoneHandle">修改</el-button>
    </div>
    <el-divider></el-divider>
    <div class="password">
      <h6>密码</h6>
      <span>已设置</span>
      <el-button type="primary" class="r" link @click="editPasswordHandle">修改</el-button>
    </div>
    <el-dialog v-model="dialogInfoVisible" title="编辑个人资料" width="800px">
      <el-form ref="userInfoFormRef" :model="userInfoForm" :rules="userInfoRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="fullName">
              <el-input v-model="userInfoForm.fullName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfoForm.email" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogInfoVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserInfoForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogPhoneVisible" title="修改手机号" width="500px">
      <el-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="phoneForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogPhoneVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPhoneForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogPasswordVisible" title="修改密码" width="500px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input v-model="passwordForm.password" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认密码" prop="rePassword">
              <el-input v-model="passwordForm.rePassword" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogPasswordVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPasswordForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="pcss" scoped>
.wrapper{
  width: 800px;
}
.info{
  & .tt{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    & h3{
      font-weight: bold;
    }
  }
  & ul{
    @mixin clearfix;
    & li{
      margin-top: 10px;
      width: 50%;
      float: left;
    }
  }
}
.phone, .password{
  @mixin clearfix;
  display: flex;
  & h6{
    display: inline-block;
    width: 100px;
  }
  & span{
    display: inline-block;
    margin-right: 50px;
    flex: 1;
    text-align: right;
    color: #666;
  }
}
</style>