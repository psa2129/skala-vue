<template>
  <div class="child">
    <p><b>자식 이름:</b> {{ props.name ? props.name : '나는 누구인가?' }}</p>

    <div class="inherit">
      <p><b>부모에게 받은 자산(props)</b></p>
      <ol>
        <li v-for="(value, index) in props.assets" :key="index">
          {{ value }}
        </li>
      </ol>
    </div>

    <div class="allowance">
      <label style="font-weight: bold;">
        부모님께 드릴 용돈(원):
        <input type="number" min="0" step="10000" v-model.number="amount" placeholder="예: 50000" />
      </label>

      <button @click="sendMoney" :disabled="props.assets === undefined || props.assets.length === 0">
        용돈 보내기(emit)
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// --- [Props 정의: 부모가 주는 데이터] ---
const props = defineProps({
  name: String,   // 부모가 정해준 내 이름
  assets: Array,  // 부모가 물려준 자산 리스트
});

// --- [Emits 정의: 부모에게 보내는 신호] ---
const emit = defineEmits(["money"]); // 'money'라는 이름의 이벤트를 부모에게 보낼 것을 선언

const amount = ref(0); // 사용자가 입력한 용돈 금액을 담는 반응형 변수

function sendMoney() {
  // 부모에게 'money' 이벤트를 발생시키며, 데이터(자식 이름, 용돈 금액)를 함께 실어 보냄
  emit("money", props.name, amount.value);

  // 용돈을 보낸 후 입력 칸을 0으로 초기화
  amount.value = 0;
}
</script>

<style scoped>
.child {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  /* 배경색을 연한 회색으로 주어 부모 영역과 구분 */
}

.allowance {
  margin-top: 4px;
  display: flex;
  gap: 4px;
  align-items: center;
  /* 세로 중앙 정렬 */
  flex-wrap: wrap;
  /* 화면이 좁아지면 아래로 떨어지게 설정 */
}

input {
  margin-left: 4px;
  padding: 4px;
  width: 180px;
}

button {
  padding: 4px;
  cursor: pointer;
}
</style>