<template>
  <div>
    <input v-model="url" placeholder="Enter URL" /><br />
    <!-- <a v-bind:href="url">Visit Vue.js(v-bind:href)</a><br /> // 잘 안쓰는 표현임 -->
    <a :href="url">Visit Vue.js(:href)</a>
    <img :src="url" alt="Vue.js Logo" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const url = ref("https://vuejs.org");

// const url = "https://vuejs.org";
</script>