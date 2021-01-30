<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
         <el-table-column type="index"></el-table-column>
         <el-table-column label="商品名称" prop="goods_name"></el-table-column>
         <el-table-column label="商品价格(元)" prop="goods_price" width="120px"></el-table-column>
         <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
         <el-table-column label="创建时间" prop="add_time" width="170px">
           <template slot-scope="scope">
             {{scope.row.add_time | dateFormat}}
           </template>
         </el-table-column>
         <el-table-column label="操作" width="130px">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.goods_id)"></el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
           </template>
         </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editVisible" width="50%">
      <!-- 表单 -->
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number" >
          <el-input v-model="editForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
import {getGoodsList,deleteGoods,getGoods,putEditGoods} from '@/network/list'

export default {
  name: 'List',
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      //商品总数
      total: 0,
      editVisible: false,
      //编辑商品的表单
      editForm: {
        goods_id: '',
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
      },
      //编辑商品表单验证
      editRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods:{
    getGoodsList() {
      getGoodsList(this.queryInfo).then(result => {
        const res = result.data
        if(res.meta.status !== 200) {
         return this.$message.error('获取商品列表失败')
        }
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //点击编辑按钮事件,显示编辑商品对话框
    showEdit(id) {
      getGoods(id).then(result => {
        const res = result.data
        console.log(res)
        if(res.meta.status !== 200) {
          return this.$message.error('获取商品失败')
        }
        this.editForm = res.data
        this.editVisible = true
        console.log(this.editForm)
      })
    },
    //编辑商品并提交
    //api接口文档有问题，无法编辑
    editGoods() {
      putEditGoods(this.editForm).then(res => {
        console.log(res)
        if(res.data.meta.status !== 201) {
          return this.$message.error('编辑商品失败')
        }
        this.$message.success('编辑商品成功')
        this.getGoodsList()
      })
    },
    //删除商品
    removeById(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(id).then(res => {
          if(res.data.meta.status !== 200) {
           return this.$message.error('已取消删除')
          }
          this.$message.success('删除成功')
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    //添加商品
    goAddGoods() {
      this.$router.push('/goods/add')
    }
  },
  //过滤器
  filters: {
    //时间格式化
    dateFormat(originVal) {
      const dt = new Date(originVal)

      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2,'0')
      const d = (dt.getDate() + '').padStart(2,'0')

      const hh = (dt.getHours() + 1 + '').padStart(2,'0')
      const mm = (dt.getMinutes() + 1 + '').padStart(2,'0')
      const ss = (dt.getSeconds() + 1 + '').padStart(2,'0')

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
  }
}
</script>


<style scoped>
  .el-table {
    margin-top: 15px;
    margin-bottom: 5px;
  }
</style>