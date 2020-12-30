<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png"/>
      </div>
      <!-- 登陆表单区域 -->
      <el-form label-width="0px" 
              :rules="loginFormRules" 
              :model="loginForm" 
              class="login_from"
              ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" 
                    prefix-icon="el-icon-lock"
                    type="password">
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="bnt">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import {postLogin} from '@/network/login'

export default {
  name: 'Login',
  data() {
    return {
      //用户账户密码
      loginForm: {
        username:'admin',
        password: '123456',
      },
      // 表单验证
      loginFormRules: {
        // 用户名验证
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        //密码验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //重置按钮事件，重置表单
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //登陆按钮，对整个表单进行校验
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if(!valid) return;
        //axios请求
        postLogin(this.loginForm).then(result => {
          // console.log(result)
          const res = result.data
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('登陆成功')
          //将登陆成功之后的token，保存到客户端的sessionStorage中
          //项目中除了登陆之外的其他API接口，必须在登陆之后才能访问
          //token只在当前网站打开期间生效，所以保存在sessionStorage中
          window.sessionStorage.setItem("token",res.data.token);
          //跳转home后台主页
          this.$router.push('/home');
        })
      })
    }
  }
}
</script>


<style scoped>
  .login_container{
    height: 100%;
    background-color: cadetblue;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
  }
  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .login_from{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .bnt {
    display: flex;
    justify-content: flex-end;
  }
</style>