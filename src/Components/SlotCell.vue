<script>
// SleepNote — a single 30-minute slot cell (fill + optional icons).

import { computed } from 'vue'
import { SlotState, IconType } from '../Constants/DiaryConstants.js'

export default {
  name: 'SlotCell',
  props: {
    day: { type: Number, required: true },
    slot: { type: Number, required: true },
    state: { type: String, default: SlotState.Empty },
    icons: { type: Array, default: () => [] },
  },
  setup(props) {
    const fillClass = computed(() =>
      props.state === SlotState.Empty ? '' : `fill-${props.state}`,
    )
    const isHour = computed(() => props.slot % 2 === 0)
    const hasMedication = computed(() => props.icons.some((i) => i.type === IconType.Medication))
    const hasMeal = computed(() => props.icons.some((i) => i.type === IconType.Meal))
    return { fillClass, isHour, hasMedication, hasMeal }
  },
}
</script>

<template>
  <div
    class="slot-cell"
    :class="[fillClass, { 'slot-cell--hour': isHour }]"
    :data-day="day"
    :data-slot="slot"
  >
    <svg v-if="hasMedication" class="slot-cell__icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="9" width="20" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="2" />
      <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" stroke-width="2" />
    </svg>
    <svg v-if="hasMeal" class="slot-cell__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3v7c0 .9-.7 1.6-1.6 1.6S2.8 10.9 2.8 10V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <path d="M6 11v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <path d="M17 3c1.1 1.6 1.6 3.4 1.6 5.2 0 1.8-.5 3.1-1.4 3.6L15 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>
