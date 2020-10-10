import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/admin',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '管理员管理',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员管理', icon: 'el-icon-eleme' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '角色管理',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/seller',
    component: Layout,
    name: '商户与分类',
    meta: { title: '商户与分类', icon: 'seller' },
    children: [
      {
        path: 'list',
        name: '商户管理',
        component: () => import('@/views/seller/index'),
        meta: { title: '商户管理', icon: 'seller' }
      }
      // },
      // {
      //   path: '/category',
      //   name: '分类管理',
      //   component: () => import('@/views/category/index'),
      //   meta: { title: '分类管理', icon: 'el-icon-menu' }
      // }
    ]
  },
  // {
  //   path: '/category',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'list',
  //       name: '分类管理',
  //       component: () => import('@/views/category/index'),
  //       meta: { title: '分类管理', icon: 'el-icon-menu' }
  //     }
  //   ]
  // },
  {
    path: '/product',
    component: Layout,
    name: '商品与水票',
    meta: { title: '商品与水票', icon: 'el-icon-present' },
    children: [
      {
        path: 'list',
        name: '商品管理',
        component: () => import('@/views/product/index'),
        meta: { title: '商品管理', icon: 'el-icon-present' }
      },
      {
        path: '/ticket',
        name: '水票管理',
        component: () => import('@/views/ticket/index'),
        meta: { title: '水票管理', icon: 'ticket' }
      }
    ]
  },
  // {
  //   path: '/ticket',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'list',
  //       name: '水票管理',
  //       component: () => import('@/views/ticket/index'),
  //       meta: { title: '水票管理', icon: 'ticket' }
  //     }
  //   ]
  // },
  {
    path: '/site',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '水站管理',
        component: () => import('@/views/site/index'),
        meta: { title: '水站管理', icon: 'water-site' }
      }
    ]
  },
  {
    path: '/deliverer',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '配送员管理',
        component: () => import('@/views/deliverer/index'),
        meta: { title: '配送员管理', icon: 'deliverer' }
      }
    ]
  },
  {
    path: '/cash',
    component: Layout,
    name: '提现管理',
    meta: { title: '提现管理', icon: 'el-icon-s-finance' },
    children: [
      {
        path: 'list',
        name: '配送员提现',
        component: () => import('@/views/cash/index'),
        meta: { title: '配送员提现', icon: 'el-icon-s-finance' }
      },
      {
        path: 'user',
        name: '用户提现',
        component: () => import('@/views/cash/user'),
        meta: { title: '用户提现', icon: 'el-icon-s-finance' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: '用户管理',
    meta: { title: '用户管理', icon: 'el-icon-present' },
    children: [
      {
        path: 'list',
        name: '用户',
        component: () => import('@/views/user/index'),
        meta: { title: '用户', icon: 'el-icon-user-solid' }
      },
      {
        path: '/userTicket',
        name: '用户水票',
        component: () => import('@/views/userTicket/index'),
        meta: { title: '用户水票', icon: 'el-icon-s-ticket' }
      }
    ]
  },
  {
    path: '/plan',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '活动管理',
        component: () => import('@/views/plan/index'),
        meta: { title: '活动管理', icon: 'plan' }
      }
    ]
  },
  {
    path: '/coupon',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '优惠券管理',
        component: () => import('@/views/coupon/index'),
        meta: { title: '优惠券管理', icon: 'el-icon-s-ticket' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '订单管理',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'el-icon-s-order' }
      }
    ]
  },
  {
    path: '/accountLog',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '用户日志',
        component: () => import('@/views/log/index'),
        meta: { title: '用户日志', icon: 'el-icon-notebook-1' }
      }
    ]
  },
  {
    path: '/income',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '收益帐号',
        component: () => import('@/views/income/index'),
        meta: { title: '收益帐号', icon: 'el-icon-notebook-1' }
      }
    ]
  },
  {
    path: '/invoice',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '发票管理',
        component: () => import('@/views/invoice/index'),
        meta: { title: '发票管理', icon: 'el-icon-money' }
      }
    ]
  },
  // {
  //   path: '/userTicket',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'userTicket',
  //       name: '用户水票',
  //       component: () => import('@/views/userTicket/index'),
  //       meta: { title: '用户水票', icon: 'el-icon-s-ticket' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: '/background',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
