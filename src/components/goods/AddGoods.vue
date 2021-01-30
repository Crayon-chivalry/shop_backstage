<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 警告区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs标签栏 -->
      <el-form 
        :model="addForm" 
        :rules="addrules" 
        ref="addRef" 
        label-width="100px"
        label-position="top">
        <el-tabs 
          v-model="activeIndex" 
          :tab-position="'left'" 
          :before-leave="beforeLeave"
          @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cartList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 表单的item项 -->
            <el-form-item 
              :label="item.attr_name" 
              v-for="item in cateManyData" 
              :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cd" v-for="(cd,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in cateOnlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="headleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quillEditor v-model="addForm.goods_introduce"></quillEditor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img src="@/assets/logo.png" class="previewImg" />
    </el-dialog>
  </div>
</template>


<script>
import {getCateList,getCateMany} from '@/network/cart'
import {postAddGoods} from '@/network/list'

//引入vue-quill-editor富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'AddGoods',
  data() {
    return {
      activeIndex: '0',
      //表单
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品分类id
        goods_cat: [],
        //上传的图片临时路径
        pics: [],
        // 商品内容
        goods_introduce: '',
        //商品参数
        attrs: []
      },
      //表单验证
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ]
      },
      //商品分类数据
      cartList: [],
      //级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger:'hover',
      },
      //动态参数数据
      cateManyData: [],
      //静态属性数据
      cateOnlyData: [],
      //上传图片地址
      uploadUrl: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      //上传图片headers请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      previewPath: '',
      //预览图片对话框状态
      previewVisible: false
    }
  },
  components:{
    quillEditor
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
    //级联选择器发生变化时触发
    handleChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
       this.$message.error('请选择商品分类')
       return false
      }
    },
    tabClick() {
      //动态参数
      if(this.activeIndex === '1') {
        getCateMany(this.cateId,'many').then(result => {
          const res = result.data
          if(res.meta.status !== 200) {
           return this.$message.error('获取参数失败')
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(' ')
          })
          this.cateManyData = res.data
        })
        //静态属性
      }else if(this.activeIndex === '2') {
        getCateMany(this.cateId,'only').then(result => {
          const res = result.data
          if(res.meta.status !== 200) {
           return this.$message.error('获取参数失败')
          }
          this.cateOnlyData = res.data
        })
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      // this.previewPath = file.response.data.url.split('')
      // this.previewPath.splice(0,22,"http://www.ysqorz.top:8888/api/private/v1/")
      // console.log(this.previewPath)
      //暂时没有办法解决，因为url路径为本地，本地并没有服务器，所以无法加载
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //处理移出图片操作
    handleRemove(file) {
      //获取将要移除的图片临时路径
      const filePath = file.response.data.tmp_path
      //从picd数组找到该图片的索引值
      const i = this.addForm.pics.findIndex(x => {
        x.pic === filePath
      })
      //使用splice方法，从pics数组移除
      this.addForm.pics.splice(i,1)
    },
    //监听图片上传成功的事件
    headleSuccess(response) {
      //拼接得到图片信息对象
      const picInfo = {
        pic : response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    addGoods() {
      console.log(this.addForm)
      this.$refs.addRef.validate(valid => {
        if(!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        //执行添加的业务逻辑
        //深拷贝
        const form = JSON.parse(JSON.stringify(this.addForm))
        //数组转换字符串
        form.goods_cat = form.goods_cat.join(",")
        //处理动态参数
        this.cateManyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.cateOnlyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
          form.attrs = this.addForm.attrs
        })
        //添加商品网络请求
        postAddGoods(form).then(res => {
          if(res.data.meta.status !== 201) {
           return this.$message.error('添加商品失败')
          }
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
      })
    }
  },
  computed: {
    cateId() {
      if(this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>


<style scoped>
  .el-step__title {
    font-size: 13px;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
  .previewImg {
    width: 100%;
  }
  .el-button {
    margin-top: 10px;
  }
</style>