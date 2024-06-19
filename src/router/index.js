import { createRouter, createWebHistory } from 'vue-router'
import DocsPage from '@/components/DocsPage'
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
      name: 'DocsPage',
      component: DocsPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound
    }
  ]
})
export default router
