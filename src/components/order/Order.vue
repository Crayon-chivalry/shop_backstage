<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="95px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="85px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgess"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 编辑订单的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addresVisible"
      width="50%"
      @close="addersClose">
      <el-form :model="addersForm" :rules="addersRules" ref="addersRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="adders1">
          <el-cascader
            v-model="addersForm.adders1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adders2">
          <el-input v-model="addersForm.adders2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addresVisible = false">取 消</el-button>
        <el-button type="primary" @click="addresVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progessVisible"
      width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>


<script>
import {getOrderList,getOrderProgress} from '@/network/order'

import cityData from './city_data2017_element'

export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addresVisible: false,
      progessVisible: false,
      addersForm: {
        adders1: [],
        adders2: ''
      },
      addersRules: {
        adders1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        adders2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ]
      },
      cityData,
      reverse: true,
      //模拟物流接口数据
      activities: [
        {
          content: '已签收,感谢使用顺丰,期待再次为您服务',
          timestamp: '2018-04-17'
        }, {
          content: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          timestamp: '2018-04-17'
        }, {
          content: '快件到达 [北京海淀育新小区营业点]',
          timestamp: '2018-04-16'
        }, {
          content: '顺丰速运 已收取快件',
          timestamp: '2018-04-15'
        }, {
          content: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货',
          timestamp: '2018-04-13'
        }, {
          content: '商品已经下单',
          timestamp: '2018-04-11'
        }
      ]
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      getOrderList(this.queryInfo).then(result=> {
        const res = result.data
        if(res.meta.status != 200) {
          return this.$message.error('获取订单列表失败')
        }
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    //显示编辑订单事件
    showBox() {
      this.addresVisible = true
    },
    addersClose() {
      this.$refs.addersRef.resetFields()
    },
    showProgess() {
      // getOrderProgress().then(result => {
      //   const res = result.data
      //   if(res.meta.status !== 200) {
      //    return this.$message.error('获取物流进度失败')
      //   }
      //   this.progessInfo = res.data
      //   console.log(this.progessInfo) 
      // })
      this.progessVisible = true
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
  }
</style>