<template>
  <h1>Input 및 Key 이벤트 처리</h1>

  <input @input="handleInput($event, '값입력')" placeholder="값을 입력하세요" />
  <input @keydown="handleKeyDown" placeholder="키를 눌러보세요" />

  <div>
    입력 정보 : {{ eventInput }}
  </div>
  <div>
    키 정보 : {{ eventKey }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const eventInput = ref('')
const eventKey = ref('')

function handleInput(event, message) {
  eventInput.value = `event.target.value: ${event.target.value} ${message}`
}

function handleKeyDown(event) {
  eventKey.value = `event.key: ${event.key}, event.code: ${event.code} `
}

</script>

<style scoped>
input {
  margin: 4px;
  padding: 8px 16px;
  font-size: 16px;
}

div {
  margin: 4px;
  font-size: 16px;
}
</style>