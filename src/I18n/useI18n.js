// SleepNote — i18n composable bound to the active language in the store.

import { useDiaryStore } from '../Composables/DiaryStore.js'
import { translate, formatMonthTitle } from './Locales.js'

export function useI18n() {
  const { state } = useDiaryStore()

  // Translate a key using the current language.
  const t = (key) => translate(state.language, key)

  // Localized month title for a year/month.
  const monthTitle = (year, monthIndex) => formatMonthTitle(state.language, year, monthIndex)

  return { t, monthTitle }
}
