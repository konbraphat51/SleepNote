// SleepNote — central reactive store: diary data, view state, and cookie persistence.

import { reactive } from 'vue'
import {
  SlotsPerDay,
  SlotState,
  SlotStateChar,
  CharSlotState,
} from '../Constants/DiaryConstants.js'
import { formatMonthKey } from '../Utils/TimeUtil.js'
import { readCookie, writeCookie } from '../Utils/CookieUtil.js'
import { Locale } from '../I18n/Locales.js'

const DiaryCookieName = 'sleepnote_diary'
const LanguageCookieName = 'sleepnote_language'
const DiaryVersion = 1

// Build an empty month payload.
function createEmptyMonth() {
  return { slots: {}, icons: [] }
}

// Build an empty diary document.
function createEmptyDiary() {
  return { version: DiaryVersion, months: {} }
}

// Read the diary document from the cookie, or a fresh one on any error.
function loadDiary() {
  const raw = readCookie(DiaryCookieName)
  if (!raw) return createEmptyDiary()
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === DiaryVersion && parsed.months) return parsed
  } catch {
    // Malformed payload — start over.
  }
  return createEmptyDiary()
}

const today = new Date()

const state = reactive({
  viewYear: today.getFullYear(),
  viewMonth: today.getMonth(),
  language: readCookie(LanguageCookieName) === Locale.Ja ? Locale.Ja : Locale.En,
  activeTool: { kind: 'state', value: SlotState.Sleep },
  diary: loadDiary(),
  notice: null,
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

// List the icons placed on one slot.
function getIconsAt(year, monthIndex, day, slotIndex) {
  const month = state.diary.months[formatMonthKey(year, monthIndex)]
  if (!month) return []
  return month.icons.filter((icon) => icon.day === day && icon.slot === slotIndex)
}

// Toggle an icon on a slot; returns true when it was added.
function toggleIconAt(year, monthIndex, day, slotIndex, iconType) {
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

// Move the visible month by a delta (in months).
function changeMonth(delta) {
  const target = new Date(state.viewYear, state.viewMonth + delta, 1)
  state.viewYear = target.getFullYear()
  state.viewMonth = target.getMonth()
}

// Jump the view to the current month.
function goToToday() {
  const now = new Date()
  state.viewYear = now.getFullYear()
  state.viewMonth = now.getMonth()
}

// Set the active tool.
function setActiveTool(kind, value) {
  state.activeTool = { kind, value }
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
  state.diary = parsed
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
    getIconsAt,
    toggleIconAt,
    applyActiveTool,
    changeMonth,
    goToToday,
    setActiveTool,
    setLanguage,
    exportJson,
    importJson,
    showNotice,
    clearNotice,
  }
}
