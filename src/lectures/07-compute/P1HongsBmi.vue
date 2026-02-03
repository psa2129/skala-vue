<template>
  <div class="bmi-container">
    <h2>홍길동의 BMI 계산기</h2>

    <section class="bmi-section">
      <div class="control-group">
        <p>
          <label>키 (cm): </label>
          <input v-model.number="heightCm" type="number" placeholder="키를 입력하세요" />
        </p>
        <p>
          <label>체중 (kg): </label>
          <input v-model.number="weightKg" type="number" placeholder="체중을 입력하세요" />
        </p>
        <p class="info" v-if="bmi > 0">BMI 지수: {{ bmi }}</p>
        <p class="info" v-if="judgment">판정: {{ judgment }}</p>
      </div>

      <div class="explanation">
        <h3>💡 설명</h3>
        <ul>
          <li>키와 체중을 입력받아 BMI 지수를 계산합니다.</li>
          <li>BMI = 체중(kg) / (키(m) * 키(m))</li>
          <li>계산된 BMI 값이 23.0(과체중) 이상이면 "다이어트 하세요"를 추가합니다.</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const heightCm = ref(0)
const weightKg = ref(0)
const judgment = ref('')

// 1. computed를 이용한 BMI 계산
// 공식: kg / (m * m) -> cm를 m로 변환하기 위해 100으로 나눔
const bmi = computed(() => {
  if (heightCm.value > 0 && weightKg.value > 0) {
    const heightM = heightCm.value / 100
    const result = weightKg.value / (heightM * heightM)
    return parseFloat(result.toFixed(2)) // 소수점 2자리까지
  }
  return 0
})

// 2. watch를 이용한 판정 및 경고 메시지 감시
watch(bmi, (newBmi) => {
  let status = ''

  if (newBmi === 0) {
    status = ''
  } else if (newBmi < 18.5) {
    status = '저체중'
  } else if (newBmi < 23.0) {
    status = '정상'
  } else if (newBmi < 25.0) {
    status = '과체중'
  } else {
    status = '비만'
  }

  // 과체중(23.0) 이상일 경우 메시지 추가
  if (newBmi >= 23.0) {
    status += ' (다이어트 하세요)'
  }

  judgment.value = status
})
</script>

<style scoped>
.bmi-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.control-group {
  margin-bottom: 12px;
}

.info {
  margin-top: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.explanation {
  margin-top: 20px;
  padding: 12px;
  border: 1px dashed #aaa;
  border-radius: 4px;
  background-color: #fff;
}

input {
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>