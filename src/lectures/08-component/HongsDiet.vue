<template>
  <div class="app-container">
    <div class="diet-card">
      <header class="card-header">
        <h2>🏃‍♂️ 다이어트 챌린지</h2>
      </header>

      <section class="input-section">
        <div class="input-box">
          <label>이름</label>
          <input type="text" v-model="userName" placeholder="이름을 입력하세요">
        </div>
        <div class="input-row">
          <div class="input-box">
            <label>체중 (kg)</label>
            <input type="number" v-model.number="weight">
          </div>
          <div class="input-box">
            <label>키 (cm)</label>
            <input type="number" v-model.number="height">
          </div>
        </div>
      </section>

      <section class="result-section">
        <div class="info-main">
          <h3><span class="name-tag">{{ userName || '사용자' }}</span>님의 상태</h3>
          <div class="bmi-display">
            <span class="bmi-value">{{ bmi }}</span>
            <span :class="['bmi-status', statusColor]">{{ bmiStatus }}</span>
          </div>
        </div>
      </section>

      <HongsDietHabit @updateWeight="handleWeightChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HongsDietHabit from './HongsDietHabit.vue';

const userName = ref('홍길동');
const weight = ref(60);
const height = ref(170);

const bmi = computed(() => {
  if (!height.value || !weight.value) return '0.0';
  const h = height.value / 100;
  return (weight.value / (h * h)).toFixed(1);
});

const bmiStatus = computed(() => {
  const val = parseFloat(bmi.value);
  if (val <= 0) return '데이터 없음';
  if (val < 18.5) return '저체중';
  if (val < 23) return '정상';
  if (val < 25) return '과체중';
  return '비만';
});

const statusColor = computed(() => {
  const val = parseFloat(bmi.value);
  if (val < 18.5) return 'blue';
  if (val < 23) return 'green';
  return 'red';
});

const handleWeightChange = (amount) => {
  weight.value += amount;
};
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  padding: 40px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.diet-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  padding: 20px;
  text-align: center;
}

.input-section {
  padding: 20px;
  background: #fafafa;
}

.input-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.input-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-box label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}

input:focus {
  border-color: #6e8efb;
}

.result-section {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.name-tag {
  color: #6e8efb;
  font-weight: bold;
}

.bmi-display {
  margin-top: 10px;
}

.bmi-value {
  font-size: 40px;
  font-weight: 800;
  margin-right: 10px;
}

.bmi-status {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
}

.blue {
  background: #3498db;
}

.green {
  background: #2ecc71;
}

.red {
  background: #e74c3c;
}
</style>