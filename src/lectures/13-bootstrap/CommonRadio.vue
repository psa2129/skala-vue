<template>
  <div class="radio-group" :class="[`size-${size}`, { 'is-disabled': disabled }]">
    <div v-for="(item, index) in options" :key="item.value" class="radio-option">
      <input type="radio" :name="name" :id="`${uuid}-${index}`" :value="item.value" :checked="modelValue === item.value"
        :disabled="disabled" class="form-check-input"
        @change="$emit('update:modelValue', item.value); $emit('changed', item)" />
      <label :for="`${uuid}-${index}`" class="form-check-label">
        {{ item.label }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, required: true },
  name: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'md' } // sm(작게), md(보통), lg(크게)
});

defineEmits(['update:modelValue', 'changed']);

// 컴포넌트 고유 ID 생성
const uuid = computed(() => `radio-${Math.random().toString(36).slice(2, 11)}`);
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  /* 세로 나열 */
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-check-input {
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
}

.form-check-label {
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

/* 읽기 전용(Disabled) 스타일 */
.is-disabled .form-check-input,
.is-disabled .form-check-label {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 전체 화면 크기에 따른 라디오/폰트 조절 */
.size-sm .form-check-label {
  font-size: 0.85rem;
}

.size-sm .form-check-input {
  width: 1rem;
  height: 1rem;
}

.size-md .form-check-label {
  font-size: 1rem;
}

.size-md .form-check-input {
  width: 1.2rem;
  height: 1.2rem;
}

.size-lg .form-check-label {
  font-size: 1.25rem;
}

.size-lg .form-check-input {
  width: 1.4rem;
  height: 1.4rem;
}
</style>