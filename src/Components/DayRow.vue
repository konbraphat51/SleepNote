<script>
// SleepNote — one day row: date label + 48 slot cells.

import { computed } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { useI18n } from '../I18n/useI18n.js'
import { SlotsPerDay } from '../Constants/DiaryConstants.js'
import { getWeekday } from '../Utils/TimeUtil.js'
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
    const { state, getSlotState, getIconsAt, getNote, setNote } = useDiaryStore()
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
    <div class="diary-label day-row__label">
      <span class="day-row__number">{{ day }}</span>
      <span class="day-row__weekday">{{ weekdayShort }}</span>
    </div>
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
  background: #fef3c7;
  font-weight: 700;
}

.day-row__number {
  font-weight: 600;
}

.day-row__weekday {
  color: #6b7280;
}
</style>
