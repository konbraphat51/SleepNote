<script>
// SleepNote — legend explaining the fill patterns and icons.

import { useI18n } from '../I18n/useI18n.js'

export default {
  name: 'DiaryLegend',
  setup() {
    const { t } = useI18n()
    return { t }
  },
}
</script>

<template>
  <div class="legend">
    <span class="legend__title">{{ t('legendTitle') }}</span>
    <span class="legend__item"><span class="swatch fill-sleep"></span>{{ t('legendSleep') }}</span>
    <span class="legend__item"><span class="swatch fill-awakeInBed"></span>{{ t('legendAwakeInBed') }}</span>
    <span class="legend__item"><span class="swatch fill-sleepiness"></span>{{ t('legendSleepiness') }}</span>
    <span class="legend__item">
      <svg viewBox="0 0 24 24" class="legend__icon" aria-hidden="true">
        <rect x="2" y="9" width="20" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="2" />
        <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" stroke-width="2" />
      </svg>
      {{ t('legendMedication') }}
    </span>
    <span class="legend__item">
      <svg viewBox="0 0 24 24" class="legend__icon" aria-hidden="true">
        <path d="M6 3v7c0 .9-.7 1.6-1.6 1.6S2.8 10.9 2.8 10V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M6 11v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M17 3c1.1 1.6 1.6 3.4 1.6 5.2 0 1.8-.5 3.1-1.4 3.6L15 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {{ t('legendMeal') }}
    </span>
  </div>
</template>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #374151;
}

.legend__title {
  font-weight: 600;
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.legend__icon {
  width: 14px;
  height: 14px;
}
</style>
