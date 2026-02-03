<template>
  <div class="child-card">
    <div class="header">
      <span class="name-tag">{{ name }}</span>
    </div>

    <div class="content">
      <p class="section-title">📦 물려받은 자산</p>
      <ul class="asset-list">
        <li v-for="(item, index) in assets" :key="index">
          {{ item }}
        </li>
      </ul>

      <div class="action-area">
        <p class="section-title">💰 효도하기</p>
        <div class="input-group">
          <input type="number" v-model.number="amount" placeholder="금액 입력" min="0" step="1000" />
          <button @click="sendMoney" :disabled="amount <= 0">
            보내기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  name: String,
  assets: Array,
});

const emit = defineEmits(["send-money"]);
const amount = ref(0);

function sendMoney() {
  if (amount.value > 0) {
    emit("send-money", props.name, amount.value);
    amount.value = 0; // 보낸 후 입력 필드 초기화
  }
}
</script>

<style scoped>
.child-card {
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  background-color: #fff;
  overflow: hidden;
  transition: transform 0.2s;
  margin-bottom: 10px;
}

.child-card:hover {
  transform: translateY(-5px);
  border-color: #ffd54f;
}

.header {
  background-color: #fbc02d;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.content {
  padding: 15px;
}

.section-title {
  font-size: 0.85rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 5px;
}

.asset-list {
  list-style: none;
  padding: 0;
  margin-bottom: 15px;
  min-height: 50px;
}

.asset-list li {
  display: inline-block;
  background: #f1f1f1;
  padding: 2px 8px;
  border-radius: 4px;
  margin: 2px;
  font-size: 0.9rem;
}

.input-group {
  display: flex;
  gap: 5px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0 12px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>