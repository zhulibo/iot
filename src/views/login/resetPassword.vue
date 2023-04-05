<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { resetPassword } from '@/api/user/user'
import {setDataAes} from "@/utils/aes2";
import {validPhone} from "@/utils/validate";

const router = useRouter()

const resetPasswordForm = reactive({
  phone: '',
  password: '',
  rePassword: '',
})
const resetPasswordRule = reactive({
  phone: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: validPhone, trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入', trigger: 'blur' }],
  rePassword: [
    { required: true, message: '请输入', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetPasswordForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
})
const resetPasswordFormRef = ref()

// 登录
const submitResetPasswordForm = () => {
  resetPasswordFormRef.value?.validate(valid => {
    if(valid) {
      resetPassword({
        phone: resetPasswordForm.phone,
        passWord: setDataAes(resetPasswordForm.password)
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
    <div class="reset-password-ct">
      <div class="top">
        <h3>重设密码</h3>
      </div>
      <el-form ref="resetPasswordFormRef" :model="resetPasswordForm" :rules="resetPasswordRule">
        <el-form-item prop="phone">
          <el-input v-model="resetPasswordForm.phone" placeholder="手机号" @keyup.enter="submitResetPasswordForm"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="resetPasswordForm.password" placeholder="密码" @keyup.enter="submitResetPasswordForm"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input type="password" v-model="resetPasswordForm.rePassword" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitResetPasswordForm" style="width: 100%;">确定</el-button>
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
.reset-password-ct{
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
