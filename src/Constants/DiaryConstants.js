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
})

// Single-character encoding used to keep the JSON/Cookie payload compact.
export const SlotStateChar = Object.freeze({
  [SlotState.Empty]: '.',
  [SlotState.AwakeInBed]: 'A',
  [SlotState.Sleep]: 'S',
  [SlotState.Sleepiness]: 'D',
})

// Inverse of SlotStateChar, used when decoding a stored row.
export const CharSlotState = Object.freeze({
  '.': SlotState.Empty,
  A: SlotState.AwakeInBed,
  S: SlotState.Sleep,
  D: SlotState.Sleepiness,
})

// Icons that can be placed on a specific slot.
export const IconType = Object.freeze({
  Medication: 'medication',
  Meal: 'meal',
})

// The three fill styles, in display order for the toolbar and legend.
export const FillStates = Object.freeze([
  SlotState.Sleep,
  SlotState.AwakeInBed,
  SlotState.Sleepiness,
])
