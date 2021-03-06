import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//路由懒加载
const Login = () => import('@/views/login/Login')
const Home = () => import('@/views/home/Home')
const Welcome = () => import('@/components/Welcome')
const Users = () => import('@/components/users/Users')
const Rights = () => import('@/components/power/Rights')
const Roles = () => import('@/components/power/Roles')
const Cate = () => import('@/components/goods/Cate')
const Params = () => import('@/components/goods/Params')
const List = () => import('@/components/goods/List')
const AddGoods = () => import('@/components/goods/AddGoods')
const Order = () => import('@/components/order/Order')
const Report = () => import('@/components/report/Report')

const routes = [
  {path: '/',redirect: '/login'},
  {path: '/login',component: Login},
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome',component: Welcome},
      {path: '/users',component: Users},
      {path: '/rights',component: Rights},
      {path: '/roles',component: Roles},
      {path: '/categories',component: Cate},
      {path: '/params',component: Params},
      {path: '/goods',component: List},
      {path: '/goods/add',component: AddGoods},
      {path: '/orders',component: Order},
      {path: '/reports',component: Report},
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,form,next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  // next() 放行  next('/login')  强制跳转
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})

export default router
