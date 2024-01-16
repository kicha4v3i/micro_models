import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Adf from '../views/ADF.vue'
import DD from '../views/DD.vue'
import DF from '../views/DF.vue'
import Hyd from '../views/HYD.vue'
import WC from '../views/WC.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/applied-drilling-formulas',
      name: 'adf',
      component: Adf
    },
    {
      path: '/directional-drilling-formulas',
      name: 'dd',
      component: DD
    },
    {
      path: '/hydraulics-formulas',
      name: 'hyd',
      component: Hyd
    },
    {
      path: '/well-control-formulas',
      name: 'wc',
      component: WC
    },
    {
      path:'/drilling-fluid-formulas',
      name: 'df',
      component: DF
    }
  ]
})

export default router
