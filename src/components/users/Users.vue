<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input 
            placeholder="请输入内容" 
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button 
                type="primary" 
                icon="el-icon-edit" 
                size="mini" 
                @click="queryUser(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button 
                type="danger" 
                icon="el-icon-delete" 
                size="mini" 
                @click="removeUser(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="设置" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="changeDialog"
      width="50%"
      @close="changeDialogClose"
    >
      <el-form :model="queryForm" :rules="addFormRules" ref="queryRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="queryForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="queryForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="queryForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import 
  { getHomeUser,putUserStatu,postAddUser,getQueryUser,putChangeUser,deleteUser}
from "@/network/home";

export default {
  name: "User",
  data() {

    //手机验证
    var chenckMobile = (rule,value,cb) => {
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if(regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    //邮箱验证
    var chenckEmail = (rule,value,cb) => {
      const regEmail = /[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible:false,
      changeDialog: false,
      //表单用户数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //查询到的用户信息
      queryForm: {}, 
      //表单验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: chenckEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {validator: chenckMobile, trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //用户列表网络请求
    getUserList() {
      getHomeUser(this.queryInfo).then((result) => {
        const res = result.data;
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.userList = res.data.users;
        this.total = res.data.total;
      })
    },

    //监听pagesizes的改变事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    //监听页码值的改变事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    //监听switch开关的改变
    userStateChanged(userinfo) {
      putUserStatu(userinfo.id,userinfo.mg_state).then(result => {
        const res = result.data
        console.log(res)
        if(res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      })
    },
    //监听对话框关闭，重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //添加新用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if(!valid) return
        postAddUser(this.addForm).then(result => {
          const res = result.data
          if(res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          //关闭对话框
          this.dialogVisible = false
          //重新获取用户列表
          this.getUserList()
        })
      })
    },
    //查询用户资料
    queryUser(id) {
      getQueryUser(id).then(result => {
        const res = result.data
        if(res.meta.status !== 200) {
          return this.$message.error('查询用户失败')
        }
        this.queryForm = res.data
        this.changeDialog = true
      })
    },
    //监听关闭修改用户对话框，重置表单
    changeDialogClose() {
      this.$refs.queryRef.resetFields()
    },
    //修改用户并提交
    changeUser() {
      this.$refs.queryRef.validate(valid => {
        if(!valid) return
        putChangeUser(this.queryForm).then(result => {
          const res = result.data
          if(res.meta.status != 200) {
            return this.$message.error('更新用户信息失败')
          }
          this.changeDialog = false
          this.getUserList()
          this.$message.success('更新用户信息成功')
        })
      })
    },
    //删除用户
    removeUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(result => {
          const res = result.data
          if(res.meta.status != 200) {
            this.$message.error('删除用户失败')
          }
          this.$message.success('删除用户成功')
          this.getUserList()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>


<style scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>