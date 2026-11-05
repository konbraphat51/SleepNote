// SleepNote — UI strings for the supported locales.

export const Locale = Object.freeze({
  En: 'en',
  Ja: 'ja',
})

export const Locales = Object.freeze({
  en: Object.freeze({
    appTitle: 'SleepNote',
    appTagline: 'Sleep diary',
    today: 'Today',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    undo: 'Undo',
    redo: 'Redo',
    toolsTitle: 'Tools',
    toolSleep: 'Sleep',
    toolAwakeInBed: 'Awake in bed',
    toolSleepiness: 'Daytime sleepiness',
    toolEraser: 'Eraser',
    toolMedication: 'Medication',
    toolMeal: 'Meal',
    customFillsTitle: 'Custom fills',
    customDefault1: 'Custom 1',
    customDefault2: 'Custom 2',
    customDefault3: 'Custom 3',
    iconsTitle: 'Icons',
    dataTitle: 'Data',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    exportPdf: 'PDF / Print',
    languageLabel: '日本語',
    legendTitle: 'Legend',
    legendSleep: 'Sleep',
    legendAwakeInBed: 'Awake in bed',
    legendSleepiness: 'Daytime sleepiness',
    legendMedication: 'Medication',
    legendMeal: 'Meal',
    dayHeader: 'Day',
    noteHeader: 'Notes',
    notePlaceholder: 'Note…',
    importSuccess: 'Data imported.',
    importError: 'Failed to import data.',
    importInvalid: 'Invalid file format.',
    cookieWarning:
      'Data is stored in a browser cookie (about 4 KB). Notes also count toward this limit — use Export JSON to back up larger records.',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  }),
  ja: Object.freeze({
    appTitle: 'SleepNote',
    appTagline: '睡眠日誌',
    today: '今日',
    previousMonth: '前の月',
    nextMonth: '次の月',
    undo: '元に戻す',
    redo: 'やり直す',
    toolsTitle: 'ツール',
    toolSleep: '睡眠',
    toolAwakeInBed: '在床覚醒',
    toolSleepiness: '活動中眠気',
    toolEraser: '消しゴム',
    toolMedication: '服薬',
    toolMeal: '食事',
    customFillsTitle: 'カスタム塗り',
    customDefault1: 'カスタム1',
    customDefault2: 'カスタム2',
    customDefault3: 'カスタム3',
    iconsTitle: 'アイコン',
    dataTitle: 'データ',
    exportJson: 'JSONを書き出す',
    importJson: 'JSONを読み込む',
    exportPdf: 'PDF / 印刷',
    languageLabel: 'English',
    legendTitle: '凡例',
    legendSleep: '睡眠',
    legendAwakeInBed: '在床覚醒',
    legendSleepiness: '活動中眠気',
    legendMedication: '服薬',
    legendMeal: '食事',
    dayHeader: '日',
    noteHeader: '備考',
    notePlaceholder: 'メモ…',
    importSuccess: 'データを読み込みました。',
    importError: 'データの読み込みに失敗しました。',
    importInvalid: 'ファイル形式が正しくありません。',
    cookieWarning:
      'データはブラウザのCookie（約4KBまで）に保存されます。備考もこの上限に含まれるため、大量の記録は「JSONを書き出す」でバックアップしてください。',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
  }),
})

// Resolve a translation key for a locale, falling back to English.
export function translate(locale, key) {
  const table = Locales[locale] ?? Locales.en
  return table[key] ?? Locales.en[key] ?? key
}

// Localized "November 2026" / "2026年11月" title.
export function formatMonthTitle(locale, year, monthIndex) {
  const monthName = translate(locale, 'months')[monthIndex]
  return locale === Locale.Ja ? `${year}年${monthName}` : `${monthName} ${year}`
}
