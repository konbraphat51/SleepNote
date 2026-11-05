<script>
// SleepNote — the month board: header + day rows, with paint/drag and tooltip handling.

import { ref, computed } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { useI18n } from '../I18n/useI18n.js'
import { SlotsPerDay, SlotState } from '../Constants/DiaryConstants.js'
import { getDaysInMonth, formatSlotTime, getWeekday } from '../Utils/TimeUtil.js'
import DayRow from './DayRow.vue'

export default {
  name: 'MonthGrid',
  components: { DayRow },
  setup() {
    const { state, getSlotState, setSlotState, applyActiveTool } = useDiaryStore()
    const { t, monthTitle } = useI18n()

    const days = computed(() =>
      Array.from({ length: getDaysInMonth(state.viewYear, state.viewMonth) }, (_, i) => i + 1),
    )
    const slotIndices = Array.from({ length: SlotsPerDay }, (_, i) => i)
    const hourLabels = Array.from({ length: SlotsPerDay / 2 }, (_, i) => i)

    const painting = ref(false)
    // Day the current paint drag started on; a drag only paints within this row.
    let paintDay = null
    const tooltip = ref({ visible: false, x: 0, y: 0, text: '' })
    // Cell currently under the pointer, used to highlight its row and column.
    const hover = ref({ day: null, slot: null })

    // Find the slot cell under a pointer position.
    function cellAt(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY)
      const cell = el?.closest?.('[data-slot]')
      if (!cell) return null
      return { day: Number(cell.dataset.day), slot: Number(cell.dataset.slot) }
    }

    function onPointerDown(event) {
      if (event.button !== 0) return
      const cell = cellAt(event.clientX, event.clientY)
      if (!cell) return
      if (state.activeTool.kind === 'icon') {
        applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
        return
      }
      painting.value = true
      paintDay = cell.day
      applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
    }

    function onPointerMove(event) {
      const cell = cellAt(event.clientX, event.clientY)
      if (!cell) {
        tooltip.value.visible = false
        hover.value = { day: null, slot: null }
        return
      }
      if (painting.value && state.activeTool.kind !== 'icon' && cell.day === paintDay) {
        applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
      }
      if (hover.value.day !== cell.day || hover.value.slot !== cell.slot) {
        hover.value = { day: cell.day, slot: cell.slot }
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
      paintDay = null
    }

    // Right-click a painted slot to erase it (fill only, mirroring the eraser tool).
    function onContextMenu(event) {
      const cell = cellAt(event.clientX, event.clientY)
      if (!cell) return
      if (getSlotState(state.viewYear, state.viewMonth, cell.day, cell.slot) === SlotState.Empty) return
      setSlotState(state.viewYear, state.viewMonth, cell.day, cell.slot, SlotState.Empty)
    }

    function onPointerLeave() {
      painting.value = false
      paintDay = null
      tooltip.value.visible = false
      hover.value = { day: null, slot: null }
    }

    return {
      state,
      t,
      monthTitle,
      days,
      slotIndices,
      hourLabels,
      tooltip,
      hover,
      onPointerDown,
      onPointerMove,
      stopPainting,
      onContextMenu,
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
      @contextmenu.prevent="onContextMenu"
    >
      <div class="diary-row month-grid__header">
        <div class="diary-label">{{ t('dayHeader') }}</div>
        <div v-for="hour in hourLabels" :key="hour" class="diary-hour">{{ hour }}</div>
      </div>
      <DayRow
        v-for="day in days"
        :key="day"
        :day="day"
        :hover-day="hover.day"
        :hover-slot="hover.slot"
      />
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
