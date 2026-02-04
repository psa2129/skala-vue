<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-4">CommonRadio를 이용해 성별, 학교를 선택할 수 있는 화면 만들기</h3>

    <div class="card p-3 mb-4 d-flex flex-row justify-content-between align-items-center shadow-sm">
      <div class="d-flex align-items-center gap-3">
        <span class="fw-bold">화면 크기:</span>
        <div class="btn-group">
          <button v-for="s in sizes" :key="s.val" @click="currentSize = s.val"
            :class="['btn', currentSize === s.val ? 'btn-primary' : 'btn-outline-secondary']">
            {{ s.label }}
          </button>
        </div>
      </div>
      <div class="form-check form-switch">
        <label class="form-check-label fw-bold me-2" for="readonlySwitch">읽기 전용</label>
        <input class="form-check-input" type="checkbox" v-model="isReadOnly" id="readonlySwitch">
      </div>
    </div>

    <div class="card p-4 mb-3 shadow-sm">
      <h4 class="fw-bold border-bottom pb-2 mb-3">성별</h4>
      <CommonRadio v-model="gender" :options="genderOptions" name="gender-group" :size="currentSize"
        :disabled="isReadOnly" />
    </div>

    <div class="card p-4 mb-4 shadow-sm">
      <h4 class="fw-bold border-bottom pb-2 mb-3">학력</h4>
      <CommonRadio v-model="school" :options="schoolOptions" name="school-group" :size="currentSize"
        :disabled="isReadOnly" />
    </div>

    <div class="card p-4 bg-light border-primary shadow-sm">
      <h4 class="fw-bold mb-2">선택된 결과</h4>
      <p class="mb-0 fw-bold text-dark">
        성별: {{ gender }} / 학력: {{ school }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CommonRadio from './CommonRadio.vue';

const currentSize = ref('md');
const isReadOnly = ref(false);

const sizes = [
  { label: 'small', val: 'sm' },
  { label: 'medium', val: 'md' },
  { label: 'large', val: 'lg' }
];

const gender = ref('m');
const school = ref('01');

const genderOptions = ref([
  { label: "남", value: "m" },
  { label: "여", value: "f" },
]);

const schoolOptions = ref([
  { label: "초등학교", value: "01" },
  { label: "중학교", value: "02" },
  { label: "고등학교", value: "03" },
  { label: "대학교", value: "04" },
]);

// 라벨 표시용 computed
const genderLabel = computed(() => genderOptions.value.find(o => o.value === gender.value)?.label);
const schoolLabel = computed(() => schoolOptions.value.find(o => o.value === school.value)?.label);
</script>

<style>
body {
  background-color: #fff;
}

.card {
  border-radius: 12px;
}

.btn-group .btn {
  padding: 5px 20px;
  font-weight: bold;
}
</style>