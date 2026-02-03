<template>
  <div>
    <input v-model="inputValue" placeholder="내용을 입력하세요" />
    <button @click="showMessage">확인</button>
    <div> Message(보간법): {{ message }} </div>
    <div v-text="message"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const message = ref('')

function showMessage() {
  message.value = inputValue.value;
}
</script>
