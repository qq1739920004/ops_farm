import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Layout from '@/layout/index.vue';

export const constantRoutes = [ 
  {
    path: '/perception',
    component: () => import("@/views/machineMgt/perception/index.vue"),
    hidden: false,

  },
  
  // 静态路由数据
  // {
  //   path: '/',
  //   redirect: '/monitoring'
  // },
  // {
  //   path: '/monitoring',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import("@/views/monitoring/index.vue"),
  //       meta: {
  //         title: '态势监控',
  //         icon: 'Notification',
  //       }
  //     },
  //     {
  //       path: 'taskMachine',
  //       component: () => import("@/views/monitoring/taskMachine.vue"),
  //       meta: {
  //         title: '历史轨迹',
  //         activeMenu: '/monitoring',
  //         hidden: true,
  //         breadcrumb: [{ title: '态势监控' }]
  //       },

  //     },
  //     {
  //       path: 'historyChart',
  //       component: () => import("@/views/monitoring/historyChart.vue"),
  //       meta: {
  //         title: '历史趋势图',
  //         activeMenu: '/monitoring',
  //         hidden: true,
  //         breadcrumb: [{ title: '态势监控' }]
  //       },

  //     },
  //   ]
  // },
  // {
  //   path: '/machineryList',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'machineryList',
  //       component: () => import("@/views/machineryList/index.vue"),
  //       meta: {
  //         title: '农机列表',
  //         icon: 'List'
  //       },
  //     },
  //     {
  //       path: 'taskMachine',
  //       name: 'taskMachine',
  //       component: () => import("@/views/machineryList/taskMachine.vue"),
  //       meta: {
  //         title: '历史轨迹',
  //         icon: 'List',
  //         activeMenu: '/machineryList',
  //         hidden: true,
  //         breadcrumb: [{ title: '农机列表' }]
  //       },

  //     }, {
  //       path: 'file',
  //       name: 'file',
  //       component: () => import("@/views/machineryList/file.vue"),
  //       meta: {
  //         title: '文件存储',
  //         icon: 'List',
  //         activeMenu: '/machineryList',
  //         hidden: true,
  //         breadcrumb: [{ title: '农机列表' }]
  //       },

  //     },
  //     {
  //       path: 'backFile/:sn',
  //       name: 'backFile/:sn',
  //       component: () => import("@/views/machineryList/backFile.vue"),
  //       meta: {
  //         title: '回传文件',
  //         icon: 'List',
  //         activeMenu: '/machineryList',
  //         hidden: true,
  //         breadcrumb: [{ title: '农机列表' }]
  //       },

  //     },
  //   ]
  // },
  // {
  //   path: '/jobManagement',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import("@/views/jobManagement/index.vue"),
  //       meta: {
  //         title: '作业管理',
  //         icon: 'CreditCard'
  //       },
  //     },
  //     {
  //       path: 'taskManage',
  //       name: 'taskManage',
  //       component: () => import("@/views/jobManagement/taskManage/index.vue"),
  //       meta: {
  //         title: '作业管理',
  //         icon: 'CreditCard',
  //         activeMenu: '/jobManagement',
  //         hidden: true
  //       },

  //     },
  //   ]
  // },
  // {
  //   path: '/infoManagement',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import("@/views/infoManagement/index.vue"),
  //       meta: {
  //         title: '信息管理',
  //         icon: 'Suitcase'
  //       },
  //     },
  //     {
  //       path: 'aftersale',
  //       name: 'aftersale',
  //       component: () => import("@/views/infoManagement/aftersale/index.vue"),
  //       meta: {
  //         title: '售后处理',
  //         icon: 'Suitcase',
  //         activeMenu: '/infoManagement',
  //         hidden: true,
  //         breadcrumb: [{ title: '信息管理' }]
  //       },

  //     },
  //   ]
  // },
  // // {
  // //   path: '/infoManagement',
  // //   component: Layout,
  // //   children: [
  // //     {
  // //       path: '/infoManagement/aftersale',
  // //       component: () => import("@/views/infoManagement/aftersale/index.vue"),
  // //     },
  // //   ]
  // // },
  // {
  //   path: '/statisticsReport',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import("@/views/statisticsReport/index.vue"),
  //       meta: {
  //         title: '统计报表',
  //         icon: 'Message'
  //       },
  //     },
  //   ]
  // },
  // {
  //   path: '/helpHandling',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import("@/views/helpHandling/index.vue"),
  //       meta: {
  //         title: '求助处理',
  //         icon: 'ChatDotSquare',
  //       },

  //     },
  //     {
  //       path: 'handle',
  //       name: 'handle',
  //       component: () => import("@/views/helpHandling/handle/index.vue")
  //       meta: {
  //         title: '处理详情',
  //         icon: 'Suitcase',
  //         activeMenu: '/helpHandling',
  //         breadcrumb: [{ title: '求助处理' }],
  //         hidden: true
  //       },
  //     },
  //   ]
  // },
  // {
  //   path: '/perception',
  //   component: () => import("@/views/perception/index.vue"),
  //   meta: {
  //     title: '感知平台',
  //     icon: 'ChatSquare'
  //   },
  //   // component: Layout,

  // },

]
export const asyncRoutes: any = []; // 动态路由数据
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})
export function perception(target: string) {
  const dynamicRoute: RouteRecordRaw = {
    path: '/perception',
    meta: {
      title: '感知平台',
      icon: 'ChatSquare'
    },
    component: () => import(`@/views/${target}/index.vue`) // 假设Dynamic.vue是你要动态添加的页面
  };

  router.addRoute(dynamicRoute);
}







export default router
