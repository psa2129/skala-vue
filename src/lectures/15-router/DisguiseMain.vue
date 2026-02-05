<template>
  <div>
    <h1>🧙 둔갑술 선택 메뉴</h1>
    <button @click="goToDisguise('호랑이')">호랑이로 둔갑</button>
    <button @click="goToDisguise('도깨비')">도깨비로 둔갑</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDisguise(target) {
  // 주소창에 /disguise?target=호랑이 형태로 데이터를 실어 보냅니다.
  router.push({
    path: '/disguise',
    query: { target: target }
  })
}
</script>

<style scoped>
button {
  margin: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
}
</style>