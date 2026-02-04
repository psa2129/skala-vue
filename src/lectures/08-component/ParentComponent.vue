<template>
  <div class="container">
    <header class="main-header">
      <h1>👨‍🌾 흥부네 집안 가계부</h1>
      <div class="total-board">
        <p>흥부가 자식들에게 받은 총 용돈</p>
        <h2>{{ totalMoney.toLocaleString() }} 원</h2>
      </div>
    </header>

    <main class="children-grid">
      <ChildComponent v-for="(child, index) in children" :key="index" :name="child.name" :assets="child.assets"
        @send-money="handleMoney" />
    </main>

    <footer class="history" v-if="history.length > 0">
      <h3>🔔 실시간 효도 내역 (최근 5건)</h3>
      <ul>
        <li v-for="(log, idx) in history.slice().reverse()" :key="idx">
          {{ log }}
        </li>
      </ul>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChildComponent from "./ChildComponent.vue";

// --- [데이터 정의] ---
// 흥부네 10남매의 이름과 물려받은 자산을 담은 반응형 배열
const children = ref([
  { name: "흥일 (장남)", assets: ["낡은 갓", "바느질 세트"] },
  { name: "흥이 (차남)", assets: ["물지게", "짚신 두 켤레"] },
  { name: "흥삼 (셋째)", assets: ["대나무 낚싯대"] },
  { name: "흥사 (넷째)", assets: ["무추수 밭 한 뙈기"] },
  { name: "흥오 (다섯째)", assets: ["조각보"] },
  { name: "흥육 (여섯째)", assets: ["나무 주걱"] },
  { name: "흥칠 (일곱째)", assets: ["박넝쿨 씨앗"] },
  { name: "흥팔 (여덟째)", assets: ["바둑이 (강아지)"] },
  { name: "흥구 (아홉째)", assets: ["새총", "조약돌"] },
  { name: "막순이 (막내)", assets: ["형님들의 사랑", "사탕"] }
]);

const totalMoney = ref(0); // 총 누적 금액
const history = ref([]);   // 효도 내역 로그 메시지를 담는 배열

/**
 * 자식 컴포넌트에서 emit("send-money", 이름, 금액)을 쏘면 실행되는 핸들러
 */
const handleMoney = (name, amount) => {
  // 1. 총액 합산
  totalMoney.value += amount;

  // 2. 로그 메시지 생성 (현재 시간 + 이름 + 금액)
  const log = `[${new Date().toLocaleTimeString()}] ${name}님이 ${amount.toLocaleString()}원을 효도했습니다!`;

  // 3. 내역 배열에 추가
  history.value.push(log);

  // 4. [데이터 최적화]: 내역이 5건을 넘어가면 가장 오래된 것(첫 번째 요소)을 삭제
  if (history.value.length > 5) history.value.shift();
};
</script>

<style>
/* ... (생략된 스타일 부분) ... */
.children-grid {
  display: grid;
  /* repeat(auto-fill): 화면 너비에 맞춰 가능한 만큼 칸을 채움 (반응형 그리드) */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ... (생략된 스타일 부분) ... */
</style>