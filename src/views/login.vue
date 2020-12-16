<template>
  <div class="login" :style="`background-image: url(${bgUrl})`">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" :style="process == 'other' ? 'background: rgba(0, 0, 0, 0.6)' : ''" class="login-form">
      <!-- <img class="logo" src="../assets/logo/logo.png" alt=""> -->
      <h3 class="title">欢迎使用数据中心</h3>
      <div class='login_content'> 
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="code">
          <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode">
          </div>
        </el-form-item> -->
        <el-checkbox v-model="loginForm.rememberMe" class="checkBox">记住我</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="danger" style="width:100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </div>
      <span class="login-tip" :style="process == 'other' ? 'color: #fff' : ''"> 为了获取最佳的浏览体验，建议您选用以下浏览器<br />Chrome60及以上、Firefox53及以上、IE10及以上</span>
    </el-form>
    <!--  底部  -->
    <!-- <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt"/>
      <a style="text-decoration: underline;cursor: pointer;">历史版本</a>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div> -->

  </div>
</template>

<script>
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/config'
// import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { debuglog } from 'util';
import { request } from 'http';
export default {
  name: 'Login',
  data() {
    return {
      // codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        // code: '',
        // uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        // code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined,
      process: '',
      bgUrl: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.process = process.env.HOST
    if (process.env.HOST == 'other') {
      this.bgUrl = require('../assets/avatar/login2.jpg')
    } else {
      this.bgUrl = require('../assets/avatar/login1.png')
    }
    // this.getCode()
    this.getCookie()
  },
  
  methods: {
    // getCode() {
    //   getCodeImg().then(res => {
    //     this.codeUrl = res.img
    //     this.loginForm.uuid = res.uuid
    //   })
    // },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        // code: ''
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: encrypt(this.loginForm.username),
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid
        }
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: Config.passCookieExpires })
            Cookies.set('password', user.password, { expires: Config.passCookieExpires })
            Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', user).then(() => {
            this.loading = false
            
            this.$router.push({ path: this.redirect || '/hana/demo/index' })
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image:url(	"../assets/avatar/login1.png" );
    background-size: cover;
  }
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #ffffff;
  }

  .login-form {
    border-radius: 6px;
    width: 365px;
    padding: 20px 50px;
    height: 500px;
    background: #ffc107;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .logo{
      margin-bottom: 15px;
      margin-left: -19px;
    }
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon{
      height: 39px;width: 14px;margin-left: 2px;
    }
    .checkBox{
      margin:0px 0px 20px 0px;
      color: #ffffff;
      .el-checkbox__label{
        padding-left: 5px;
        margin-top: 3px;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label{
        color: #ffffff;
      }
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #fff;
  }
  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    float: right;
    margin-top: -2px;
    img{
      cursor: pointer;
      vertical-align:middle
    }
  }
  .login-tip{
    display: block;
    text-align: center;
    padding: 0 0 20px;
    font-size: 12px;
    color: rgba(72,57,57,.7);
    line-height: 24px;
  }
</style>
