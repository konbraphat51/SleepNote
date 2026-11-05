// SleepNote — central reactive store: diary data, view state, and cookie persistence.

import { reactive } from 'vue'
import {
  SlotsPerDay,
  SlotState,
  SlotStateChar,
  CharSlotState,
  MinutesPerSlot,
} from '../Constants/DiaryConstants.js'
import { formatMonthKey } from '../Utils/TimeUtil.js'
import { readCookie, writeCookie } from '../Utils/CookieUtil.js'
import { Locale } from '../I18n/Locales.js'

const DiaryCookieName = 'sleepnote_diary'
const LanguageCookieName = 'sleepnote_language'
const DiaryVersion = 1

// Build an empty month payload.
function createEmptyMonth() {
  return { slots: {}, icons: [], notes: {} }
}

// Build an empty diary document.
function createEmptyDiary() {
  return { version: DiaryVersion, months: {}, customLabels: {} }
}

// Fill in any field an older document (or imported file) may be missing.
function normalizeDiary(diary) {
  if (!diary.customLabels) diary.customLabels = {}
  return diary
}

// Read the diary document from the cookie, or a fresh one on any error.
function loadDiary() {
  const raw = readCookie(DiaryCookieName)
  if (!raw) return createEmptyDiary()
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === DiaryVersion && parsed.months) return normalizeDiary(parsed)
  } catch {
    // Malformed payload — start over.
  }
  return createEmptyDiary()
}

const today = new Date()

const state = reactive({
  viewYear: today.getFullYear(),
  viewMonth: today.getMonth(),
  // UI-only (not persisted): 'month' board or the single-day 'day' focus view.
  viewMode: 'month',
  focusDay: today.getDate(),
  language: readCookie(LanguageCookieName) === Locale.Ja ? Locale.Ja : Locale.En,
  activeTool: { kind: 'state', value: SlotState.Sleep },
  // UI-only (not persisted): whether touch drags paint instead of scrolling.
  touchDragPaint: false,
  diary: loadDiary(),
  notice: null,
  canUndo: false,
  canRedo: false,
})

let saveTimer = null

// Persist the diary document, debounced to avoid a cookie write per cell.
function saveDiary() {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    saveTimer = null
    writeCookie(DiaryCookieName, JSON.stringify(state.diary))
  }, 300)
}

// Persist immediately, flushing any pending debounce (used by undo/redo).
function saveDiaryNow() {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  writeCookie(DiaryCookieName, JSON.stringify(state.diary))
}

// --- Undo / redo history ----------------------------------------------------

const MaxHistory = 50
const GestureMs = 500

const past = []
const future = []
let pendingSnapshot = null
let commitTimer = null

// Deep-clone the diary into a plain object, stripping Vue reactivity.
function cloneDiary(diary) {
  return JSON.parse(JSON.stringify(diary))
}

// Capture the pre-mutation state once per gesture and schedule its commit.
function markDirty() {
  if (pendingSnapshot === null) {
    pendingSnapshot = cloneDiary(state.diary)
    future.length = 0
    updateFlags()
  }
  if (commitTimer) clearTimeout(commitTimer)
  commitTimer = setTimeout(commitPending, GestureMs)
}

// Move the pending snapshot into the undo stack once the gesture ends.
function commitPending() {
  commitTimer = null
  if (pendingSnapshot !== null) {
    past.push(pendingSnapshot)
    pendingSnapshot = null
    if (past.length > MaxHistory) past.shift()
  }
  updateFlags()
}

// Flush an in-flight gesture so undo can revert it immediately.
function flushPending() {
  if (commitTimer) {
    clearTimeout(commitTimer)
    commitTimer = null
  }
  if (pendingSnapshot !== null) {
    past.push(pendingSnapshot)
    pendingSnapshot = null
    if (past.length > MaxHistory) past.shift()
  }
}

// Reflect the history stacks in the reactive UI flags.
function updateFlags() {
  state.canUndo = past.length > 0 || pendingSnapshot !== null
  state.canRedo = future.length > 0
}

