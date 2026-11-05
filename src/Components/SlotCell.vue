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
    highlight: { type: Boolean, default: false },
  },
  setup(props) {
    const fillClass = computed(() =>
      props.state === SlotState.Empty ? '' : `fill-${props.state}`,
    )
    // The cell's right edge is an hour boundary on odd slots (slot 1 → 01:00, slot 3 → 02:00, …).
    const isHourBoundary = computed(() => props.slot % 2 === 1)
    const hasMedication = computed(() => props.icons.some((i) => i.type === IconType.Medication))
    const hasMeal = computed(() => props.icons.some((i) => i.type === IconType.Meal))
    const hasCoffee = computed(() => props.icons.some((i) => i.type === IconType.Coffee))
    return { fillClass, isHourBoundary, hasMedication, hasMeal, hasCoffee }
  },
}
</script>

<template>
  <div
    class="slot-cell"
    :class="[fillClass, { 'slot-cell--hour': isHourBoundary, 'slot-cell--highlight': highlight }]"
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
    <svg v-if="hasCoffee" class="slot-cell__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9h13v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M7 2c0 1 1 1.5 1 3M11 2c0 1 1 1.5 1 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </div>
</template>
