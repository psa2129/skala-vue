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
/**
 * 부모에게 보낼 이벤트 이름을 정의합니다.
 * 이 선언을 통해 컴포넌트가 어떤 신호를 밖으로 쏘아 올리는지 명확히 알 수 있습니다.
 */
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

/* 버튼 공통 스타일: 카드 형태와 그림자 적용 */
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
  /* 글자와 kg 수치를 세로로 배치 */
  align-items: center;
  gap: 2px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* 마우스 올렸을 때 살짝 뜨는 효과로 타격감 제공 */
button:hover {
  filter: brightness(0.95);
  transform: translateY(-2px);
}

/* 클릭 시 쏙 들어가는 효과 */
button:active {
  transform: translateY(0);
  box-shadow: none;
}

/* 내부 kg 수치 폰트 설정 */
button span {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.9;
}

/* [테마 색상]: 음식은 오렌지 톤, 운동은 민트 톤으로 시각적 구분 */
.food button {
  background-color: #fff4e6;
  color: #d9480f;
}

.exercise button {
  background-color: #e3fafc;
  color: #0b7285;
}
</style>