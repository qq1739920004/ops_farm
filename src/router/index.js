import Vue from 'vue'
import Router from 'vue-router'
import state from '@/store'
import { permissionList_path } from '@/api'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/locationManage/gisMonitoring'
  },
  {
    path: '/locationManage',
    component: Layout,
    children: [
      {
        path: 'gisMonitoring',
        name: 'gisMonitoring',
        component: () => import('@/views/locationManage/gisMonitoring'),
        meta: { title: '态势监控', icon: 'el-icon-location' }
      }
    ]
  },
  {
    path: '/vehicleManage',
    component: Layout,
    redirect: '/vehicleManage/carList',
    meta: { title: '农机管理', icon: 'el-icon-coordinate' },
    children: [

      {
        path: 'product',
        name: 'vehicleManage_product',
        hidden: true,
        component: () => import('@/views/vehicleManage/fileList/product'),
        meta: { title: '文件存储', icon: 'el-icon-download', activeMenu: '/vehicleManage/carList', keepAlive: true }
      },
      {
        path: 'device',
        name: 'vehicleManage_device',
        hidden: true,
        component: () => import('@/views/vehicleManage/fileList'),
        meta: { title: '设备SN', replaceTitlePid: true, icon: 'el-icon-download', activeMenu: '/vehicleManage/carList', keepAlive: true, breadcrumb: ['农机列表'] }
      },

      {
        path: 'file',
        name: 'vehicleManage_file',
        hidden: true,
        component: () => import('@/views/vehicleManage/fileList/children'),
        meta: { title: '子文件', replaceTitleSn: true, icon: 'el-icon-aim', activeMenu: '/vehicleManage/carList', breadcrumb: ['农机列表'] }
      },
      {
        path: 'backFile/:pid/:sn',
        name: 'vehicleManage_backFile',
        hidden: true,
        component: () => import('@/views/vehicleManage/fileList/backFile'),
        meta: { title: '回传', replaceBack: true, icon: 'el-icon-aim', activeMenu: '/vehicleManage/carList', breadcrumb: ['农机列表'] }
      },

      {
        path: 'carList',
        name: 'carList',
        component: () => import('@/views/vehicleManage/carList'),
        meta: { title: '农机列表', icon: 'el-icon-s-data' }
      },
      {
        path: 'infoManage',
        name: 'infoManage',
        component: () => import('@/views/vehicleManage/infoManage'),
        meta: { title: '信息管理', icon: 'el-icon-document', permissionId: 75 }
      },
      {
        path: 'historyRoute',
        name: 'historyRoute',
        hidden: true,
        component: () => import('@/views/vehicleManage/historyRoute'),
        meta: { title: '轨迹查询', icon: 'form' }
      },
      {
        path: 'alarmRecord',
        name: 'alarmRecord',
        hidden: true,
        component: () => import('@/views/vehicleManage/alarmRecord'),
        meta: { title: '报警记录', icon: 'form' }
      },
      {
        path: 'logManage',
        name: 'logManage',
        hidden: true,
        component: () => import('@/views/vehicleManage/logManage'),
        meta: { title: '日志管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/jobManage',
    component: Layout,
    children: [
      {
        path: 'taskManage',
        name: 'taskManage',
        component: () => import('@/views/jobManage/taskManage'),
        meta: { title: '作业管理', icon: 'el-icon-s-grid' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    children: [
      {
        path: 'statisticalReport',
        name: 'statisticalReport',
        component: () => import('@/views/statistics/statisticalReport'),
        meta: { title: '统计报表', icon: 'el-icon-s-marketing', permissionId: 78 }
      }
    ]
  },
  {
    path: '/handle',
    component: Layout,
    children: [
      {
        path: 'seekHelp',
        name: 'seekHelp',
        component: () => import('@/views/handle/seekHelp'),
        meta: { title: '求助处理', icon: 'el-icon-phone-outline', requireAdmin: true }
      },
      {
        path: 'seekDetail',
        name: 'seekDetail',
        hidden: true,
        component: () => import('@/views/handle/seekDetail'),
        meta: { title: '求助处理详情', icon: 'el-icon-phone-outline' }
      }
    ]
  },
  {
    path: '/situation',
    component: Layout,
    children: [
      {
        path: 'awareness',
        name: 'awareness',
        component: () => import('@/views/situation/awareness'),
        meta: { title: '感知平台', icon: 'el-icon-aim', requireAdmin: true }
      }
    ]
  },
  {
    path: '/jurisdiction',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'noPermission',
        name: 'noPermission',
        component: () => import('@/views/jurisdiction/noPermission'),
        meta: { title: '无权限', icon: 'el-icon-aim', permissionId: 1 }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach((to, from, next) => {
  try {
    if (to.matched.some(record => record.meta.permissionId)) {
      if (state.state.index.permission.length) {
        if (!state.state.index.permission.includes(to.meta.permissionId)) {
          next({
            path: '/jurisdiction/noPermission'
          })
        } else {
          next()
        }
      } else {
        next({
          path: '/jurisdiction/noPermission'
        })
      }
    } else if (to.matched.some(record => record.meta.requireAdmin)) {
      // let admin = store.state.farmSuperAdministrator;
      let adminString = localStorage.getItem('farmSuperAdministrator');
      let admin = adminString === 'true';
      if (admin) {
        next();
      } else {
        next({
          path: '/jurisdiction/noPermission'
        });
      }
    } else {
      next()
    }
  } catch (err) {
    console.log(err);
    next();
  }
})

export default router
