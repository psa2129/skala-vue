<template>
  <div class="education-container">
    <header class="header">
      <h1>Vue.js 강의 예제 탐색기</h1>
      <div class="controls">
        <div class="select-group">
          <label for="folder-select">📂 폴더: </label>
          <select id="folder-select" v-model="selectedFolder">
            <option value="">-- 폴더 선택 --</option>
            <option v-for="folder in folders" :key="folder" :value="folder">
              {{ folder }}
            </option>
          </select>
        </div>
        <div class="select-group">
          <label for="file-select">📄 파일: </label>
          <select id="file-select" v-model="selectedFile" :disabled="!selectedFolder">
            <option value="">-- 파일 선택 --</option>
            <option v-for="file in availableFiles" :key="file" :value="file">
              {{ file }}
            </option>
          </select>
        </div>
        <div class="file-info-header" v-if="selectedKey">
          <code>📍 {{ displayPath }}</code>
        </div>
      </div>
    </header>

    <main class="content">
      <div v-if="selectedKey" class="split-view">
        <div class="panels" ref="containerRef" :style="{ gridTemplateColumns: `${splitPercentage}% 8px 1fr` }">
          <div class="code-panel">
            <div class="panel-header">
              <h3>💻 소스 코드</h3>
            </div>
            <pre class="code-editor"><code class="language-vue" v-html="highlightedCode"></code></pre>
          </div>

          <div class="resizer" :class="{ 'is-dragging': isDragging }" @mousedown="startDragging"></div>

          <div class="preview-panel">
            <div class="panel-header">
              <h3>✨ 실행 결과</h3>
            </div>
            <div class="preview-content">
              <component :is="currentComponent" :key="componentKey" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>📁 폴더와 📄 파일을 선택해주세요.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, watch, shallowRef, onUnmounted } from 'vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

// --- 드래그 로직 관련 상태 ---
const containerRef = ref(null);
const isDragging = ref(false);
const splitPercentage = ref(50); // 기본 50:50 비율

const startDragging = (e) => {
  isDragging.value = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none'; // 드래그 중 텍스트 선택 방지

  window.addEventListener('mousemove', onDragging);
  window.addEventListener('mouseup', stopDragging);
};

const onDragging = (e) => {
  if (!isDragging.value || !containerRef.value) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const relativeX = e.clientX - containerRect.left;
  let newPercentage = (relativeX / containerRect.width) * 100;

  // 최소 10%, 최대 90%로 범위 제한
  if (newPercentage < 10) newPercentage = 10;
  if (newPercentage > 90) newPercentage = 90;

  splitPercentage.value = newPercentage;
};

const stopDragging = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';

  window.removeEventListener('mousemove', onDragging);
  window.removeEventListener('mouseup', stopDragging);
};

onUnmounted(() => {
  stopDragging();
});

// --- 기존 컴포넌트 로드 로직 ---
const componentsModules = import.meta.glob('./lectures/**/*.vue');
const rawModules = import.meta.glob('./lectures/**/*.vue', { query: '?raw', import: 'default' });

const allComponents = {};
const allRawSources = {};
const componentsByFolder = {};

for (const path in componentsModules) {
  const componentName = path.replace('./lectures/', '').replace('.vue', '');
  const parts = componentName.split('/');
  const folderName = parts.length > 1 ? parts[0] : '/';
  const fileName = parts.length > 1 ? parts.slice(1).join(' > ') : parts[0];

  if (!componentsByFolder[folderName]) {
    componentsByFolder[folderName] = [];
  }
  componentsByFolder[folderName].push(fileName);

  const fullKey = folderName === '/' ? fileName : `${folderName} > ${fileName}`;
  allComponents[fullKey] = defineAsyncComponent(componentsModules[path]);
  allRawSources[fullKey] = rawModules[path];
}

const folders = computed(() => Object.keys(componentsByFolder).sort());
const selectedFolder = ref('');
const selectedFile = ref('');

const availableFiles = computed(() => {
  if (!selectedFolder.value) return [];
  return (componentsByFolder[selectedFolder.value] || []).sort();
});

const selectedKey = computed(() => {
  if (!selectedFolder.value || !selectedFile.value) return '';
  return selectedFolder.value === '/' ? selectedFile.value : `${selectedFolder.value} > ${selectedFile.value}`;
});

const displayPath = computed(() => {
  if (!selectedKey.value) return '';
  if (selectedFolder.value === '/') return `src/lectures/${selectedFile.value}.vue`;
  return `src/lectures/${selectedKey.value.replace(/ > /g, '/')}.vue`;
});

const editableCode = ref('');
const componentKey = ref(0);
const currentComponent = shallowRef(null);

const highlightedCode = computed(() => {
  if (!editableCode.value) return '';
  return hljs.highlight(editableCode.value, { language: 'xml' }).value;
});

const loadSourceCode = async () => {
  if (!selectedKey.value) {
    editableCode.value = '';
    currentComponent.value = null;
    return;
  }

  try {
    const loader = allRawSources[selectedKey.value];
    if (loader) {
      const rawSource = await loader();
      editableCode.value = rawSource;
      currentComponent.value = allComponents[selectedKey.value];
      componentKey.value++;
    }
  } catch (error) {
    console.error('로드 실패:', error);
    editableCode.value = '// 코드를 불러오지 못했습니다.';
  }
};

watch(selectedFolder, () => { selectedFile.value = ''; });
watch(selectedKey, loadSourceCode, { immediate: true });
</script>

<style scoped>
.education-container {
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  padding: 10px 30px 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 2px solid #42b883;
  margin-bottom: 15px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8f9fa;
  padding: 10px 20px;
  border-radius: 8px;
}

/* 그리드 레이아웃 설정 */
.panels {
  display: grid;
  width: 100%;
  height: calc(100vh - 200px);
  min-height: 600px;
  gap: 0;
}

/* 리사이저 스타일 */
.resizer {
  width: 8px;
  cursor: col-resize;
  background-color: transparent;
  transition: background-color 0.2s;
  z-index: 10;
}

.resizer:hover,
.resizer.is-dragging {
  background-color: #42b883;
}

.code-panel,
.preview-panel {
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  /* 중요: 그리드 아이템 찌그러짐 방지 */
}

.panel-header {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  padding: 12px 20px;
}

.code-editor {
  flex: 1;
  overflow: auto;
  background: #f6f8fa;
  font-size: 13px;
  text-align: left;
}

.code-editor code {
  display: block;
  padding: 20px;
  white-space: pre;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px;
  color: #999;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>