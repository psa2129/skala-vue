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
          <code class="path-highlight">📍 {{ displayPath }}</code>
        </div>
      </div>
    </header>

    <main class="content">
      <div v-if="selectedKey" class="split-view">
        <div class="panels" ref="containerRef" :class="{ 'is-resizing': isDragging }" :style="{
          gridTemplateColumns: isCollapsed ? '32px 0px 1fr' : `${splitPercentage}% 8px 1fr`,
        }">
          <div class="code-panel" :class="{ collapsed: isCollapsed }" @click="isCollapsed && toggleCollapse()">
            <div class="panel-header">
              <h3 v-show="!isCollapsed">💻 소스 코드</h3>
              <span class="arrow-toggle" @click.stop="toggleCollapse" :title="isCollapsed ? '펼치기' : '접기'">
                {{ isCollapsed ? '▶' : '◀' }}
              </span>
            </div>

            <pre v-show="!isCollapsed" class="code-editor">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <code class="language-vue" v-html="highlightedCode"></code>
            </pre>

            <div v-if="isCollapsed" class="collapsed-label">SOURCE CODE</div>
          </div>

          <div class="resizer" :class="{ 'is-dragging': isDragging, hidden: isCollapsed }"
            @mousedown.prevent="!isCollapsed && startDragging($event)"></div>

          <div class="preview-panel" :class="{ 'full-round': isCollapsed }">
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
        <p>📁 폴더와 📄 파일을 선택하면 해당 페이지 좌우에 표시됩니다.</p>
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

// --------------------
// Split view + Drag
// --------------------
const containerRef = ref(null);
const isDragging = ref(false);
const splitPercentage = ref(50);
const isCollapsed = ref(false);
const savedPercentage = ref(50);

const toggleCollapse = () => {
  if (!isCollapsed.value) {
    savedPercentage.value = splitPercentage.value;
    isCollapsed.value = true;
  } else {
    splitPercentage.value = savedPercentage.value;
    isCollapsed.value = false;
  }
};

const startDragging = (e) => {
  // 리스너 중복 방지
  if (isDragging.value) stopDragging();

  isDragging.value = true;
  document.body.classList.add('resizing-active');

  window.addEventListener('mousemove', onDragging);
  window.addEventListener('mouseup', stopDragging);
};

const onDragging = (e) => {
  if (!isDragging.value || !containerRef.value) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const relativeX = e.clientX - containerRect.left;
  let newPercentage = (relativeX / containerRect.width) * 100;

  if (newPercentage < 10) newPercentage = 10;
  if (newPercentage > 85) newPercentage = 85;

  splitPercentage.value = newPercentage;
};

const stopDragging = () => {
  if (!isDragging.value) return;

  isDragging.value = false;
  document.body.classList.remove('resizing-active');

  window.removeEventListener('mousemove', onDragging);
  window.removeEventListener('mouseup', stopDragging);
};

onUnmounted(() => stopDragging());

// --------------------
// Component loader
// --------------------
const componentsModules = import.meta.glob('./lectures/**/*.vue');
const rawModules = import.meta.glob('./lectures/**/*.vue', { as: 'raw' });

const allComponents = {};
const allRawSources = {};
const componentsByFolder = {};

for (const path in componentsModules) {
  const componentName = path.replace('./lectures/', '').replace('.vue', '');
  const parts = componentName.split('/');
  const folderName = parts.length > 1 ? parts[0] : '/';
  const fileName = parts.length > 1 ? parts.slice(1).join(' > ') : parts[0];

  if (!componentsByFolder[folderName]) componentsByFolder[folderName] = [];
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
  return selectedFolder.value === '/'
    ? `src/lectures/${selectedFile.value}.vue`
    : `src/lectures/${selectedKey.value.replace(/ > /g, '/')}.vue`;
});

const editableCode = ref('');
const componentKey = ref(0);
const currentComponent = shallowRef(null);

// highlight.js 예외 방어
const highlightedCode = computed(() => {
  if (!editableCode.value) return '';
  try {
    return hljs.highlight(editableCode.value, { language: 'xml' }).value;
  } catch {
    return editableCode.value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
});

const loadSourceCode = async () => {
  if (!selectedKey.value) {
    editableCode.value = '';
    currentComponent.value = null;
    return;
  }

  try {
    const loader = allRawSources[selectedKey.value];
    const rawSource = typeof loader === 'function' ? await loader() : '';

    editableCode.value = rawSource || '// 소스 없음';
    currentComponent.value = allComponents[selectedKey.value] || null;
    componentKey.value++;
  } catch {
    editableCode.value = '// 로드 실패';
    currentComponent.value = null;
  }
};

watch(selectedFolder, () => {
  selectedFile.value = '';
});

watch(selectedKey, loadSourceCode, { immediate: true });
</script>

<style>
/* 전역 클래스: 드래그 중 텍스트 선택 및 커서 튀는 현상 방지 */
body.resizing-active {
  cursor: col-resize !important;
  user-select: none !important;
}
</style>

<style scoped>
.education-container {
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  padding: 10px 30px 20px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #fff;
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
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.file-info-header {
  margin-left: auto;
}

.path-highlight {
  background-color: #eef7f3;
  padding: 6px 14px;
  border-radius: 6px;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  color: #35495e;
  border: 1px solid #42b883;
  font-weight: 600;
}

.panels {
  display: grid;
  width: 100%;
  height: calc(100vh - 210px);
  min-height: 600px;
  transition: grid-template-columns 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  gap: 0;
}

.panels.is-resizing {
  transition: none !important;
  will-change: grid-template-columns;
}

.code-panel {
  background: #fff;
  border: 1px solid #eaeaea;
  border-right: none;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

.code-panel.collapsed {
  width: 32px;
  border: 1px solid #42b883;
  border-radius: 10px;
  background-color: #f1f8f5;
  cursor: pointer;
  margin-right: 8px;
}

.code-panel.collapsed:hover {
  background-color: #e6f2ed;
}

.panel-header {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-panel.collapsed .panel-header {
  background: transparent;
  padding: 15px 0;
  justify-content: center;
  height: auto;
}

.arrow-toggle {
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: white;
  transition: transform 0.2s;
}

.code-panel.collapsed .arrow-toggle {
  color: #42b883;
  font-size: 16px;
}

.arrow-toggle:hover {
  transform: scale(1.2);
}

/* ✅ 접힌 상태 라벨: 패널 정중앙 배치 */
.code-panel.collapsed .collapsed-label {
  flex: 1;
  /* 남는 높이 전부 차지 */
  display: flex;
  align-items: center;
  /* 세로 중앙 */
  justify-content: center;
  /* 가로 중앙 */

  width: 100%;
  padding: 0;
  /* 기존 padding 제거 */
  margin: 0;

  writing-mode: vertical-lr;
  text-align: center;

  color: #42b883;
  font-weight: bold;
  font-size: 11px;
  letter-spacing: 2px;
}

.resizer {
  width: 8px;
  cursor: col-resize;
  background-color: #eee;
  z-index: 10;
  transition: background-color 0.2s;
}

.resizer:hover,
.resizer.is-dragging {
  background-color: #42b883;
}

.resizer.hidden {
  width: 0;
  visibility: hidden;
}

.preview-panel {
  background: #fff;
  border: 1px solid #eaeaea;
  border-left: none;
  border-radius: 0 10px 10px 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.preview-panel.full-round {
  border-left: 1px solid #eaeaea;
  border-radius: 10px;
}

.code-editor {
  flex: 1;
  overflow: auto;
  background: #f6f8fa;
  border: none;
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
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>