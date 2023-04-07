import layout from '@/layout/layout.vue'

export const baseRoutes = [
  {
    path: '/',
    meta: {
      hidden: true,
    },
    redirect: { path: '/home/dashboard' },
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录页',
      hidden: true,
    },
    component: () => import('@/views/login/login.vue'),
  },
  {
    name: 'resetPassword',
    path: '/resetPassword',
    meta: {
      title: '重设密码',
      hidden: true,
    },
    component: () => import('@/views/login/resetPassword.vue'),
  },
  {
    name: 'register',
    path: '/register',
    meta: {
      title: '注册',
      hidden: true,
    },
    component: () => import('@/views/login/register.vue'),
  },
  // {
  //   name: 'playground',
  //   path: '/playground',
  //   meta: {
  //     title: 'playground',
  //     icon: 'baicai',
  //   },
  //   component: layout,
  //   children: [
  //     {
  //       name: 'test',
  //       path: 'test',
  //       meta: {
  //         title: 'test',
  //         icon: 'baicai',
  //       },
  //       component: () => import('@/views/playground/test.vue'),
  //     },
  //     {
  //       name: 'test2',
  //       path: 'test2',
  //       meta: {
  //         title: 'test2',
  //         icon: 'baicai',
  //       },
  //       component: () => import('@/views/playground/test2.vue'),
  //     }
  //   ]
  // }
]
