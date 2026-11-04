<script>
// SleepNote — toolbar: month navigation, tools, icons, data actions, language.

import { ref } from 'vue'
import { useDiaryStore } from '../Composables/DiaryStore.js'
import { useI18n } from '../I18n/useI18n.js'
import { formatMonthKey } from '../Utils/TimeUtil.js'
import { SlotState, IconType } from '../Constants/DiaryConstants.js'
import { Locale } from '../I18n/Locales.js'

export default {
  name: 'DiaryToolbar',
  setup() {
    const {
      state,
      changeMonth,
      goToToday,
      setActiveTool,
      setLanguage,
      exportJson,
      importJson,
      showNotice,
    } = useDiaryStore()
    const { t, monthTitle } = useI18n()
    const fileInput = ref(null)

    const isActive = (kind, value) =>
      state.activeTool.kind === kind && state.activeTool.value === value

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
      setActiveTool,
      setLanguage,
      isActive,
      fileInput,
      onExportJson,
      onImportClick,
      onImportChange,
      onExportPdf,
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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
}

.toolbar__nav {
  display: flex;
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
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
}

.toolbar__btn:hover {
  background: #f3f4f6;
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
  color: #6b7280;
  margin-right: 2px;
}

.toolbar__tool {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
}

.toolbar__tool--active {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
  background: #eff6ff;
}

.toolbar__icon {
  width: 14px;
  height: 14px;
}

.toolbar__file {
  display: none;
}
</style>