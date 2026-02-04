<template>
  <div class="container mt-5" style="max-width: 500px">
    <h3 class="mb-4 text-center">회원 정보 입력</h3>

    <div class="card p-3 mb-4 bg-light shadow-sm">
      <div class="d-flex gap-3 align-items-center">
        <div class="flex-grow-1">
          <label class="small fw-bold">Size 조절</label>
          <select v-model="userSize" class="form-select form-select-sm">
            <option value="sm">작게 (Small)</option>
            <option value="">기본 (Normal)</option>
            <option value="lg">크게 (Large)</option>
          </select>
        </div>
        <div class="form-check form-switch pt-4">
          <input v-model="userReadOnly" class="form-check-input" type="checkbox" id="ro">
          <label class="form-check-label small fw-bold" for="ro">읽기 전용</label>
        </div>
      </div>
    </div>

    <CommonInput ref="emailRef" v-model="formData.email" label="이메일" :size="userSize" :readonly="userReadOnly"
      placeholder="example@email.com" @enter-submit="handleRegister" />

    <CommonInput ref="nameRef" v-model="formData.name" label="이름" :size="userSize" :readonly="userReadOnly"
      placeholder="이름을 입력하세요" @enter-submit="handleRegister" />

    <CommonInput ref="pwRef" v-model="formData.password" label="비밀번호" type="password" :size="userSize"
      :readonly="userReadOnly" placeholder="비밀번호를 입력하세요" @enter-submit="handleRegister" />

    <button class="btn btn-primary w-100 mt-3" @click="handleRegister" :disabled="userReadOnly">
      가입하기
    </button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import CommonInput from './CommonInput.vue';

const userSize = ref('');
const userReadOnly = ref(false);

const formData = reactive({ email: '', name: '', password: '' });

const emailRef = ref(null);
const nameRef = ref(null);
const pwRef = ref(null);

// 이메일 형식 체크 함수
const isValidEmail = (email) => {
  const regExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regExp.test(email);
};

const handleRegister = () => {
  if (userReadOnly.value) return;

  // 1. 이메일 검사 (미입력 + 형식 체크)
  if (!formData.email.trim()) {
    alert('이메일을 입력해주세요!');
    emailRef.value.focusInput();
    return;
  }
  if (!isValidEmail(formData.email)) {
    alert('올바른 이메일 형식이 아닙니다! (@ 포함 확인)');
    emailRef.value.focusInput();
    return;
  }

  // 2. 이름 검사
  if (!formData.name.trim()) {
    alert('이름을 입력해주세요!');
    nameRef.value.focusInput();
    return;
  }

  // 3. 비밀번호 검사 (
  if (!formData.password.trim()) {
    alert('비밀번호를 입력해주세요!');
    pwRef.value.focusInput();
    return;
  }

  alert(`${formData.name}님, 성공적으로 가입되었습니다!`);
};
</script>