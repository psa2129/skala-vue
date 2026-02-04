<template>
  <main class="app">
    <header class="header">
      <h1>🐹 두더지 팡팡 🐹</h1>
    </header>

    <section class="game-panel">
      <div class="top-row">
        <div class="stats">
          <div class="stat-item">점수: <span>{{ score }}</span></div>
          <div class="stat-item" :class="{ warning: timeLeft <= 5 }">시간: <span>{{ timeLeft }}s</span></div>
          <div class="stat-item">속도: <span>{{ moveInterval }}ms</span></div>
        </div>

        <div class="actions">
          <button class="btn primary" :disabled="phase === 'playing'" @click="onStart">시작</button>
          <button class="btn" :disabled="phase !== 'playing'" @click="onStop">일시정지</button>
          <button class="btn danger" @click="onReset">리셋</button>
        </div>
      </div>

      <div class="settings-row">
        <div class="field">
          <span>보드:</span>
          <select v-model.number="gridSize" :disabled="phase === 'playing'">
            <option :value="3">3x3</option>
            <option :value="4">4x4</option>
          </select>
        </div>
        <div class="field">
          <span>모드 선택:</span>
          <select v-model.number="moleCount" :disabled="phase === 'playing'">
            <option :value="1">1마리 (Basic)</option>
            <option :value="2">2마리 (Hard)</option>
          </select>
        </div>
        <div class="field">
          <span>초기속도:</span>
          <input v-model.number="initialInterval" type="number" step="100" :disabled="phase === 'playing'">
        </div>
      </div>
    </section>

    <section class="board-container">
      <WhackBoard :grid-size="gridSize" :active-indices="activeIndices" :phase="phase" @hit="onHit" />
    </section>
  </main>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import WhackBoard from "./WhackBoard.vue";

// --- [게임 상태 관리 변수] ---
const phase = ref("idle");          // 게임 상태 (idle, playing, paused, ended)
const score = ref(0);              // 현재 점수
const gridSize = ref(3);           // 보드 크기 (3x3 등)
const moleCount = ref(1);          // 두더지 마리 수 선택
const duration = ref(20);          // 기본 게임 시간
const timeLeft = ref(duration.value); // 남은 시간
const initialInterval = ref(800);  // 초기 속도
const moveInterval = ref(initialInterval.value); // 현재 속도

// --- [두더지 제어용 변수] ---
const activeIndices = ref([-1, -1]);    // 두더지 위치 (슬롯 0, 1)
const moveTimerIds = ref([null, null]); // 각 두더지용 이동 타이머
const staggerTimeoutId = ref(null);     // 2마리 모드 엇박자용 타이머
const countdownTimerId = ref(null);     // 시간 카운트다운 타이머

// 두더지 위치 랜덤 이동 함수
function moveMole(slot) {
  const total = gridSize.value * gridSize.value;
  let next;
  do {
    next = Math.floor(Math.random() * total);
  } while (activeIndices.value.includes(next)); // 중복 위치 방지

  activeIndices.value[slot] = next;
}

// 각 슬롯별 타이머 시작 함수
function startTimerForSlot(slot) {
  if (moveTimerIds.value[slot]) clearInterval(moveTimerIds.value[slot]);
  moveTimerIds.value[slot] = setInterval(() => moveMole(slot), moveInterval.value);
}

// 모든 타이머 중지 함수
function stopAll() {
  moveTimerIds.value.forEach((id, idx) => {
    if (id) clearInterval(id);
    moveTimerIds.value[idx] = null;
  });
  if (staggerTimeoutId.value) clearTimeout(staggerTimeoutId.value);
  if (countdownTimerId.value) clearInterval(countdownTimerId.value);
}

// 시작 버튼 로직
function onStart() {
  if (phase.value === 'idle' || phase.value === 'ended') {
    score.value = 0;
    timeLeft.value = duration.value;
    moveInterval.value = initialInterval.value;
    activeIndices.value = [-1, -1];
  }
  phase.value = 'playing';

  // 1번 두더지 가동
  moveMole(0);
  startTimerForSlot(0);

  // 2마리 모드 시 엇박자 출현 설정
  if (moleCount.value === 2) {
    staggerTimeoutId.value = setTimeout(() => {
      moveMole(1);
      startTimerForSlot(1);
    }, moveInterval.value / 2);
  }

  // 시간 감소 타이머 가동
  countdownTimerId.value = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
  }, 1000);
}

// 일시정지 및 리셋 로직
function onStop() { phase.value = 'paused'; stopAll(); countdownTimerId.value = null; }
function onReset() {
  phase.value = 'idle';
  stopAll();
  score.value = 0;
  timeLeft.value = duration.value;
  activeIndices.value = [-1, -1];
  moveInterval.value = initialInterval.value;
}

// 두더지 타격(hit) 처리 로직
function onHit(payload) {
  if (phase.value !== 'playing') return;

  const slot = activeIndices.value.indexOf(payload.index);
  if (slot !== -1) {
    score.value += 10; // 점수 획득

    // 난이도 상승 (잡을수록 빨라짐)
    if (moveInterval.value > 250) {
      moveInterval.value = Math.max(250, Math.floor(moveInterval.value * 0.95));
    }

    moveMole(slot);
    startTimerForSlot(slot);
  }
}

// 시간 종료 감시
watch(timeLeft, (v) => {
  if (v <= 0 && phase.value === 'playing') {
    phase.value = 'ended';
    stopAll();
    activeIndices.value = [-1, -1];
    alert(`게임 종료! 최종 점수: ${score.value}점`);
  }
});

// 컴포넌트 종료 시 타이머 제거
onBeforeUnmount(stopAll);
</script>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
  font-family: sans-serif;
}

.header h1 {
  font-size: 2.5rem;
  text-align: center;
  margin: 5px 0 10px;
  color: #333;
}

.game-panel {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 15px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stats {
  display: flex;
  gap: 15px;
  font-weight: bold;
}

.stats span {
  color: #1f7ae0;
}

.warning span {
  color: #e03131;
  animation: blink 0.5s infinite;
}

.actions {
  display: flex;
  gap: 5px;
}

.btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
}

.primary {
  background: #1f7ae0;
  color: #fff;
  border: none;
}

.danger {
  background: #ffecec;
  color: #b40000;
  border-color: #e04b4b;
}

.settings-row {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 10px;
  flex-wrap: wrap;
}

.field {
  display: flex;
  align-items: center;
  gap: 5px;
}

select,
input {
  padding: 3px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 90px;
}

.board-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

@keyframes blink {
  50% {
    opacity: 0.4;
  }
}
</style>