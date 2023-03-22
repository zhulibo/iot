<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/user/user'
import {encrypt} from "@/utils/aes";
import {validPhone, validPwd, validUserName} from "@/utils/validate";

const router = useRouter()

const registerForm = reactive({
  userName: '',
  phone: '',
  password: '',
})
const registerRule = reactive({
  userName: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: validUserName, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: validPhone, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: validPwd, trigger: 'blur' }
  ],
})
const registerFormRef = ref()

// 注册
const submitLoginForm = () => {
  registerFormRef.value?.validate(valid => {
    if(valid) {
      register({
        username: registerForm.userName,
        phone: registerForm.phone,
        password: encrypt(registerForm.password)
      })
        .then(res => {
          router.push({ path: '/login' })
        })
    }
  })
}

// 去登录
const goToLogin = () => {
  router.push({ path: '/login' })
}
</script>

<template>
  <div class="bg-ct">
    <div class="register-ct">
      <div class="top">
        <h3>新用户注册</h3>
      </div>
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRule">
        <el-form-item prop="account">
          <el-input v-model="registerForm.userName" placeholder="用户名" @keyup.enter="submitLoginForm"></el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input v-model="registerForm.phone" placeholder="手机号" @keyup.enter="submitLoginForm"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="registerForm.password" @keyup.enter="submitLoginForm"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitLoginForm" style="width: 100%;">注册</el-button>
      </el-form>
      <div class="bottom">
        <el-button type="primary" class="r" link size="small" @click="goToLogin">去登陆</el-button>
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
.register-ct{
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
    text-align: right;
  }
}
</style>
