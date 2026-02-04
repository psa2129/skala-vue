<template>
  <section class="board">
    <div class="grid" :style="gridStyle">
      <MoleCell v-for="i in gridSize * gridSize" :key="i" :index="i - 1" :is-active="activeIndices.includes(i - 1)"
        :disabled="phase !== 'playing'" @click-cell="handleClickCell" />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import MoleCell from "./MoleCell.vue";

// 부모(MoleApp)로부터 내려받는 데이터들
const props = defineProps([
  "gridSize",      // 보드 가로/세로 칸 수 (3 또는 4)
  "activeIndices",  // 현재 두더지가 있는 위치 번호들 (배열 형태)
  "phase"           // 게임의 현재 상태 (playing, idle 등)
]);

// 부모에게 신호를 보낼 이벤트 정의
const emit = defineEmits(["hit"]);

// [그리드 레이아웃 계산]
// 보드 크기가 바뀔 때마다(gridSize) CSS 스타일을 실시간으로 계산
const gridStyle = computed(() => ({
  display: 'grid',
  // gridSize가 3이면 'repeat(3, 1fr)', 즉 3열로 배치
  gridTemplateColumns: `repeat(${props.gridSize}, 1fr)`,
  gap: '12px',         // 셀 사이 간격
  width: '100%',
  maxWidth: '550px',   // 보드 최대 크기 제한
  aspectRatio: '1 / 1' // 가로 세로 1:1 비율 유지 (정사각형 보드)
}));

// 자식(MoleCell)이 클릭되었을 때 실행되는 함수
function handleClickCell(index) {
  // MoleCell에서 올라온 index(칸 번호)를 객체에 담아 부모(MoleApp)로 다시 쏘아 올림
  // 부모는 이 index가 두더지 위치인지 확인하고 점수를 올림
  emit("hit", { index });
}
</script>

<style scoped>
.board {
  background: #f1f3f5;
  padding: 20px;
  border-radius: 20px;
  width: 100%;
  /* 안쪽으로 들어간 듯한 그림자 효과로 보드 느낌 강조 */
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.grid {
  margin: 0 auto;
  /* 보드를 화면 중앙에 배치 */
}
</style>