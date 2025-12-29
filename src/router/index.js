import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login.vue') },
    { path: '/register', component: () => import('@/views/Register.vue') },
    {
      path: '/',
      redirect: '/manager/home',
    },
    {
      path: '/manager',
      name: 'manager',
      meta: { requiresAuth: true },
      component: () => import('@/views/Manager.vue'),
      children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'password',
        name: 'password',
        component: () => import('@/views/Password.vue'),
      },
      {
        path: 'data',
        name: 'data',
        component: () => import('@/views/Data.vue'),
      },
      {
        path: 'employee',
        name: 'employee',
        component: () => import('@/views/Employee.vue'),
      },
      {
        path: 'employee-form',
        name: 'EmployeeForm',
        component: () => import('@/views/EmployeeForm.vue')
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/Department.vue'),
      },
      {
        path: 'department-form',
        name: 'DepartmentForm',
        component: () => import('@/views/DepartmentForm.vue')
      },
      {
        path: 'user-form',
        name: 'UserForm',
        component: () => import('@/views/UserForm.vue')
      },
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/Info.vue')
      },
      {
        path: 'info-form',
        name: 'InfoForm',
        component: () => import('@/views/InfoForm.vue')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/User.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/Admin.vue'),
      },
      ],
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 1. 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.token) {
    return next('/login')
  }

  // 2. 检查是否需要管理员权限
  if (to.meta.requiresAdmin && !userStore.isAdmin()) {
    alert('无权访问')
    return next(from.path || '/')
  }

  next()
})

export default router
