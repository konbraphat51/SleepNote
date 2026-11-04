<script>
// SleepNote — the month board: header + day rows, with paint/drag and tooltip handling.

import { ref, computed } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { useI18n } from '../I18n/useI18n.js'
import { SlotsPerDay } from '../Constants/DiaryConstants.js'
import { getDaysInMonth, formatSlotTime, getWeekday } from '../Utils/TimeUtil.js'
import DayRow from './DayRow.vue'

export default {
  name: 'MonthGrid',
  components: { DayRow },
  setup() {
    const { state, applyActiveTool } = useDiaryStore()
    const { t, monthTitle } = useI18n()

    const days = computed(() =>
      Array.from({ length: getDaysInMonth(state.viewYear, state.viewMonth) }, (_, i) => i + 1),
    )
    const slotIndices = Array.from({ length: SlotsPerDay }, (_, i) => i)
    const hourLabels = Array.from({ length: SlotsPerDay / 2 }, (_, i) => i)

    const painting = ref(false)
    const tooltip = ref({ visible: false, x: 0, y: 0, text: '' })

    // Find the slot cell under a pointer position.
    function cellAt(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY)
      const cell = el?.closest?.('[data-slot]')
      if (!cell) return null
      return { day: Number(cell.dataset.day), slot: Number(cell.dataset.slot) }
    }

    function onPointerDown(event) {
      const cell = cellAt(event.clientX, event.clientY)
      if (!cell) return
      if (state.activeTool.kind === 'icon') {
        applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
        return
      }
      painting.value = true
      applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
    }

    function onPointerMove(event) {
      const cell = cellAt(event.clientX, event.clientY)
      if (!cell) {
        tooltip.value.visible = false
        return
      }
      if (painting.value && state.activeTool.kind !== 'icon') {
        applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
      }
      const weekday = t('weekdaysShort')[getWeekday(state.viewYear, state.viewMonth, cell.day)]
      tooltip.value = {
        visible: true,
        x: event.clientX + 12,
        y: event.clientY + 12,
        text: `${state.viewMonth + 1}/${cell.day} (${weekday}) ${formatSlotTime(cell.slot)}`,
      }
    }

    function stopPainting() {
      painting.value = false
    }

    function onPointerLeave() {
      painting.value = false
      tooltip.value.visible = false
    }

    return {
      state,
      t,
      monthTitle,
      days,
      slotIndices,
      hourLabels,
      tooltip,
      onPointerDown,
      onPointerMove,
      stopPainting,
      onPointerLeave,
    }
  },
}
</script>

<template>
  <section class="month-grid">
    <h2 class="month-grid__title">{{ monthTitle(state.viewYear, state.viewMonth) }}</h2>
    <div
      class="diary-board"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="stopPainting"
      @pointercancel="stopPainting"
      @pointerleave="onPointerLeave"
    >
      <div class="diary-row month-grid__header">
        <div class="diary-label">{{ t('dayHeader') }}</div>
        <div v-for="hour in hourLabels" :key="hour" class="diary-hour">{{ hour }}</div>
      </div>
      <DayRow v-for="day in days" :key="day" :day="day" />
    </div>
    <div
      v-if="tooltip.visible"
      class="month-grid__tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>
  </section>
</template>

<style scoped>
.month-grid__title {
  margin: 4px 0;
  text-align: center;
  font-size: 1.1rem;
}

.month-grid__header {
  position: sticky;
  top: 0;
  z-index: 3;
}

.month-grid__tooltip {
  position: fixed;
  z-index: 50;
  padding: 4px 8px;
  background: #111827;
  color: #ffffff;
  font-size: 0.75rem;
  border-radius: 4px;
  pointer-events: none;
  white-space: nowrap;
}
</style>
