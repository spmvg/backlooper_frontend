import { createRouter, createWebHistory } from 'vue-router'
import Documentation from '@/components/Documentation'
import NotFound from '@/components/NotFound'
import BackLooper from '@/components/BackLooper'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'BackLooper',
      component: BackLooper
    },
    {
      path: '/docs/:filename',
      name: 'Documentation',
      component: Documentation
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound
    }
  ]
})
export default router
