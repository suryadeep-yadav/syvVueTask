import { createRouter, createWebHistory } from 'vue-router'
import FormTemplates from '../views/FormTemplates.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FormTemplates,
    },
     {
      path: '/form-templates',
      name: 'form-templates',
      component: FormTemplates
    }
  ],
})

export default router
