<template>
  <div>
    <input v-model="message" placeholder="Type something">
    <p>Message: {{ message }}</p>
  </div>

  <!--텍스트 입력 바인딩-->
  <div>
    <input v-model="textmessage" placeholder="Type something">
    <p>Message: {{ textmessage }}</p>
  </div>

  <!--체크박스 바인딩-->
  <div>
    <input type="checkbox" v-model="checkboxmessage">
    <p>Checked: {{ checkboxmessage }}</p>
  </div>

  <!--라디오 버튼 바인딩-->
  <div>
    <input type="radio" value="Option 1" v-model="radiomessage"> Option 1
    <input type="radio" value="Option 2" v-model="radiomessage"> Option 2
    <p>Selected: {{ radiomessage }}</p>
  </div>

  <!--셀렉트 박스 바인딩-->
  <div>
    <select v-model="selectmessage">
      <option value="A">Option A</option>
      <option value="B">Option B</option>
      <option value="C">Option C</option>
    </select>
    <p>Selected: {{ selectmessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref("Value에 넣은 값");
const textmessage = ref("");
const checkboxmessage = ref("");
const radiomessage = ref("");
const selectmessage = ref("");
</script>

<style>
div {
  margin-bottom: 12px;
}
</style>
