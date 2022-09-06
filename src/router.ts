import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"
 
export const routes:RouteRecordRaw[] = [
  {
    path:"/",
    component:()=>import("./index.vue")
  },
]

export const router = createRouter({
  routes,
  history:createWebHistory()
})
