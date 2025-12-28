import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/manager/home',
    },
    {
      path: '/manager',
      name: 'manager',
      component: () => import('@/views/Manager.vue'),
      children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
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
        path: 'user-form',
        name: 'UserForm',
        component: () => import('@/views/UserForm.vue')
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

export default router
