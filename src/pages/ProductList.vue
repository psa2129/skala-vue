<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="fw-bold display-6 text-dark">Trending Products</h2>
      <p class="text-muted">최신 트렌드 상품을 만나보세요</p>
    </div>

    <div v-if="filteredProducts.length === 0" class="text-center py-5">
      <i class="bi bi-search display-1 text-muted opacity-50"></i>
      <p class="mt-3 text-muted fs-5">
        '<span class="fw-bold text-dark">{{ route.query.q }}</span>'에 대한 검색 결과가 없습니다.
      </p>
      <button class="btn btn-outline-primary mt-2" @click="clearSearch">전체 목록 보기</button>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      <div class="col" v-for="product in filteredProducts" :key="product.id">
        <div class="card h-100 border-0 shadow-sm product-card" @click="goToDetail(product.id)">

          <div class="position-relative overflow-hidden rounded-top-4">
            <img :src="product.thumbnail" class="card-img-top" alt="상품 이미지">
            <span class="category-badge">{{ product.type }}</span>
          </div>

          <div class="card-body">
            <h5 class="card-title fw-bold mb-2 text-dark">{{ product.name }}</h5>
            <p class="card-text text-muted small text-truncate mb-3">{{ product.description }}</p>

            <div class="d-flex justify-content-between align-items-center">
              <span class="price-text">{{ formatPrice(product.price) }}원</span>
              <button class="btn btn-sm btn-light rounded-circle border shadow-sm" style="width: 32px; height: 32px;">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); // 현재 URL 정보를 실시간으로 가져옴

const state = reactive({
  products: [
    { id: 1, name: 'Mechanical Keyboard', type: 'Electronics', price: 189000, description: '프리미엄 알루미늄 바디와 커스텀 스위치가 적용된 기계식 키보드입니다.', thumbnail: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Wireless Mouse', type: 'Electronics', price: 85000, description: '인체공학적 디자인으로 손목의 피로를 줄여주는 무선 마우스입니다.', thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Minimal Desk Setup', type: 'Furniture', price: 450000, description: '업무 효율을 높여주는 미니멀한 디자인의 데스크 셋업 가구입니다.', thumbnail: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Developer Hoodie', type: 'Apparel', price: 59000, description: '장시간 코딩에도 편안함을 유지해주는 오버핏 기모 후드티입니다.', thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
  ]
});

// [검색 필터링 핵심 로직]
// computed 속성은 route.query.q 값이 바뀔 때마다 자동으로 재계산됩니다.
const filteredProducts = computed(() => {
  const query = route.query.q;

  // 검색어가 없으면 전체 목록 반환
  if (!query) {
    return state.products;
  }

  // 검색어가 있으면 이름이나 설명에 포함된 것만 반환 (대소문자 무시)
  const lowerQuery = query.toLowerCase();
  return state.products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
});

const formatPrice = (price) => price.toLocaleString();

const goToDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id } });
};

// 검색 초기화 버튼 기능
const clearSearch = () => {
  router.push({ path: '/products' }); // 쿼리 파라미터 제거
};
</script>

<style scoped>
/* 기존 카드 스타일 */
.product-card {
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
  border-radius: 1rem;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-img-top {
  height: 240px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-img-top {
  transform: scale(1.08);
}

.category-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  backdrop-filter: blur(4px);
}

.price-text {
  font-weight: 800;
  color: #0072ff;
  font-size: 1.1rem;
}
</style>