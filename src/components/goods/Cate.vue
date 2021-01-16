<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="cartList" row-key="cat_id" border>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              icon="el-icon-edit" 
              size="mini" 
              @click="showEditCate(scope.row.cat_id)"
            >编辑</el-button>
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              @click="removeCate(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form ref="addCateRef" :model="addCateForm" label-width="80px" :rules="addCateRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑对话框-->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
       @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="addCateRules" ref="editRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
import {getCateList,postAddCate,queryCate,putAddCate,deleteCate} from '@/network/cart'

export default {
  name: 'Cate',
  data() {
    return {
      //商品分类数据列表
      cartList: [],
      //商品分类查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类数据条数
      total: 0,
      //添加分类对话框状态
      addDialogVisible: false,
      //编辑分类对话框状态
      editDialogVisible: false,
      //即将添加分类的表单数据
      addCateForm: {
        //分类名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级,默认要添加的是1级分类
        cat_level: 0
      },
      //表单验证
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //父级分类列表数据
      parentCateList: [],
      //选中的父级分类的id数组
      selectedKeys:[],
      //指定级联选择器的配置对象
      cascaderProps:{
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger:'hover',
        checkStrictly: true
      },
      //即将编辑的分类
      editForm: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    getCateList() {
      getCateList(this.querInfo).then(result =>{
        const res = result.data
        if(res.meta.status !== 200) {
          this.$message.error('获取商品分类失败')
        }
        this.cartList = res.data.result
        this.total = res.data.total
      })
    },
    //监听页码大小改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //当前页变动时候触发事件
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    //显示添加分类的对话框
    showCate() {
      this.addDialogVisible = true
      getCateList({type:2}).then(result => {
        const res = result.data
        if(res.meta.status !== 200) {
         return this.$message.error('获取父级分类数据失败')
        }
        this.parentCateList = res.data
      })
    },
    parentCateChange() {
      //如果selectedKeys数组中的length大于0,证明选中父级分类
      //反之，就说明没有选中任何父级分类
      if(this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        //分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //添加分类
    addCate() {
      this.$refs.addCateRef.validate(valid => {
        if(!valid) return
        postAddCate(this.addCateForm).then(res => {
          if(res.data.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
          this.getCateList()
          this.addDialogVisible = false
        })
      })
    },
    //监听添加分类对话框关闭，重置表单
    addDialogClose() {
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    //显示编辑对话框
    showEditCate(id) {
      queryCate(id).then(result => {
        const res = result.data
        if(res.meta.status !== 200) {
          return this.$message.error('获取失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      })
    },
    //编辑分类网络请求
    editCate() {
      putAddCate(this.editForm).then(res =>{
        if(res.data.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    //监听编辑分类对话框关闭，重置表单
    editDialogClose() {
      this.$refs.editRef.resetFields()
    },
    //删除分类
    removeCate(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCate(id).then(res => {
          if(res.data.meta.status !== 200) {
            return this.$message.error('刪除失敗')
          }
          this.$message.success('刪除成功')
          this.getCateList()
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
  }
  .el-icon-edit{
    color:red;
  }
  .el-icon-success {
    color:lightgreen;
  }
  .el-icon-error {
    color: red;
  }
  .el-cascader {
    width: 100%;
  }
</style>