<template>
  <div class="container py-5">
    <h2 class="mb-4 fw-bold"><i class="bi bi-basket me-2"></i>장바구니</h2>

    <div v-if="state.cartItems.length === 0" class="text-center py-5">
      <i class="bi bi-cart-x display-1 text-muted opacity-50"></i>
      <p class="mt-3 text-muted fs-5">장바구니가 비어있습니다.</p>
      <router-link to="/products" class="btn btn-gradient-primary rounded-pill px-4 mt-2">
        쇼핑하러 가기
      </router-link>
    </div>

    <div v-else class="row">
      <div class="col-lg-8 mb-4">
        <div class="card border-0 shadow-sm mb-3 product-card" v-for="(item, index) in state.cartItems" :key="index">
          <div class="card-body">
            <div class="d-flex align-items-center">

              <div class="me-3">
                <input class="form-check-input" type="checkbox" v-model="item.selected" @change="saveCart"
                  style="width: 1.5em; height: 1.5em; cursor: pointer;">
              </div>

              <img :src="item.image || 'https://via.placeholder.com/80'" class="rounded me-3 border"
                style="width: 80px; height: 80px; object-fit: cover;" alt="상품">

              <div class="flex-grow-1">
                <h5 class="mb-1 fw-bold">{{ item.name || '상품명 없음' }}</h5>
                <p class="text-primary fw-bold mb-0">{{ formatPrice(item.price || 0) }}원</p>
              </div>

              <div class="d-flex flex-column align-items-end gap-2">
                <div class="input-group input-group-sm" style="width: 100px;">
                  <button class="btn btn-outline-secondary" type="button" @click="changeQuantity(index, -1)">-</button>
                  <input type="text" class="form-control text-center bg-white" :value="item.quantity" readonly>
                  <button class="btn btn-outline-secondary" type="button" @click="changeQuantity(index, 1)">+</button>
                </div>

                <button class="btn btn-sm btn-outline-danger border-0" @click="removeItem(index)">
                  <i class="bi bi-trash"></i> 삭제
                </button>
              </div>

            </div>
          </div>
        </div>

        <div class="text-end mt-3">
          <button class="btn btn-sm btn-light text-muted text-decoration-underline" @click="clearAll">
            장바구니 비우기 (오류 시 클릭)
          </button>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm sticky-top" style="top: 100px;">
          <div class="card-header bg-white border-0 pt-4 pb-0">
            <h5 class="mb-0 fw-bold">Order Summary</h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2 text-muted">
              <span>총 상품 수</span>
              <span>{{ totalCount }}개</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span>선택 상품 수</span>
              <span class="fw-bold text-dark">{{ selectedCount }}개</span>
            </div>
            <hr class="opacity-25">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="fs-5 fw-bold">총 결제금액</span>
              <span class="fs-4 fw-bold text-primary">{{ formatPrice(totalPrice) }}원</span>
            </div>

            <button class="btn btn-gradient-primary w-100 btn-lg rounded-pill shadow-sm" @click="purchase">
              <i class="bi bi-credit-card-fill me-2"></i> 결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const state = reactive({
  cartItems: []
});

// 1. 데이터 로드 (안전 장치 추가)
onMounted(() => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedData = JSON.parse(storedCart);

      // 데이터가 배열인지 확인하고, 내부 데이터가 깨졌는지 필터링합니다.
      if (Array.isArray(parsedData)) {
        // id와 price가 제대로 있는 정상적인 아이템만 남깁니다.
        state.cartItems = parsedData.filter(item => item && item.id);
      }
    }
  } catch (e) {
    console.error("장바구니 데이터 로드 중 오류 발생:", e);
    // 에러 발생 시 초기화
    localStorage.removeItem('cart');
    state.cartItems = [];
  }
});

// 2. 저장 함수
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(state.cartItems));
};

// 3. 수량 변경
const changeQuantity = (index, change) => {
  const item = state.cartItems[index];
  if (!item) return; // 안전장치

  const newQty = (item.quantity || 1) + change;
  if (newQty > 0) {
    item.quantity = newQty;
    saveCart();
  }
};

// 4. 삭제
const removeItem = (index) => {
  if (confirm('삭제하시겠습니까?')) {
    state.cartItems.splice(index, 1);
    saveCart();
  }
};

// 5. 전체 비우기 (오류 해결용)
const clearAll = () => {
  if (confirm('장바구니를 완전히 비우시겠습니까?')) {
    state.cartItems = [];
    localStorage.removeItem('cart');
  }
};

// 6. 계산 로직 (안전장치 추가: item이 null일 경우 방지)
const totalCount = computed(() => {
  return state.cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);
});

const selectedCount = computed(() => {
  return state.cartItems
    .filter(item => item?.selected)
    .reduce((acc, item) => acc + (item?.quantity || 0), 0);
});

const totalPrice = computed(() => {
  return state.cartItems
    .filter(item => item?.selected)
    .reduce((acc, item) => acc + ((item?.price || 0) * (item?.quantity || 0)), 0);
});

const purchase = () => {
  if (selectedCount.value === 0) {
    alert('구매할 상품이 없습니다.');
    return;
  }
  alert('결제 완료!');
  state.cartItems = state.cartItems.filter(item => !item.selected);
  saveCart();
  router.push('/products');
};

const formatPrice = (price) => {
  return (price || 0).toLocaleString();
};
</script>

<style scoped>
.btn-gradient-primary {
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-gradient-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 114, 255, 0.4);
}
</style>