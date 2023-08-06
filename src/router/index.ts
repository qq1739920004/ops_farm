import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue';

export const constantRoutes = [ // 静态路由数据
  {
    path: '/',
    redirect: '/menu1'
  },
  {
    path: '/menu1',
    component: Layout,

    children: [
      {
        path: '',
        component: () => import("@/views/menu1/index.vue"),
        meta: {
          title: 'menu1',
          icon: 'Minus'
        },
      }
    ]
  },
  {
    path: '/menu2',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import("@/views/menu2/index.vue"),
        meta: {
          title: 'menu2s1',
          icon: 'Minus'
        },
      },
    ]
  },
  {
    path: '/menu3',
    component: Layout,
    redirect: '/menu3/menu31',
    meta: {
      title: 'me',
      icon: 'Minus'
    },
    children: [
      {
        path: 'menu31',
        component: () => import("@/views/menu3/menu3-1.vue"),
        meta: {
          title: 'menu3-1',
          icon: 'Minus'
        },

      },
      {
        path: 'menu32',
        component: () => import("@/views/menu3/menu3-2.vue"),
        redirect: '/menu3/menu32/menu311123',
        meta: {
          title: 'menu3-2',
          icon: 'Minus'
        },
        children: [
          {
            path: 'menu311123',
            component: () => import("@/views/menu3/menu3-1.vue"),
            meta: {
              title: 'menu3-1123',
              icon: 'Minus'
            },

          },
          {
            path: 'menu3123321',
            component: () => import("@/views/menu3/menu3-1.vue"),
            meta: {
              title: 'menu3-1123',
              icon: 'Minus'
            },

          },
        ]
      },
    ]
  },


]
export const asyncRoutes = []; // 动态路由数据

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})




export default router