// Revert the most recent change.
function undo() {
  flushPending()
  if (past.length === 0) return
  future.push(cloneDiary(state.diary))
  state.diary = past.pop()
  saveDiaryNow()
  updateFlags()
}

// Re-apply the most recently undone change.
function redo() {
  if (pendingSnapshot !== null || future.length === 0) return
  past.push(cloneDiary(state.diary))
  state.diary = future.pop()
  saveDiaryNow()
  updateFlags()
}

// Clear the whole history (used when the document is replaced).
function resetHistory() {
  if (commitTimer) {
    clearTimeout(commitTimer)
    commitTimer = null
  }
  pendingSnapshot = null
  past.length = 0
  future.length = 0
  updateFlags()
}

// Return (creating if needed) the month data for the given year/month.
function getMonthData(year, monthIndex) {
  const key = formatMonthKey(year, monthIndex)
  if (!state.diary.months[key]) state.diary.months[key] = createEmptyMonth()
  return state.diary.months[key]
}

// Read one slot state, defaulting to Empty.
function getSlotState(year, monthIndex, day, slotIndex) {
  const row = state.diary.months[formatMonthKey(year, monthIndex)]?.slots?.[String(day)]
  if (!row || slotIndex >= row.length) return SlotState.Empty
  return CharSlotState[row[slotIndex]] ?? SlotState.Empty
}

// Write one slot state and persist.
function setSlotState(year, monthIndex, day, slotIndex, slotState) {
  markDirty()
  const month = getMonthData(year, monthIndex)
  const dayKey = String(day)
  if (!month.slots[dayKey]) {
    month.slots[dayKey] = SlotStateChar[SlotState.Empty].repeat(SlotsPerDay)
  }
  const cells = month.slots[dayKey].split('')
  cells[slotIndex] = SlotStateChar[slotState] ?? SlotStateChar[SlotState.Empty]
  month.slots[dayKey] = cells.join('')
  saveDiary()
}

// Read the free-text note for one day (empty string when absent).
function getNote(year, monthIndex, day) {
  const month = state.diary.months[formatMonthKey(year, monthIndex)]
  return month?.notes?.[String(day)] ?? ''
}

// Write (or clear) the free-text note for one day and persist.
function setNote(year, monthIndex, day, text) {
  markDirty()
  const month = getMonthData(year, monthIndex)
  if (!month.notes) month.notes = {}
  const dayKey = String(day)
  const value = text ?? ''
  if (value === '') delete month.notes[dayKey]
  else month.notes[dayKey] = value
  saveDiary()
}

// Read a user-defined fill label (empty string when the user kept the default).
function getCustomLabel(stateKey) {
  return state.diary.customLabels?.[stateKey] ?? ''
}

// Set (or clear) a user-defined fill label and persist.
function setCustomLabel(stateKey, text) {
  markDirty()
  if (!state.diary.customLabels) state.diary.customLabels = {}
  const labels = state.diary.customLabels
  const value = text ?? ''
  if (value.trim() === '') delete labels[stateKey]
  else labels[stateKey] = value
  saveDiary()
}

// List the icons placed on one slot.
function getIconsAt(year, monthIndex, day, slotIndex) {
  const month = state.diary.months[formatMonthKey(year, monthIndex)]
  if (!month) return []
  return month.icons.filter((icon) => icon.day === day && icon.slot === slotIndex)
}

// Toggle an icon on a slot; returns true when it was added.
function toggleIconAt(year, monthIndex, day, slotIndex, iconType) {
  markDirty()
  const month = getMonthData(year, monthIndex)
  const index = month.icons.findIndex(
    (icon) => icon.day === day && icon.slot === slotIndex && icon.type === iconType,
  )
  if (index >= 0) {
    month.icons.splice(index, 1)
  } else {
    month.icons.push({ day, slot: slotIndex, type: iconType })
  }
  saveDiary()
  return index < 0
}

