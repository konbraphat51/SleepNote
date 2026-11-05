<script>
// SleepNote — toolbar: month navigation, tools, icons, data actions, language.

import { ref } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { useI18n } from '../I18n/useI18n.js'
import { formatMonthKey } from '../Utils/TimeUtil.js'
import { SlotState, IconType, CustomFillStates } from '../Constants/DiaryConstants.js'
import { Locale } from '../I18n/Locales.js'

export default {
  name: 'DiaryToolbar',
  setup() {
    const {
      state,
      changeMonth,
      goToToday,
      undo,
      redo,
      setActiveTool,
      toggleTouchDragPaint,
      setViewMode,
      setLanguage,
      exportJson,
      importJson,
      showNotice,
      getCustomLabel,
      setCustomLabel,
    } = useDiaryStore()
    const { t, monthTitle } = useI18n()
    const fileInput = ref(null)

    // The three user-defined fills, in display order.
    const customFills = CustomFillStates.map((key, index) => ({
      key,
      defaultKey: `customDefault${index + 1}`,
    }))

    const isActive = (kind, value) =>
      state.activeTool.kind === kind && state.activeTool.value === value

    // Persist a user-defined fill label as the user types.
    function onCustomLabelInput(stateKey, event) {
      setCustomLabel(stateKey, event.target.value)
    }

    // Download the diary document as a JSON file named after the visible month.
    function onExportJson() {
      const blob = new Blob([exportJson()], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sleepnote-${formatMonthKey(state.viewYear, state.viewMonth)}.json`
      link.click()
      URL.revokeObjectURL(url)
    }

    // Open the hidden file picker for import.
    function onImportClick() {
      fileInput.value?.click()
    }

    // Read the chosen file and replace the diary document.
    function onImportChange(event) {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          importJson(String(reader.result))
          showNotice(t('importSuccess'))
        } catch {
          showNotice(t('importInvalid'))
        }
      }
      reader.onerror = () => showNotice(t('importError'))
      reader.readAsText(file)
      event.target.value = ''
    }

    // Open the browser print dialog for PDF export.
    function onExportPdf() {
      window.print()
    }

    return {
      state,
      t,
      monthTitle,
      changeMonth,
      goToToday,
      undo,
      redo,
      setActiveTool,
      toggleTouchDragPaint,
      setViewMode,
      setLanguage,
      isActive,
      fileInput,
      onExportJson,
      onImportClick,
      onImportChange,
      onExportPdf,
      customFills,
      getCustomLabel,
      onCustomLabelInput,
      SlotState,
      IconType,
      Locale,
    }
  },
}
</script>

<template>
  <div class="toolbar no-print">
    <div class="toolbar__nav">
      <button class="toolbar__btn" :title="t('previousMonth')" @click="changeMonth(-1)">‹</button>
      <span class="toolbar__month">{{ monthTitle(state.viewYear, state.viewMonth) }}</span>
      <button class="toolbar__btn" :title="t('nextMonth')" @click="changeMonth(1)">›</button>
      <button class="toolbar__btn" @click="goToToday">{{ t('today') }}</button>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': state.viewMode === 'month' }"
        :aria-pressed="state.viewMode === 'month'"
        @click="setViewMode('month')"
      >
        {{ t('viewMonth') }}
      </button>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': state.viewMode === 'day' }"
        :aria-pressed="state.viewMode === 'day'"
        @click="setViewMode('day')"
      >
        {{ t('viewDay') }}
      </button>
    </div>

    <div class="toolbar__group">
      <button class="toolbar__btn" :disabled="!state.canUndo" @click="undo">{{ t('undo') }}</button>
      <button class="toolbar__btn" :disabled="!state.canRedo" @click="redo">{{ t('redo') }}</button>
    </div>

    <div class="toolbar__group">
      <span class="toolbar__label">{{ t('toolsTitle') }}</span>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': isActive('state', SlotState.Sleep) }"
        @click="setActiveTool('state', SlotState.Sleep)"
      >
        <span class="swatch fill-sleep"></span>{{ t('toolSleep') }}
      </button>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': isActive('state', SlotState.AwakeInBed) }"
        @click="setActiveTool('state', SlotState.AwakeInBed)"
      >
        <span class="swatch fill-awakeInBed"></span>{{ t('toolAwakeInBed') }}
      </button>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': isActive('state', SlotState.Sleepiness) }"
        @click="setActiveTool('state', SlotState.Sleepiness)"
      >
        <span class="swatch fill-sleepiness"></span>{{ t('toolSleepiness') }}
      </button>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': isActive('state', SlotState.Empty) }"
        @click="setActiveTool('state', SlotState.Empty)"
      >
        <span class="swatch swatch--empty"></span>{{ t('toolEraser') }}
      </button>
    </div>

    <div class="toolbar__group">
      <span class="toolbar__label">{{ t('customFillsTitle') }}</span>
      <div v-for="fill in customFills" :key="fill.key" class="toolbar__custom">
        <button
          class="toolbar__tool toolbar__tool--swatch"
          :class="{ 'toolbar__tool--active': isActive('state', fill.key) }"
          :title="getCustomLabel(fill.key) || t(fill.defaultKey)"
          @click="setActiveTool('state', fill.key)"
        >
          <span class="swatch" :class="`fill-${fill.key}`"></span>
        </button>
        <input
          class="toolbar__custom-name"
          type="text"
          :value="getCustomLabel(fill.key)"
          :placeholder="t(fill.defaultKey)"
          :aria-label="t('customFillsTitle')"
          maxlength="16"
          @input="onCustomLabelInput(fill.key, $event)"
        />
      </div>
    </div>

    <div class="toolbar__group">
      <span class="toolbar__label">{{ t('iconsTitle') }}</span>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': isActive('icon', IconType.Medication) }"
        @click="setActiveTool('icon', IconType.Medication)"
      >
        <svg viewBox="0 0 24 24" class="toolbar__icon" aria-hidden="true">
          <rect x="2" y="9" width="20" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="2" />
          <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" stroke-width="2" />
        </svg>
        {{ t('toolMedication') }}
      </button>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': isActive('icon', IconType.Meal) }"
        @click="setActiveTool('icon', IconType.Meal)"
      >
        <svg viewBox="0 0 24 24" class="toolbar__icon" aria-hidden="true">
          <path d="M6 3v7c0 .9-.7 1.6-1.6 1.6S2.8 10.9 2.8 10V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M6 11v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M17 3c1.1 1.6 1.6 3.4 1.6 5.2 0 1.8-.5 3.1-1.4 3.6L15 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t('toolMeal') }}
      </button>
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': isActive('icon', IconType.Coffee) }"
        @click="setActiveTool('icon', IconType.Coffee)"
      >
        <svg viewBox="0 0 24 24" class="toolbar__icon" aria-hidden="true">
          <path d="M3 9h13v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
          <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M7 2c0 1 1 1.5 1 3M11 2c0 1 1 1.5 1 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        {{ t('toolCoffee') }}
      </button>
    </div>

    <div class="toolbar__group toolbar__group--touch">
      <button
        class="toolbar__tool"
        :class="{ 'toolbar__tool--active': state.touchDragPaint }"
        :aria-pressed="state.touchDragPaint"
        @click="toggleTouchDragPaint"
      >
        {{ t('toolTouchDragPaint') }}
      </button>
    </div>

    <div class="toolbar__group toolbar__group--end">
      <span class="toolbar__label">{{ t('dataTitle') }}</span>
      <button class="toolbar__btn" @click="onExportJson">{{ t('exportJson') }}</button>
      <button class="toolbar__btn" @click="onImportClick">{{ t('importJson') }}</button>
      <button class="toolbar__btn" @click="onExportPdf">{{ t('exportPdf') }}</button>
      <button
        class="toolbar__btn"
        @click="setLanguage(state.language === Locale.Ja ? Locale.En : Locale.Ja)"
      >
        {{ t('languageLabel') }}
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="application/json,.json"
      class="toolbar__file"
      @change="onImportChange"
    />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: 6px;
  margin-bottom: 8px;
}

.toolbar__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.toolbar__month {
  min-width: 9rem;
  text-align: center;
  font-weight: 600;
}

.toolbar__btn {
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text);
}

.toolbar__btn:hover {
  background: var(--color-surface-hover);
}

.toolbar__btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.toolbar__group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.toolbar__group--end {
  margin-left: auto;
}

.toolbar__label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-right: 2px;
}

.toolbar__tool {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text);
}

.toolbar__tool--active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
  background: var(--color-accent-soft);
}

.toolbar__icon {
  width: 14px;
  height: 14px;
}

.toolbar__custom {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.toolbar__tool--swatch {
  padding: 3px 4px;
}

.toolbar__custom-name {
  width: 5.5rem;
  padding: 3px 6px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  font-size: 0.75rem;
  color: var(--color-text);
}

.toolbar__file {
  display: none;
}

/* Drag-paint switch only matters on touch screens, where it trades painting for scrolling. */
.toolbar__group--touch {
  display: none;
}

@media (pointer: coarse) {
  .toolbar__group--touch {
    display: flex;
  }
}

/* Phone layout: tighter spacing, and 16px inputs so iOS does not zoom on focus. */
@media screen and (max-width: 640px) {
  .toolbar {
    gap: 8px;
    padding: 8px;
  }

  .toolbar__btn,
  .toolbar__tool {
    padding: 4px 8px;
    font-size: 0.8rem;
  }

  .toolbar__label {
    font-size: 0.7rem;
  }

  .toolbar__custom-name {
    width: 6rem;
    font-size: 16px;
  }
}
</style>