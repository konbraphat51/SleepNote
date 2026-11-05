// SleepNote — shared domain constants for the diary grid.

// Number of 30-minute slots in a single day (24 h x 2).
export const SlotsPerDay = 48

// Length of one slot in minutes.
export const MinutesPerSlot = 30

// The state a single slot can hold.
export const SlotState = Object.freeze({
  Empty: 'empty',
  AwakeInBed: 'awakeInBed',
  Sleep: 'sleep',
  Sleepiness: 'sleepiness',
  Custom1: 'custom1',
  Custom2: 'custom2',
  Custom3: 'custom3',
})

// Single-character encoding used to keep the JSON/Cookie payload compact.
export const SlotStateChar = Object.freeze({
  [SlotState.Empty]: '.',
  [SlotState.AwakeInBed]: 'A',
  [SlotState.Sleep]: 'S',
  [SlotState.Sleepiness]: 'D',
  [SlotState.Custom1]: '1',
  [SlotState.Custom2]: '2',
  [SlotState.Custom3]: '3',
})

// Inverse of SlotStateChar, used when decoding a stored row.
export const CharSlotState = Object.freeze({
  '.': SlotState.Empty,
  A: SlotState.AwakeInBed,
  S: SlotState.Sleep,
  D: SlotState.Sleepiness,
  '1': SlotState.Custom1,
  '2': SlotState.Custom2,
  '3': SlotState.Custom3,
})

// Icons that can be placed on a specific slot.
export const IconType = Object.freeze({
  Medication: 'medication',
  Meal: 'meal',
  Coffee: 'coffee',
})

// User-defined fills: the same paint mechanism as the fixed fills, but the
// meaning (and therefore the label) is chosen by the user.
export const CustomFillStates = Object.freeze([
  SlotState.Custom1,
  SlotState.Custom2,
  SlotState.Custom3,
])

// The fill styles, in display order for the toolbar and legend.
export const FillStates = Object.freeze([
  SlotState.Sleep,
  SlotState.AwakeInBed,
  SlotState.Sleepiness,
  ...CustomFillStates,
])