// Apply the active tool to a single slot.
function applyActiveTool(year, monthIndex, day, slotIndex) {
  const tool = state.activeTool
  if (tool.kind === 'icon') {
    toggleIconAt(year, monthIndex, day, slotIndex, tool.value)
  } else {
    setSlotState(year, monthIndex, day, slotIndex, tool.value)
  }
}

// Tap on a slot: a fill tool clears the slot when it already shows that fill (toggle).
function tapActiveTool(year, monthIndex, day, slotIndex) {
  const tool = state.activeTool
  const isSameFill =
    tool.kind === 'state' && tool.value !== SlotState.Empty &&
    getSlotState(year, monthIndex, day, slotIndex) === tool.value
  if (isSameFill) {
    setSlotState(year, monthIndex, day, slotIndex, SlotState.Empty)
  } else {
    applyActiveTool(year, monthIndex, day, slotIndex)
  }
}

// Move the visible month by a delta (in months).
function changeMonth(delta) {
  const target = new Date(state.viewYear, state.viewMonth + delta, 1)
  state.viewYear = target.getFullYear()
  state.viewMonth = target.getMonth()
  // Keep the focused day inside the new month.
  const lastDay = new Date(state.viewYear, state.viewMonth + 1, 0).getDate()
  state.focusDay = Math.min(state.focusDay, lastDay)
}

// Switch the UI to the single-day view for the given day of the visible month.
function openDayView(day) {
  state.focusDay = day
  state.viewMode = 'day'
}

// Switch between the month board and the single-day view.
function setViewMode(mode) {
  state.viewMode = mode
}

// Move the focused day by a delta, crossing month boundaries as needed.
function shiftFocusDay(delta) {
  const target = new Date(state.viewYear, state.viewMonth, state.focusDay + delta)
  state.viewYear = target.getFullYear()
  state.viewMonth = target.getMonth()
  state.focusDay = target.getDate()
}

// Sleep minutes for one day, counted from its fixed Sleep slots.
function getSleepMinutes(year, monthIndex, day) {
  let sleepSlots = 0
  for (let slotIndex = 0; slotIndex < SlotsPerDay; slotIndex++) {
    if (getSlotState(year, monthIndex, day, slotIndex) === SlotState.Sleep) sleepSlots++
  }
  return sleepSlots * MinutesPerSlot
}

// Jump the view to the current month.
function goToToday() {
  const now = new Date()
  state.viewYear = now.getFullYear()
  state.viewMonth = now.getMonth()
  state.focusDay = now.getDate()
}

// Set the active tool.
function setActiveTool(kind, value) {
  state.activeTool = { kind, value }
}

// Toggle touch drag-painting; when off, touch gestures scroll the board instead.
function toggleTouchDragPaint() {
  state.touchDragPaint = !state.touchDragPaint
}

// Set the UI language and persist it.
function setLanguage(language) {
  state.language = language
  writeCookie(LanguageCookieName, language)
}

// Serialize the diary document for export.
function exportJson() {
  return JSON.stringify(state.diary, null, 2)
}

// Replace the diary document from an imported JSON string; throws when invalid.
function importJson(text) {
  const parsed = JSON.parse(text)
  if (!parsed || parsed.version !== DiaryVersion || !parsed.months) throw new Error('invalid diary')
  state.diary = normalizeDiary(parsed)
  resetHistory()
  saveDiary()
}

// Show a transient notice.
function showNotice(message) {
  state.notice = message
}

// Clear the transient notice.
function clearNotice() {
  state.notice = null
}

export function useDiaryStore() {
  return {
    state,
    getSlotState,
    setSlotState,
    getNote,
    setNote,
    getCustomLabel,
    setCustomLabel,
    getIconsAt,
    toggleIconAt,
    applyActiveTool,
    tapActiveTool,
    getSleepMinutes,
    openDayView,
    setViewMode,
    shiftFocusDay,
    changeMonth,
    goToToday,
    setActiveTool,
    toggleTouchDragPaint,
    setLanguage,
    exportJson,
    importJson,
    showNotice,
    clearNotice,
    undo,
    redo,
  }
}
