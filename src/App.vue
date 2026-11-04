<script>
// SleepNote — root component: header, toolbar, grid, and legend.

import { useDiaryStore } from './Composables/DiaryStore.js'
import { useI18n } from './I18n/useI18n.js'
import DiaryToolbar from './Components/DiaryToolbar.vue'
import DiaryLegend from './Components/DiaryLegend.vue'
import MonthGrid from './Components/MonthGrid.vue'

export default {
  name: 'App',
  components: { DiaryToolbar, DiaryLegend, MonthGrid },
  setup() {
    const { state } = useDiaryStore()
    const { t } = useI18n()
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
  color: #6b7280;
}

.app__notice {
  margin: 8px 0;
  padding: 8px 12px;
  border-radius: 6px;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.app__warning {
  margin: 12px 0 0;
  color: #6b7280;
  font-size: 0.8rem;
}
</style>
