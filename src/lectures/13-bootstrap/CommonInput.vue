<template>
  <div class="mb-3">
    <label :for="uuid" class="form-label">{{ label }}</label>
    <input ref="inputRef" :id="uuid" :type="type" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
      :class="[
        'form-control',
        size ? `form-control-${size}` : '',
        readonly ? 'form-control-plaintext border ps-2' : ''
      ]" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('enter-submit')" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  size: String,      // 사용자 조절 가능
  disabled: Boolean,
  readonly: Boolean  // 사용자 조절 가능
});

defineEmits(['update:modelValue', 'enter-submit']);

// 컴포넌트마다 고유한 ID 생성
const uuid = computed(() => `input-${Math.random().toString(36).slice(2, 11)}`);
const inputRef = ref(null);

// 포커스 제어를 위한 handle 노출
defineExpose({
  focusInput: () => inputRef.value?.focus()
});
</script>