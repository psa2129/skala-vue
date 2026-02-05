<template>
  <div class="d-flex flex-column min-vh-100">

    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
      <div class="container">
        <router-link class="navbar-brand fw-bold d-flex align-items-center me-4" to="/products">
          <i class="bi bi-bag-heart-fill me-2 text-white"></i>
          <span>Vue Shop</span>
        </router-link>

        <form class="d-none d-md-flex mx-auto position-relative" style="width: 40%;" @submit.prevent="onSearch">
          <div class="input-group">
            <input v-model="searchQuery" class="form-control border-0 rounded-start-pill ps-4" type="search"
              placeholder="찾고 싶은 상품을 검색해보세요" aria-label="Search" style="background: rgba(255, 255, 255, 0.9);">
            <button class="btn btn-light border-0 rounded-end-pill px-3" type="submit"
              style="background: rgba(255, 255, 255, 0.9);">
              <i class="bi bi-search text-primary"></i>
            </button>
          </div>
        </form>

        <div class="d-flex align-items-center ms-auto">
          <router-link class="btn text-white position-relative me-2 border-0" to="/cart">
            <i class="bi bi-cart4 fs-4"></i>
            <span
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
              style="font-size: 0.6rem;">!</span>
          </router-link>

          <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div class="offcanvas offcanvas-end offcanvas-custom" tabindex="-1" id="offcanvasNavbar">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title fw-bold text-white">Menu</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
          </div>
          <div class="offcanvas-body">
            <form class="d-md-none mb-4" @submit.prevent="onSearch">
              <div class="input-group">
                <input v-model="searchQuery" class="form-control" placeholder="상품 검색">
                <button class="btn btn-light"><i class="bi bi-search"></i></button>
              </div>
            </form>
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item mb-2"><router-link class="nav-link fs-5" to="/login">로그인</router-link></li>
              <li class="nav-item"><router-link class="nav-link fs-5" to="/products">제품 목록</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <div class="container flex-grow-1" style="margin-top: 100px; margin-bottom: 60px;">
      <router-view />
    </div>

    <footer class="footer-custom text-white pt-5 pb-4">
      <div class="container text-center">
        <p class="small text-white-50">Copyright © 2024 Vue Shop.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const onSearch = () => {
  // 입력된 검색어를 쿼리 스트링으로 보내며 페이지 이동
  // 예: /products?q=키보드
  router.push({
    path: '/products',
    query: { q: searchQuery.value }
  });
};
</script>

<style>
/* 기존 스타일 유지 */
body {
  background-color: #f8f9fa !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.navbar-custom {
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  box-shadow: 0 4px 15px rgba(0, 114, 255, 0.2);
}

.offcanvas-custom {
  background: linear-gradient(135deg, #005bb7, #003f7f);
  color: white;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.router-link-active {
  color: #fff !important;
  font-weight: 800;
  opacity: 1;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.footer-custom {
  background-color: #1a1e21;
  font-size: 0.9rem;
}

::placeholder {
  color: #aaa;
  opacity: 1;
}
</style>