<template>
  <button class="cell" :class="{ active: isActive }" :disabled="disabled" @click="onClick">
    <span class="emoji" v-if="isActive">🐹</span>

    <span class="emoji ghost" v-else>🕳️</span>
  </button>
</template>

<script setup>
// 부모(WhackBoard)로부터 전달받는 데이터들
const props = defineProps({
  index: Number,    // 이 셀의 고유 번호 (0, 1, 2...)
  isActive: Boolean, // 현재 이 셀에 두더지가 올라왔는지 여부
  disabled: Boolean, // 버튼 비활성화 여부 (게임 정지 등)
});

// 부모에게 보낼 이벤트 정의
const emit = defineEmits(["click-cell"]);

function onClick() {
  // [가장 중요한 부분]
  // 클릭된 순간, 자신이 몇 번째 칸(props.index)인지 부모에게 신호를 보냅니다.
  // 이 데이터가 Board를 거쳐 App까지 올라가야 "두더지를 잡았다!"라고 판정됩니다.
  emit("click-cell", props.index);
}
</script>

<style scoped>
.cell {
  width: 100%;
  aspect-ratio: 1 / 1;
  /* 가로세로 1:1 비율 유지 */
  border-radius: 18px;
  /* 둥근 모서리 디자인 */
  border: 1px solid #e6e6e6;
  background: #fafafa;
  cursor: pointer;
  /* clamp: 화면 크기에 따라 이모지 크기를 유동적으로 조절 (최소 24px ~ 최대 45px) */
  font-size: clamp(24px, 6vw, 45px);
  display: grid;
  place-items: center;
  /* 이모지를 중앙에 배치 */
  transition: all 0.1s;
  /* 애니메이션 효과 (부드러운 움직임) */
}

/* 마우스 올렸을 때 살짝 위로 뜨는 효과 (비활성 상태 제외) */
.cell:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: #ffd271;
}

/* 두더지가 활성화되었을 때의 스타일 (노란색 톤) */
.active {
  background: #fff6dd;
  border-color: #ffd271;
  box-shadow: 0 4px 15px rgba(255, 210, 113, 0.3);
  /* 은은한 빛 효과 */
}

.emoji {
  /* 이모지에 그림자를 주어 입체감 표현 */
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  user-select: none;
  /* 텍스트 선택(드래그) 방지 */
}

/* 빈 구멍 상태의 스타일 */
.ghost {
  opacity: 0.3;
  /* 흐릿하게 표시 */
  pointer-events: none;
  /* 이모지 자체가 클릭을 방해하지 않도록 설정 */
}
</style>