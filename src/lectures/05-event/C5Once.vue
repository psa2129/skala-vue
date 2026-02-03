<template>
  <div>
    <p>메시지: {{ message }}</p>
    <button @click="updateMessage">업데이트</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = "이 메시지는 첫 번째 렌더링 후에는 변경되지 않습니다.";

const updateMessage = () => {
  message = "업데이트된 메시지.";
};
</script>
