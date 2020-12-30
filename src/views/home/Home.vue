<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/logo.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主体部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse-bnt" @click="collapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 菜单内容 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本内容 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import { getHomeMenus } from "@/network/home";

export default {
  name: "Home",
  data() {
    return {
      //左侧菜单栏数据
      menulist: [],
      isCollapse: false,
      //被激活链接地址
      activePath: "",
      //图标
      iconObj: {
        125: "el-icon-s-custom",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
    };
  },
  created() {
    this.getMenusList();

    //获取保存在sessionStorage的激活地址
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    //退出按钮
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //折叠
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },

    //网络请求
    getMenusList() {
      getHomeMenus().then((result) => {
        const res = result.data;
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menulist = res.data;
        // console.log(this.menulist);
      });
    },
  },
};
</script>



<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-header div img {
  width: 50px;
  height: 50px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: 0;
}
.collapse-bnt {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>