# SleepNote

SleepNote is a browser-based sleep diary. It shows one month per page and one day per row, with 48 slots of 30 minutes each (00:00–24:00). Paint each slot with one of three fixed states or with one of three user-defined fills, and place icons on specific slots, then save the month as a PDF.

- **One month per page**, one day per row, 48 slots × 30 minutes
- **Three states** that stay distinct in black-and-white printing: Sleep (solid), Awake in bed (diagonal hatch), Daytime sleepiness (dots)
- **Three user-defined fills** — rename each from the toolbar to record anything you like (e.g. caffeine, exercise); each keeps its own print-safe pattern (horizontal bars, vertical stripes, checkerboard)
- **Three icons** per slot: Medication (capsule), Meal (fork & knife), and Coffee (cup with steam)
- **Cookie storage** with JSON export/import backup
- **Undo / Redo** — revert or re-apply edits (toolbar buttons and Ctrl+Z / Ctrl+Shift+Z)
- **PDF per month** via the browser print dialog (A4 landscape)
- **Tooltip** on hover showing the slot's date/time
- **Hover crosshair** — the hovered slot's row and column are lightly highlighted
- **Paint by dragging** — a drag paints only within the day row it started on, so a stray drag into another day leaves it untouched
- **Right-click to erase** — right-click a painted slot to clear its fill (same result as the eraser tool)
- **Per-day notes** — a single-line remark field on the right edge of each day row
- **English UI** by default, with a Japanese toggle

## Setup

Clone the repository and install dependencies with pnpm:

```sh
git clone https://github.com/konbraphat51/SleepNote.git
cd SleepNote
pnpm install
pnpm dev
```

Open the URL printed by Vite (http://localhost:5173 by default).

## Running later

Start the dev server again with:

```sh
pnpm dev
```

## Important CLIs

| Command        | Purpose                              |
| -------------- | ------------------------------------ |
| `pnpm install` | Install dependencies                 |
| `pnpm dev`     | Start the Vite dev server            |
| `pnpm build`   | Build for production into `dist/`    |
| `pnpm preview` | Preview the production build locally |

## Data storage

All diary data is stored in a single browser cookie (`sleepnote_diary`). A browser cookie holds about 4 KB, so the diary uses a compact encoding (one character per slot) but long histories can still reach the limit. Use **Export JSON** in the toolbar to download a full backup, and **Import JSON** to restore it. The UI language is kept in a separate `sleepnote_language` cookie.

## PDF export

Click **PDF / Print** in the toolbar to open the browser print dialog, then choose **Save as PDF**. The print stylesheet uses A4 landscape and prints the current month grid together with the legend on a single page (the toolbar, header, and warnings are hidden). All six fill patterns — solid, diagonal hatch, and dots for the fixed states, plus horizontal bars, vertical stripes, and checkerboard for the user-defined fills — are designed to stay distinct when printed in black and white.

## GitHub Pages deployment

The app is deployed to `https://konbraphat51.github.io/SleepNote/` with GitHub Actions.

1. Push to the `main` branch (or run the workflow manually).
2. `.github/workflows/deploy.yml` runs `pnpm install`, `pnpm build`, and deploys `dist/` to GitHub Pages.
3. One-time setup: open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
