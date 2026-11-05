<script>
// SleepNote — root component: header, toolbar, grid, and legend.

import { onMounted, onBeforeUnmount } from 'vue'
import { useDiaryStore } from './Composables/DiaryStore.js'
import { useI18n } from './I18n/useI18n.js'
import DiaryToolbar from './Components/DiaryToolbar.vue'
import DiaryLegend from './Components/DiaryLegend.vue'
import MonthGrid from './Components/MonthGrid.vue'

export default {
  name: 'App',
  components: { DiaryToolbar, DiaryLegend, MonthGrid },
  setup() {
    const { state, undo, redo } = useDiaryStore()
    const { t } = useI18n()

    // Global keyboard shortcuts for undo/redo.
    function onKeydown(event) {
      if (!(event.ctrlKey || event.metaKey)) return
      const target = event.target
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      const key = event.key.toLowerCase()
      if (key === 'z') {
        if (event.shiftKey) redo()
        else undo()
        event.preventDefault()
      } else if (key === 'y') {
        redo()
        event.preventDefault()
      }
    }

    onMounted(() => window.addEventListener('keydown', onKeydown))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

    return { state, t }
  },
}
</script>

<template>
  <div class="app">
    <header class="app__header no-print">
      <h1 class="app__title">{{ t('appTitle') }}</h1>
      <span class="app__tagline">{{ t('appTagline') }}</span>
    </header>

    <DiaryToolbar />

    <p v-if="state.notice" class="app__notice">{{ state.notice }}</p>

    <MonthGrid />

    <DiaryLegend />

    <p class="app__warning no-print">{{ t('cookieWarning') }}</p>
  </div>
</template>

<style scoped>
.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
}

.app__header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.app__title {
  margin: 0;
  font-size: 1.4rem;
}

.app__tagline {
  color: var(--color-text-muted);
}

.app__notice {
  margin: 8px 0;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--color-notice-bg);
  color: var(--color-notice-text);
  border: 1px solid var(--color-notice-border);
}

.app__warning {
  margin: 12px 0 0;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

@media screen and (max-width: 640px) {
  .app {
    padding: 8px;
  }

  .app__title {
    font-size: 1.15rem;
  }
}

@media print {
  .app {
    max-width: none;
    margin: 0;
    padding: 0;
  }

  .app__notice {
    display: none;
  }
}
</style>
