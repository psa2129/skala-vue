<template>
  <div class="container py-5">
    <div class="row align-items-center" v-if="state.product.id !== 0">
      <div class="col-md-6 mb-4 mb-md-0">
        <div class="card border-0 shadow overflow-hidden rounded-4">
          <img :src="state.product.thumbnail" class="img-fluid" style="width: 100%; height: 500px; object-fit: cover;">
        </div>
      </div>
      <div class="col-md-6">
        <span class="badge bg-light text-dark border mb-2 px-3 py-2 rounded-pill">{{ state.product.type }}</span>
        <h1 class="display-5 fw-bold mb-3">{{ state.product.name }}</h1>
        <p class="lead text-muted mb-4">{{ state.product.description }}</p>
        <h3 class="fw-bold mb-4 text-primary">{{ formatPrice(state.product.price) }}원</h3>
        <hr class="my-4 opacity-25">

        <div class="d-flex align-items-center mb-4">
          <span class="me-3 fw-bold">수량</span>
          <div class="btn-group border rounded-pill">
            <button class="btn btn-light" @click="quantity > 1 ? quantity-- : null">-</button>
            <span class="btn btn-light disabled fw-bold text-dark bg-white">{{ quantity }}</span>
            <button class="btn btn-light" @click="quantity++">+</button>
          </div>
        </div>

        <div class="d-grid gap-3 d-md-flex">
          <button class="btn btn-primary btn-lg flex-grow-1 rounded-pill" @click="addToCart">
            장바구니 담기
          </button>
          <button class="btn btn-outline-secondary btn-lg rounded-pill" @click="router.push('/products')">
            목록으로
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const quantity = ref(1);
const state = reactive({ product: { id: 0, name: '', type: '', price: 0, description: '', thumbnail: '' } });

// 가상 데이터
const productData = [
  { id: 1, name: 'Mechanical Keyboard', type: 'Electronics', price: 189000, description: '타건감이 좋은 기계식 키보드', thumbnail: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80' },
  { id: 2, name: 'Wireless Mouse', type: 'Electronics', price: 85000, description: '손목이 편한 무선 마우스', thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80' },
  { id: 3, name: 'Minimal Desk Setup', type: 'Furniture', price: 450000, description: '미니멀 데스크 셋업', thumbnail: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80' },
  { id: 4, name: 'Developer Hoodie', type: 'Apparel', price: 59000, description: '개발자용 편안한 후드티', thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80' }
];

onMounted(() => {
  const productId = parseInt(route.params.id);
  const found = productData.find(p => p.id === productId);
  if (found) state.product = found;
});

const formatPrice = (p) => p?.toLocaleString();

// [핵심] 장바구니 저장 로직
const addToCart = () => {
  const item = {
    id: state.product.id,
    name: state.product.name,
    image: state.product.thumbnail,
    price: state.product.price,
    quantity: quantity.value,
    selected: true
  };

  // 기존 장바구니 불러오기
  const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');

  // 중복 확인
  const existingIdx = currentCart.findIndex(i => i.id === item.id);
  if (existingIdx !== -1) {
    currentCart[existingIdx].quantity += item.quantity;
  } else {
    currentCart.push(item);
  }

  // 저장
  localStorage.setItem('cart', JSON.stringify(currentCart));

  // 확인 로그 (F12 콘솔에서 확인 가능)
  console.log('장바구니 저장 완료:', currentCart);

  alert('장바구니에 담겼습니다!');
  router.push('/cart');
};
</script>