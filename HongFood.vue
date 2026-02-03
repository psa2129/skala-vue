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

const INITIAL_FOODS = [
  "쌀", "보리", "콩", "감자", "양파",
  "마늘", "배추", "무", "고구마", "호박", "두쫀쿠"
];

const INITIAL_PEOPLE = [
  { name: "철수", received: [] },
  { name: "영희", received: [] },
  { name: "민수", received: [] }
];

const foods = ref([...INITIAL_FOODS]);
const people = ref(INITIAL_PEOPLE.map(p => ({ ...p, received: [] })));

// [상태 관리]
const selectedFoods = ref([]);
const selectedPeopleIndices = ref([]); // 다중 선택을 위해 배열로 변경

// [기능 1] 랜덤 배분 로직
const transferFoodRandomly = () => {
  // 예외 처리
  if (selectedPeopleIndices.value.length === 0) {
    alert("식량을 받을 사람을 최소 한 명 이상 선택해주세요.");
    return;
  }
  if (selectedFoods.value.length === 0) {
    alert("배분할 식량을 선택해주세요.");
    return;
  }

  // 1. 선택된 식량들을 하나씩 순회하며 랜덤 배분
  selectedFoods.value.forEach(foodItem => {
    // 선택된 사람들 인덱스 목록에서 랜덤하게 하나 뽑기
    const randomIndex = Math.floor(Math.random() * selectedPeopleIndices.value.length);
    const targetPersonIndex = selectedPeopleIndices.value[randomIndex];

    // 당첨된 사람에게 식량 추가
    people.value[targetPersonIndex].received.push(foodItem);
  });

  // 2. 창고에서 배분된 식량 제거
  foods.value = foods.value.filter(food => !selectedFoods.value.includes(food));

  // 3. 식량 선택 상태 초기화 (사람 선택은 유지)
  selectedFoods.value = [];
};

// [기능 2] 초기화 로직
const resetData = () => {
  if (!confirm("모든 분배 내역을 초기화하시겠습니까?")) return;

  foods.value = [...INITIAL_FOODS];
  people.value.forEach(person => { person.received = []; });

  selectedFoods.value = [];
  selectedPeopleIndices.value = []; // 사람 선택 목록도 초기화
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Malgun Gothic', sans-serif;
}

.column {
  flex: 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.list-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  background: #fff;
  border-radius: 4px;
  padding: 10px;
}

h2 {
  text-align: center;
  margin-top: 0;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.item label,
.person-header label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.2s;
}

.transfer-btn {
  background-color: #2196F3;
  /* 랜덤 배분 느낌의 파란색 */
  color: white;
}

.transfer-btn:hover {
  background-color: #1976D2;
}

.reset-btn {
  background-color: #f44336;
  color: white;
}

.reset-btn:hover {
  background-color: #d32f2f;
}

.person-card {
  background: white;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.person-header {
  margin-bottom: 8px;
  font-size: 18px;
}

.received-items {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  min-height: 30px;
  background-color: #f0f0f0;
  padding: 5px;
  border-radius: 4px;
}

.tag {
  background-color: #ffcc80;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
}

.placeholder {
  color: #999;
  font-size: 12px;
  align-self: center;
}

.empty-msg {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
</style>