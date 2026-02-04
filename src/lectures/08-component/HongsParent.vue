<template>
  <div class="parent">
    <h2>홍판서네 자식들</h2>

    <section class="children">
      <HongsChild name="홍길동" :assets="assets.forSon" @money="takeMoney" />
      <HongsChild name="홍길순" :assets="assets.forDaughter" @money="takeMoney" />
    </section>

    <section class="result">
      <h3>자녀가 보내준 용돈 합계 : {{ totalAllowance.toLocaleString() }}원</h3>
      <h4>받은 내역</h4>
      <ul>
        <li v-for="(item, idx) in logs" :key="idx">
          {{ item.from }} → {{ item.amount.toLocaleString() }}원
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import HongsChild from "./HongsChild.vue"; // 자식 컴포넌트 불러오기

// --- [정적 데이터 정의] ---
// 자식들에게 물려줄 고정된 자산 데이터
const assets = {
  forSon: ["칼", "창"],
  forDaughter: ["기와집", "전답"],
};

// --- [반응형 상태 관리] ---
// logs: 용돈 수령 내역을 저장하는 배열 (Ref로 선언하여 변경 시 화면 갱신)
const logs = ref([]); // 객체 형태: { from: string, amount: number }

/**
 * 자식 컴포넌트가 emit("money", 이름, 금액)을 호출하면 실행되는 함수
 * @param {string} from - 자식 이름
 * @param {number} amount - 용돈 금액
 */
function takeMoney(from, amount) {
  // 새로운 내역을 배열에 추가 (내역이 추가되면 화면의 v-for가 자동 업데이트됨)
  logs.value.push({ from, amount });
}

/**
 * [Computed 가공 데이터]
 * logs 배열이 바뀔 때마다 자동으로 합계를 재계산함
 * reduce 함수: 배열의 모든 요소를 순회하며 하나의 결과값(합계)을 만듦
 */
const totalAllowance = computed(() =>
  logs.value.reduce((sum, x) => sum + x.amount, 0)
);
</script>

<style scoped>
.parent {
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  max-width: 720px;
  margin: 0 auto;
  /* 중앙 정렬 */
}

.children,
.result {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
}

/* 자식들 사이의 간격 조정 (CSS 인접 형제 선택자 활용) */
.children>*+* {
  margin-top: 12px;
}
</style>