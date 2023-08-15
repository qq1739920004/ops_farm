import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue';

export const constantRoutes = [ // 静态路由数据
  {
    path: '/',
    redirect: '/monitoring'
  },
  {
    path: '/monitoring',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import("@/views/monitoring/index.vue"),
        meta: {
          title: '态势监控',
          icon: 'Notification'
        },
      }
    ]
  },
  {
    path: '/machineryList',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import("@/views/machineryList/index.vue"),
        meta: {
          title: '农机列表',
          icon: 'List'
        },
      },
    ]
  },
  {
    path: '/jobManagement',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import("@/views/jobManagement/index.vue"),
        meta: {
          title: '作业管理',
          icon: 'CreditCard'
        },
      },
    ]
  },
  {
    path: '/infoManagement',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import("@/views/infoManagement/index.vue"),
        meta: {
          title: '信息管理',
          icon: 'Suitcase'
        },
      },
      {
        path: 'aftersale',
        name:'aftersale',
        component: () => import("@/views/infoManagement/aftersale/index.vue"),
        meta: {
          title: '信息管理',
          icon: 'Suitcase',
          activeMenu:'/infoManagement',
          hidden:true
        },
       
      },
    ]
  },
  // {
  //   path: '/infoManagement',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/infoManagement/aftersale',
  //       component: () => import("@/views/infoManagement/aftersale/index.vue"),
  //     },
  //   ]
  // },
  {
    path: '/statisticsReport',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import("@/views/statisticsReport/index.vue"),
        meta: {
          title: '统计报表',
          icon: 'Message'
        },
      },
    ]
  },
  {
    path: '/helpHandling',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import("@/views/helpHandling/index.vue"),
        meta: {
          title: '求助处理',
          icon: 'ChatDotSquare',
          
        },

      },
      {
        path: 'handle',
        name:'handle',    
        component: () => import("@/views/helpHandling/handle/index.vue"),
        meta: {
          title: '处理详情',
          icon: 'Suitcase',
          activeMenu:'/helpHandling',
          hidden:true    
        },
      },
    ]
  },
  {
    path: '/perception',
    component: () => import("@/views/perception/index.vue"),
        meta: {
          title: '感知平台',
          icon: 'ChatSquare'
        },
    // component: Layout,

  },



]
export const asyncRoutes = []; // 动态路由数据

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})




export default router
