import { createRouter, createWebHistory } from 'vue-router'

import Login from './pages/Login.vue'
import ProductList from './pages/ProductList.vue'     // [수정됨] 이름 오타 수정
import ProductDetail from './pages/ProductDetail.vue' // [수정됨] 이름 오타 수정
import Cart from './pages/Cart.vue'

const routes = [
  { path: '/', redirect: '/products' }, // 루트 접속 시 제품 목록으로
  { path: '/login', component: Login },
  { path: '/products', component: ProductList },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  { path: '/cart', component: Cart }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router