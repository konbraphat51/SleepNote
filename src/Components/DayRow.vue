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
  },
  setup(props) {
    const { state, getSlotState, getIconsAt } = useDiaryStore()
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

    return { state, slotIndices, weekdayShort, isToday, getSlotState, getIconsAt }
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
