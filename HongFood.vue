<template>
  <div class="container">
    <div class="column left-panel">
      <h2>식량 창고 (Foods)</h2>
      <div class="list-container">
        <p v-if="foods.length === 0" class="empty-msg">식량이 모두 소진되었습니다.</p>

        <div v-for="food in foods" :key="food" class="item">
          <label>
            <input type="checkbox" :value="food" v-model="selectedFoods">
            {{ food }}
          </label>
        </div>
      </div>

      <div class="button-group">
        <button @click="transferFoodRandomly" class="btn transfer-btn">
          선택한 식량 랜덤 배분하기 ▶
        </button>
        <button @click="resetData" class="btn reset-btn">
          ↺ 처음 상태로 복구
        </button>
      </div>
    </div>

    <div class="column right-panel">
      <h2>사람들 (Poors)</h2>
      <div class="list-container">
        <div v-for="(person, index) in people" :key="person.name" class="person-card">
          <div class="person-header">
            <label>
              <input type="checkbox" :value="index" v-model="selectedPeopleIndices">
              <strong>{{ person.name }}</strong>
            </label>
          </div>

          <div class="received-items">
            <span v-if="person.received.length === 0" class="placeholder">받은 식량 없음</span>
            <span v-else v-for="(item, i) in person.received" :key="i" class="tag">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- [초기 상수 정의] ---
const INITIAL_FOODS = ["쌀", "보리", "콩", "감자", "양파", "마늘", "배추", "무", "고구마", "호박", "두쫀쿠"];
const INITIAL_PEOPLE = [
  { name: "철수", received: [] },
  { name: "영희", received: [] },
  { name: "민수", received: [] }
];

// --- [반응형 상태 관리] ---
const foods = ref([...INITIAL_FOODS]); // 현재 창고에 남은 식량 목록
const people = ref(INITIAL_PEOPLE.map(p => ({ ...p, received: [] }))); // 사람들 데이터

const selectedFoods = ref([]);         // 체크된 식량들 (창고에서 나갈 후보)
const selectedPeopleIndices = ref([]); // 체크된 사람들 (식량을 받을 후보)

/**
 * [기능 1] 랜덤 배분 로직
 */
const transferFoodRandomly = () => {
  // 방어 코드: 선택된 항목이 없으면 중단
  if (selectedPeopleIndices.value.length === 0) {
    alert("식량을 받을 사람을 최소 한 명 이상 선택해주세요.");
    return;
  }
  if (selectedFoods.value.length === 0) {
    alert("배분할 식량을 선택해주세요.");
    return;
  }

  // 1. 선택된 식량들을 하나씩 랜덤하게 배정
  selectedFoods.value.forEach(foodItem => {
    // '선택된 사람들' 중에서 무작위 인덱스 하나 추출
    const randomIndex = Math.floor(Math.random() * selectedPeopleIndices.value.length);
    const targetPersonIndex = selectedPeopleIndices.value[randomIndex];

    // 당첨된 사람의 received 배열에 해당 식량 추가
    people.value[targetPersonIndex].received.push(foodItem);
  });

  // 2. 창고 업데이트: 배분된 식량은 원본 창고(foods)에서 제거 (불변성 유지하며 필터링)
  foods.value = foods.value.filter(food => !selectedFoods.value.includes(food));

  // 3. 작업 완료 후 식량 선택 목록만 초기화
  selectedFoods.value = [];
};

/**
 * [기능 2] 초기화 로직
 */
const resetData = () => {
  if (!confirm("모든 분배 내역을 초기화하시겠습니까?")) return;

  // 원본 상수를 복사하여 초기 상태로 복구
  foods.value = [...INITIAL_FOODS];
  people.value.forEach(person => { person.received = []; });

  // 선택 상태 모두 비우기
  selectedFoods.value = [];
  selectedPeopleIndices.value = [];
};
</script>

<style scoped>
/* flex: 1 및 height: 500px 설정을 통해 
   창고와 사람 목록의 높이를 맞추고 내부 스크롤을 구현 
*/
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.list-container {
  flex: 1;
  overflow-y: auto;
}

/* 내용이 많아지면 내부에서만 스크롤 발생 */

/* 시각적 요소를 위한 스타일 (태그, 카드, 버튼 등) */
.tag {
  background-color: #ffcc80;
  border-radius: 12px;
}

/* 받은 식량 배지 스타일 */
.transfer-btn {
  background-color: #2196F3;
  color: white;
}

/* 활기찬 느낌의 파란색 배분 버튼 */
</style>