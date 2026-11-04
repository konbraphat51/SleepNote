# SleepNote

SleepNote is a browser-based sleep diary. It shows one month per page and one day per row, with 48 slots of 30 minutes each (00:00–24:00). Paint each slot with one of three states and place icons on specific slots, then save the month as a PDF.

- **One month per page**, one day per row, 48 slots × 30 minutes
- **Three states** that stay distinct in black-and-white printing: Sleep (solid), Awake in bed (diagonal hatch), Daytime sleepiness (dots)
- **Two icons** per slot: Medication (capsule) and Meal (fork & knife)
- **Cookie storage** with JSON export/import backup
- **PDF per month** via the browser print dialog (A4 landscape)
- **Tooltip** on hover showing the slot's date/time
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

Click **PDF / Print** in the toolbar to open the browser print dialog, then choose **Save as PDF**. The print stylesheet uses A4 landscape and prints only the current month grid (the toolbar, legend, and warnings are hidden). The three fill patterns — solid, diagonal hatch, and dots — are designed to stay distinct when printed in black and white.

## GitHub Pages deployment

The app is deployed to `https://konbraphat51.github.io/SleepNote/` with GitHub Actions.

1. Push to the `main` branch (or run the workflow manually).
2. `.github/workflows/deploy.yml` runs `pnpm install`, `pnpm build`, and deploys `dist/` to GitHub Pages.
3. One-time setup: open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
