<script>
// SleepNote — single-day focus view: a tall, time-labelled list of the day's 48 slots, easy to tap on a phone.

import { computed } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { usePaintGesture } from '../Composables/PaintGesture.js'
import { useI18n } from '../I18n/useI18n.js'
import { SlotsPerDay } from '../Constants/DiaryConstants.js'
import { formatSlotTime, formatDuration, getWeekday } from '../Utils/TimeUtil.js'
import SlotCell from './SlotCell.vue'

export default {
  name: 'DayFocus',
  components: { SlotCell },
  setup() {
    const {
      state,
      getSlotState,
      getIconsAt,
      getNote,
      setNote,
      getSleepMinutes,
      shiftFocusDay,
    } = useDiaryStore()
    const { t } = useI18n()
    const gesture = usePaintGesture()

    const slotIndices = Array.from({ length: SlotsPerDay }, (_, i) => i)

    const dateTitle = computed(() => {
      const weekday = t('weekdaysShort')[getWeekday(state.viewYear, state.viewMonth, state.focusDay)]
      return `${state.viewMonth + 1}/${state.focusDay} (${weekday})`
    })

    const sleepTotal = computed(() =>
      formatDuration(getSleepMinutes(state.viewYear, state.viewMonth, state.focusDay)),
    )

    // Persist the single-line note for the focused day.
    function onNoteInput(event) {
      setNote(state.viewYear, state.viewMonth, state.focusDay, event.target.value)
    }

    return {
      state,
      t,
      slotIndices,
      dateTitle,
      sleepTotal,
      formatSlotTime,
      getSlotState,
      getIconsAt,
      getNote,
      onNoteInput,
      shiftFocusDay,
      onPointerDown: gesture.onPointerDown,
      onPointerMove: gesture.onPointerMove,
      onPointerUp: gesture.onPointerUp,
      onPointerCancel: gesture.onPointerCancel,
      onPointerLeave: gesture.onPointerLeave,
      onContextMenu: gesture.onContextMenu,
    }
  },
}
</script>

<template>
  <section class="day-focus">
    <div class="day-focus__nav">
      <button class="day-focus__step" :aria-label="t('previousDay')" @click="shiftFocusDay(-1)">‹</button>
      <div class="day-focus__title">{{ dateTitle }}</div>
      <button class="day-focus__step" :aria-label="t('nextDay')" @click="shiftFocusDay(1)">›</button>
    </div>

    <div class="day-focus__meta">
      <span class="day-focus__total">{{ t('sleepTotalHeader') }} {{ sleepTotal }}</span>
      <input
        class="day-focus__note"
        type="text"
        :value="getNote(state.viewYear, state.viewMonth, state.focusDay)"
        :placeholder="t('notePlaceholder')"
        :aria-label="t('noteHeader')"
        maxlength="60"
        @input="onNoteInput"
      />
    </div>

    <div
      class="day-focus__list"
      :class="{ 'day-focus__list--drag-paint': state.touchDragPaint }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @pointerleave="onPointerLeave"
      @contextmenu="onContextMenu"
    >
      <div
        v-for="slotIndex in slotIndices"
        :key="slotIndex"
        class="day-focus__row"
        :class="{ 'day-focus__row--hour': slotIndex % 2 === 0 }"
      >
        <span class="day-focus__time">{{ formatSlotTime(slotIndex) }}</span>
        <SlotCell
          :day="state.focusDay"
          :slot="slotIndex"
          :state="getSlotState(state.viewYear, state.viewMonth, state.focusDay, slotIndex)"
          :icons="getIconsAt(state.viewYear, state.viewMonth, state.focusDay, slotIndex)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.day-focus {
  max-width: 560px;
  margin: 0 auto;
}

.day-focus__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 8px 0;
}

.day-focus__title {
  font-size: 1.15rem;
  font-weight: 600;
}

.day-focus__step {
  width: 52px;
  height: 44px;
  font-size: 1.4rem;
  line-height: 1;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
}

.day-focus__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.day-focus__total {
  flex: 0 0 auto;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

/* 16px so iOS does not zoom when the note is focused. */
.day-focus__note {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 10px;
  font-size: 16px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

/* Vertical list: pan-y lets the page scroll; drag-paint takes over the gesture. */
.day-focus__list {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  overflow: hidden;
  user-select: none;
  touch-action: pan-y;
}

.day-focus__list--drag-paint {
  touch-action: none;
}

.day-focus__row {
  display: flex;
  align-items: stretch;
  height: 36px;
  border-bottom: 1px solid var(--color-grid-soft);
}

.day-focus__row--hour {
  border-top: 1px solid var(--diary-line-strong);
}

.day-focus__time {
  flex: 0 0 3.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  background: var(--color-surface-alt);
  border-right: 1px solid var(--color-border);
  font-variant-numeric: tabular-nums;
}

:deep(.slot-cell) {
  flex: 1;
  height: 100%;
  border-right: none;
  border-bottom: none;
}

:deep(.slot-cell__icon) {
  width: 18px;
  height: 18px;
}
</style>
