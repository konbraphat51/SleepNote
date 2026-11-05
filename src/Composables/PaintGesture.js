// SleepNote — shared pointer gestures for painting slots: tap, drag, and right-click erase.

import { ref } from 'vue'
import { useDiaryStore } from './DiaryStore.js'
import { SlotState } from '../Constants/DiaryConstants.js'

// Find the slot cell under a pointer position; null when the pointer is not on a slot.
function cellAt(clientX, clientY) {
  const el = document.elementFromPoint(clientX, clientY)
  const cell = el?.closest?.('[data-slot]')
  if (!cell) return null
  return { day: Number(cell.dataset.day), slot: Number(cell.dataset.slot) }
}

// Pointer handlers for any element holding [data-day][data-slot] cells in the visible month.
export function usePaintGesture() {
  const { state, getSlotState, setSlotState, applyActiveTool, tapActiveTool } = useDiaryStore()

  const painting = ref(false)
  // Day the current paint drag started on; a drag only paints within this day.
  let paintDay = null
  // Touch tap waiting for pointerup; cancelled if the browser starts scrolling instead.
  let pendingTap = null

  // Start a tap, an icon toggle, or a drag stroke under the pointer.
  function onPointerDown(event) {
    if (event.button !== 0) return
    const cell = cellAt(event.clientX, event.clientY)
    if (!cell) return
    // Touch without drag-paint: wait for pointerup so a swipe scrolls instead of painting.
    if (event.pointerType === 'touch' && !state.touchDragPaint) {
      pendingTap = cell
      return
    }
    if (state.activeTool.kind === 'icon') {
      applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
      return
    }
    painting.value = true
    paintDay = cell.day
    applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
  }

  // Continue a drag stroke; returns the cell under the pointer, or null when off a slot.
  function onPointerMove(event) {
    const cell = cellAt(event.clientX, event.clientY)
    if (!cell) return null
    if (painting.value && state.activeTool.kind !== 'icon' && cell.day === paintDay) {
      applyActiveTool(state.viewYear, state.viewMonth, cell.day, cell.slot)
    }
    return cell
  }

  // A lifted touch that never turned into a scroll counts as a tap (tapping a filled slot clears it).
  function onPointerUp() {
    if (pendingTap) {
      tapActiveTool(state.viewYear, state.viewMonth, pendingTap.day, pendingTap.slot)
      pendingTap = null
    }
    stopPainting()
  }

  function onPointerCancel() {
    pendingTap = null
    stopPainting()
  }

  function onPointerLeave() {
    pendingTap = null
    stopPainting()
  }

  function stopPainting() {
    painting.value = false
    paintDay = null
  }

  // Right-click a painted slot to erase it (fill only, mirroring the eraser tool).
  function onContextMenu(event) {
    const cell = cellAt(event.clientX, event.clientY)
    if (!cell) return
    event.preventDefault()
    if (getSlotState(state.viewYear, state.viewMonth, cell.day, cell.slot) === SlotState.Empty) return
    setSlotState(state.viewYear, state.viewMonth, cell.day, cell.slot, SlotState.Empty)
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onContextMenu,
  }
}
