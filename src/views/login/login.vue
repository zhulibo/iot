<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/user/user'
import {encrypt} from "@/utils/aes";
import {validUserName} from "@/utils/validate";
import {setDataAes} from "@/utils/ase";

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  userName: '',
  password: '',
})
const loginRule = reactive({
  userName: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: validUserName, trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入', trigger: 'blur' }],
})
const loginFormRef = ref()

// 登录
const submitLoginForm = () => {
  loginFormRef.value?.validate(valid => {
    if(valid) {
      login({
        username: loginForm.userName,
        // password: encrypt(loginForm.password)
        password: setDataAes('2589633659865985',loginForm.password)
      })
        .then(res => {
          let userInfo = {
            token: res.data.token,
            ...res.data.userinfo
          }
          userStore.updateUserInfo(userInfo)
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          router.push({ path: '/home/dashboard' })
        })
    }
  })
}

// 去注册
const goToRegister = () => {
  router.push({ path: '/register' })
}

// 忘记密码
const forgetPassword = () => {
}

const inputType = ref('password')
const changeInputType = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}
</script>

<template>
  <div class="bg-ct">
    <div class="login-ct">
      <div class="top">
        <h3>用户登录</h3>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRule">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="用户名" @keyup.enter="submitLoginForm"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="inputType" placeholder="密码" v-model="loginForm.password" @keyup.enter="submitLoginForm">
            <template #suffix>
              <icon name="see" class="see" @click="changeInputType" />
            </template>
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submitLoginForm" style="width: 100%;">登录</el-button>
      </el-form>
      <div class="bottom">
        <el-button type="primary" class="l" link size="small" @click="forgetPassword">忘记密码</el-button>
        <el-button type="primary" class="r" link size="small" @click="goToRegister">新用户注册</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="pcss" scoped>
.bg-ct{
  overflow: hidden;
  height: 100%;
  background-color: #ddd;
  //background: var(--mainColor) url(../../assets/img/bg.jpg) center center/cover no-repeat;
}
.login-ct{
  margin-top: 20vh;
  margin-left: 50vw;
  padding: 30px;
  width: 300px;
  border-radius: 10px;
  background-color: rgba(255,255,255,.9);
  & .top{
    margin-bottom: 10px;
    font-size: 18px;
    text-align: center;
  }
  & .bottom{
    margin-top: 7px;
    display: flex;
    justify-content: space-between;
  }
}
.see{
  font-size: 18px;
  color: #999;
  cursor: pointer;
}
</style>
