<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 rounded-4 login-card">
      <h3 class="text-center mb-4 fw-bold text-primary-gradient">LOGIN</h3>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="emailInput" class="form-label text-muted small fw-bold">이메일</label>
          <input type="email" class="form-control bg-light border-0 py-2" id="emailInput" v-model="state.form.email"
            placeholder="name@example.com">
        </div>

        <div class="mb-4">
          <label for="passwordInput" class="form-label text-muted small fw-bold">패스워드</label>
          <input type="password" class="form-control bg-light border-0 py-2" id="passwordInput"
            v-model="state.form.password" placeholder="Password" @keyup.enter="login">
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-gradient-primary btn-lg rounded-pill shadow-sm">
            <i class="bi bi-box-arrow-in-right me-2"></i>로그인
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const state = reactive({ form: { email: '', password: '' } });

const login = () => {
  if (!state.form.email || !state.form.password) {
    alert('이메일과 비밀번호를 입력해주세요.');
    return;
  }
  alert('로그인이 완료되었습니다.');
  router.push('/products');
};
</script>

<style scoped>
/* 로그인 카드: 테두리 없애고 부드러운 그림자 */
.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border: none;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
}

/* 타이틀 색상 */
.text-primary-gradient {
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 그라데이션 버튼 */
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
  color: white;
}
</style>