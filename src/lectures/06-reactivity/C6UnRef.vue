<template>
  <div class="unref-example">
    <h2>unref 예제</h2>

    <div class="section">
      <h3>ref 값 unref</h3>
      <p>count (ref): {{ count }}</p>
      <p>unref(count): {{ unrefCount }}</p>
      <button @click="increment">증가</button>
    </div>

    <div class="section">
      <h3>computed unref</h3>
      <p>computed: {{ doubled }}</p>
      <p>unref(computed): {{ unrefDoubled }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'

// ref 값
const count = ref(0)

// computed 값
const doubled = computed(() => count.value * 2)

// unref 사용 - ref인 경우 .value 반환, 아니면 그대로 반환
const unrefCount = computed(() => unref(count))
const unrefDoubled = computed(() => unref(doubled))

const increment = () => {
  count.value++
  console.log('count.value:', count.value)
  console.log('unref(count):', unref(count))
}
</script>

<style scoped>
.unref-example {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h2 {
  color: #42b983;
}

h3 {
  color: #35495e;
  font-size: 1.1em;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #35495e;
}

p {
  margin: 8px 0;
}
</style>
