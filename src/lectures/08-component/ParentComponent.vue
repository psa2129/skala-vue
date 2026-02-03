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

// 흥부네 10남매 데이터 (상아님을 위한 맞춤 이름)
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

const totalMoney = ref(0);
const history = ref([]);

const handleMoney = (name, amount) => {
  totalMoney.value += amount;
  const log = `[${new Date().toLocaleTimeString()}] ${name}님이 ${amount.toLocaleString()}원을 효도했습니다!`;
  history.value.push(log);

  if (history.value.length > 5) history.value.shift();
};
</script>

<style>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fafafa;
}

.main-header {
  text-align: center;
  margin-bottom: 30px;
}

.total-board {
  background: #fbc02d;
  color: white;
  padding: 20px;
  border-radius: 15px;
  display: inline-block;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.history {
  margin-top: 30px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.history ul {
  list-style: none;
  padding: 0;
}

.history li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}
</style>