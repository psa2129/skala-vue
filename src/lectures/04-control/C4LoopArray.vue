<template>
  <div>
    <h2>국가 목록</h2>
    <ul>
      <li v-for="item in items" :key="item.code">{{ item.name }} ({{ item.code }})</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { code: 'KR', name: '대한민국' },
  { code: 'US', name: '미국' },
  { code: 'JP', name: '일본' },
  { code: 'FR', name: '프랑스' },
  { code: 'AR', name: '아르헨티나' }
]);
</script>
