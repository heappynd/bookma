import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/marks'
    },
    {
      path: '/marks',
      name: 'marks',
      redirect: '/marks/list',
      component: Layout,
      children: [
        {
          path: 'list',
          component: () => import('@/views/HomeView.vue')
        }
      ]
    }
  ]
})

export default router
