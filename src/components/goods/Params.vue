<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <!--警告区域-->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectKeys"
            :options="cartList"
            :props="cartProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBntDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag 
                  v-for="(item,i) in scope.row.attr_vals" 
                  :key="i" 
                  closable
                  @close="hendleClose(i,scope.row)"
                >
                  {{item}}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button 
                  type="primary" 
                  size="mini" 
                  icon="el-icon-edit" 
                  @click="editDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  size="mini" 
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBntDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 渲染的tag标签 -->
                <el-tag 
                  v-for="(item,i) in scope.row.attr_vals" 
                  :key="i" 
                  closable 
                  @close="hendleClose(i,scope.row)"
                >
                  {{item}}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button 
                  type="primary" 
                  size="mini" 
                  icon="el-icon-edit" 
                  @click="editDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button 
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
import {getCateList} from '@/network/cart'
import {getParamsList,postAddParams,getQueryParams,putEditParams,deleteParams} from '@/network/params'

export default {
  name: 'Params',
  data() {
    return {
      //商品分类
      cartList: [],
      //级联选择框配置对象
      cartProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger:'hover',
      },
      //级联双向绑定选中的分类id
      selectKeys: [],
      //标签页,被激活的页签
      activeName: 'many',
      //动态参数数据
      manyData: [],
      //静态属性数据
      onlyData: [],
      //添加参数对话框状态
      addDialogVisible: false,
      //修改参数对话框状态
      editDialogVisible:false,
      //即将添加的参数
      addForm: {
        attr_name: ''
      },
      //表单验证
      addRules:{
        attr_name:[
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editRules:{
        attr_name:[
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      //修改参数表单
      editForm: {
        attr_name: ''
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类
    getCateList() {
      getCateList().then(result => {
        const res = result.data
        if(res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.cartList = res.data
      })
    },
    //级联发生变化时触发
    handleChange() {
      this.getParamsData()
    },
    //tab标签页点击事件
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    //网络请求获取参数列表数据
    getParamsData() {
      //判断选中是否为三级分类，不是则清空
      if(this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyData = []
        this.onlyData = []
        this.$message.error('只允许为第三级分类设置相关参数')
        return
      }
      getParamsList(this.cateId,this.activeName).then(result =>{
        const res = result.data
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          //增加文本框的显示状态属性
          item.inputVisible = false
          //增加文本框内容属性
          item.inputValue = ''
        })
        if(res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        if(this.activeName === 'many') {
          this.manyData = res.data
        }else{
          this.onlyData = res.data
        }
        console.log(res.data)
      })
    },
    //关闭对话框触发
    addDialogClose() {
      this.$refs.addRef.resetFields()
    },
    //添加参数
    addParams() {
      this.$refs.addRef.validate(valid =>{
        if(!valid) return
        postAddParams(this.cateId,this.addForm.attr_name,this.activeName).then(res => {
          console.log(res)
          if(res.data.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功')
          this.getParamsData()
          this.addDialogVisible = false
        })
      })
    },
    //点击编辑按钮事件
    editDialog(attr_id) {
      getQueryParams(this.cateId,attr_id,this.activeName).then(res => {
        if(res.data.meta.status !== 200) {
         return this.$message.error('获取参数信息失败')
        }
        this.editForm = res.data.data
        this.editDialogVisible = true
      })
    },
    //修改参数
    editParams() {
      putEditParams(this.cateId,this.editForm,this.activeName).then(res => {
        if(res.data.meta.status !== 200) {
         return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    //关闭修改参数对话框触发
    editDialogClose() {
      this.$refs.editRef.resetFields()
      this.editForm.attr_name = ''
    },
    //删除参数
    removeParams(attr_id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteParams(this.cateId,attr_id).then(res => {
          console.log(res)
          if(res.data.meta.status !== 200) {
           return this.$message.error('删除失败')
          }
          this.$message.success('删除成功')
          this.getParamsData()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    //失去焦点合作摁下 Enter 键时触发
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //网络请求
      this.setAttrValue(row)
    },
    //显示文本框
    showInput(row) {
      row.inputVisible = true
      //$nextTick方法，当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除对应的参数可选项
    hendleClose(i,row) {
      row.attr_vals.splice(i,1)
      this.setAttrValue(row)
    },
    //抽离的网络请求
    setAttrValue(row) {
      putEditParams(this.cateId,row,this.activeName,row.attr_vals.join(',')).then(res => {
        if(res.data.meta.status !== 200) {
         return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
      })
    }
  },
  computed: {
    // 监听按钮是否禁用
    isBntDisabled() {
      if(this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    //三级分类id
    cateId() {
      if(this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    titleText() {
      if(this.activeName === 'many') {
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  }
}
</script>


<style scoped>
  .cat_opt {
    margin: 15px 0;
  }
  .el-table {
    margin-top: 10px;
  }
  .input-new-tag {
    width: 120px;
  }
  .el-tag {
    margin: 5px;
  }
</style>