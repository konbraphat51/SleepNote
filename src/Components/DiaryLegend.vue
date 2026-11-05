<script>
// SleepNote — legend explaining the fill patterns and icons.

import { computed } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { useI18n } from '../I18n/useI18n.js'
import { CustomFillStates } from '../Constants/DiaryConstants.js'

export default {
  name: 'DiaryLegend',
  setup() {
    const { t } = useI18n()
    const { getCustomLabel } = useDiaryStore()
    // User-defined fills: the label is the user's own, falling back to the default name.
    const customFills = computed(() =>
      CustomFillStates.map((key, index) => ({
        key,
        label: getCustomLabel(key) || t(`customDefault${index + 1}`),
      })),
    )
    return { t, customFills }
  },
}
</script>

<template>
  <div class="legend">
    <span class="legend__title">{{ t('legendTitle') }}</span>
    <span class="legend__item"><span class="swatch fill-sleep"></span>{{ t('legendSleep') }}</span>
    <span class="legend__item"><span class="swatch fill-awakeInBed"></span>{{ t('legendAwakeInBed') }}</span>
    <span class="legend__item"><span class="swatch fill-sleepiness"></span>{{ t('legendSleepiness') }}</span>
    <span v-for="fill in customFills" :key="fill.key" class="legend__item">
      <span class="swatch" :class="`fill-${fill.key}`"></span>{{ fill.label }}
    </span>
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
    <span class="legend__item">
      <svg viewBox="0 0 24 24" class="legend__icon" aria-hidden="true">
        <path d="M3 9h13v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M7 2c0 1 1 1.5 1 3M11 2c0 1 1 1.5 1 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      {{ t('legendCoffee') }}
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
  color: var(--color-legend-text);
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

@media print {
  .legend {
    margin-top: 4px;
    padding: 4px 0;
    gap: 8px;
    font-size: 0.7rem;
    color: var(--color-text);
    break-inside: avoid;
  }

  .legend__icon {
    width: 12px;
    height: 12px;
  }
}
</style>
