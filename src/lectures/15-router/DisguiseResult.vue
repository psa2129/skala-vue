<template>
  <div>
    <h1>둔갑술 시전!</h1>
    <p>홍길동이 <strong>{{ target }}</strong>(으)로 변신했습니다!</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const target = ref('???') // 기본값 설정
const route = useRoute()
const router = useRouter()

onMounted(() => {
  // 1. URL의 쿼리(?target=호랑이)에서 값을 가져옵니다.
  const queryTarget = route.query.target

  if (queryTarget) {
    // 2. 화면에 표시될 target 변수에 '호랑이' 또는 '도깨비'를 저장합니다.
    target.value = queryTarget

    // 3. 브라우저 주소창에서 쿼리 스트링을 삭제합니다.
    // replace를 쓰면 뒤로가기 기록을 덮어써서 사용자가 쿼리를 볼 틈이 없습니다.
    router.replace({
      path: '/disguise',
      query: {}
    })
  }
})
</script>