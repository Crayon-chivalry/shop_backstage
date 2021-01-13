<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row 
              v-for="(item1,index1) in scope.row.children" 
              :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '','vncerten']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <el-row 
                  v-for="(item2,index2) in item1.children" 
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop','vncerten']"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag 
                      v-for="(item3,index3) in item2.children" 
                      :key="item3.id" 
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="queryRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoles(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRight(scope.row)">权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <!-- 表单 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 表单 -->
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="addFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightClose">
      <!-- 树形控件 -->
      <el-tree 
        :data="rightList" 
        :props="treeProps" 
        show-checkbox 
        node-key="id" 
        default-expand-all
        :default-checked-keys="defaultKey"
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
import 
  {
    getRoles,postAddRoles,getQuery,
    putEditRoles,deleteRoles,deleteRight,
    getRight,postAllotRight
  } 
from '@/network/roles'

export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      //添加角色表单
      addForm: {},
      editForm: {},
      //所有可分配权限列表
      rightList:[],
      //树形控件绑定属性对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      //树形控件默认勾选项
      defaultKey:[],
      //当前即将分配权限的角色id
      roleId: '',
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      //表单验证
      addFormRules:{
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //角色列表
    getRolesList() {
      getRoles().then(result => {
        const res = result.data
        if(res.meta.status != 200) {
          this.$message.error('获取角色失败')
        }
        this.rolesList = res.data
      })
    },
    //关闭添加角色对话框重置表单
    closeDialog() {
      this.$refs.addFormRef.resetFields()
    },
    //添加角色
    addRoles() {
      postAddRoles(this.addForm).then(result => {
        const res = result.data
        if(res.meta.status != 201) {
          return this.$message.error('创建角色失败')
        }
        this.$message.success('创建成功')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    //关闭修改角色对话框重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //点击编辑按钮，查询角色信息
    queryRoles(id) {
      getQuery(id).then(result => {
        const res = result.data
        if(res.meta.status != 200) {
          this.$message.error('出错啦')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      })
    },
    //编辑角色
    editRoles() {
      console.log(this.editForm)
      putEditRoles(this.editForm).then(res => {
        if(res.data.meta.status != 200) {
          this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    //删除角色
    removeRoles(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(id).then(res => {
          if(res.data.meta.status != 200) {
            return this.$message.error('删除失败')
          }
          this.getRolesList()
          this.$message.success('删除成功')
        })
      }).catch(() =>{
        this.$message.info('已取消删除')
      })
    },
    //删除权限
    removeRightById(roles,rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRight(roles.id,rightId).then(res => {
          if(res.data.meta.status != 200) {
            return this.$message.error('取消权限失败')
          }
          roles.children = res.data.data
          this.$message.success('取消权限成功')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    //显示所有可分配的权限
    showSetRight(roles) {
      //当前角色id
      this.roleId = roles.id
      getRight().then(result => {
        const res = result.data
        if(res.meta.status !== 200) {
          this.$message.error('获取权限数据失败')
        }
        this.rightList = res.data
        //递归获取三级节点id
        this.getLeafKey(roles,this.defaultKey)
        this.setRightDialogVisible = true
      })
    },
    //通过递归形式，获取所有三级权限id
    getLeafKey(node,arr) {
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKey(item,arr)
      })
    },
    //监听分配权限对话框关闭，清空默认权限数据
    setRightClose() {
      this.defaultKey = []
    },
    //分配角色权限
    allotRights() {
      //获取勾选和半选中的节点
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      postAllotRight(this.roleId,idStr).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    }
  }
}
</script>


<style scoped>
  .el-table{
    margin-top: 15px;
  }
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vncerten {
    display: flex;
    align-items: center;
  }
</style>