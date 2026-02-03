<template>
  <div class="habit-area">
    <div class="habit-group food">
      <h4>🍔 음식 먹기</h4>
      <div class="btn-row">
        <button @click="$emit('updateWeight', 1)">
          햄버거 <span>+1kg</span>
        </button>
        <button @click="$emit('updateWeight', 2)">
          피자 <span>+2kg</span>
        </button>
      </div>
    </div>

    <div class="habit-group exercise">
      <h4>🏃 기술 연습</h4>
      <div class="btn-row">
        <button @click="$emit('updateWeight', -1)">
          걷기 <span>-1kg</span>
        </button>
        <button @click="$emit('updateWeight', -2)">
          달리기 <span>-2kg</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['updateWeight']);
</script>

<style scoped>
.habit-area {
  padding: 20px;
}

h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #444;
  font-weight: 600;
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  flex: 1;
  padding: 12px 8px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

button:hover {
  filter: brightness(0.95);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
  box-shadow: none;
}

/* 단위(kg) 스타일 */
button span {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.9;
}

/* 버튼 색상 커스텀 */
.food button {
  background-color: #fff4e6;
  color: #d9480f;
}

.exercise button {
  background-color: #e3fafc;
  color: #0b7285;
}
</style>