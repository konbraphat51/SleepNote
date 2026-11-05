<script>
// SleepNote — one day row: date label + 48 slot cells.

import { computed } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { useI18n } from '../I18n/useI18n.js'
import { SlotsPerDay } from '../Constants/DiaryConstants.js'
import { getWeekday, formatDuration } from '../Utils/TimeUtil.js'
import SlotCell from './SlotCell.vue'

export default {
  name: 'DayRow',
  components: { SlotCell },
  props: {
    day: { type: Number, required: true },
    hoverDay: { type: Number, default: null },
    hoverSlot: { type: Number, default: null },
  },
  setup(props) {
    const {
      state,
      getSlotState,
      getIconsAt,
      getNote,
      setNote,
      getSleepMinutes,
      openDayView,
    } = useDiaryStore()
    const { t } = useI18n()

    const slotIndices = Array.from({ length: SlotsPerDay }, (_, i) => i)

    const weekdayShort = computed(() =>
      t('weekdaysShort')[getWeekday(state.viewYear, state.viewMonth, props.day)],
    )

    const isToday = computed(() => {
      const now = new Date()
      return (
        state.viewYear === now.getFullYear() &&
        state.viewMonth === now.getMonth() &&
        props.day === now.getDate()
      )
    })

    const isHoverRow = computed(() => props.hoverDay === props.day)

    // Total sleep for this day as "HH:MM", counted from the Sleep slots.
    const sleepTotal = computed(() =>
      formatDuration(getSleepMinutes(state.viewYear, state.viewMonth, props.day)),
    )

    // Persist the single-line note for this day.
    function onNoteInput(event) {
      setNote(state.viewYear, state.viewMonth, props.day, event.target.value)
    }

    return {
      state,
      t,
      slotIndices,
      weekdayShort,
      isToday,
      isHoverRow,
      sleepTotal,
      openDayView,
      getSlotState,
      getIconsAt,
      getNote,
      onNoteInput,
    }
  },
}
</script>

<template>
  <div class="diary-row day-row" :class="{ 'day-row--today': isToday }">
    <div class="diary-label day-row__label" @click="openDayView(day)">
      <span class="day-row__number">{{ day }}</span>
      <span class="day-row__weekday">{{ weekdayShort }}</span>
    </div>
    <div class="diary-total day-row__total">{{ sleepTotal }}</div>
    <SlotCell
      v-for="slotIndex in slotIndices"
      :key="slotIndex"
      :day="day"
      :slot="slotIndex"
      :state="getSlotState(state.viewYear, state.viewMonth, day, slotIndex)"
      :icons="getIconsAt(state.viewYear, state.viewMonth, day, slotIndex)"
      :highlight="isHoverRow || slotIndex === hoverSlot"
    />
    <input
      class="day-row__note"
      type="text"
      :value="getNote(state.viewYear, state.viewMonth, day)"
      :placeholder="t('notePlaceholder')"
      :aria-label="t('noteHeader')"
      maxlength="60"
      @input="onNoteInput"
    />
  </div>
</template>

<style scoped>
.day-row--today .diary-label {
  background: var(--color-today);
  font-weight: 700;
}

.day-row__label {
  justify-content: flex-start;
  cursor: pointer;
}

.day-row__number {
  font-weight: 600;
}

.day-row__weekday {
  color: var(--color-text-muted);
}

.day-row__total {
  font-variant-numeric: tabular-nums;
}
</style>
