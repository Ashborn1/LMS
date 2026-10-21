# 📚 Library Management System

A complete, dependency-free library circulation desk that runs entirely in the browser. Sign in, browse a curated catalog, record borrowings with full borrower details, track due dates, and manage inventory — no server, database, or build step required.

Everything is stored in `localStorage`, so the app works offline and remembers your data between visits. The only network request is the optional Google Fonts import for the Inter typeface, which falls back to the system font stack.

---

## ✨ Features

### Accounts & access
- Sign-in and registration with inline validation
- "Remember me" — persistent session in `localStorage`, or session-only when unchecked
- Case-sensitive usernames, password visibility toggles, and a seeded demo account
- Personal greeting and avatar initial in the header
- Sign-out from any screen

### Catalog & discovery
- 20 seeded titles across 4 subjects — IT, Science, English, and Social Studies — with **154 total copies**
- Live statistics for book titles, total copies, available copies, and copies on loan
- Category filter chips with per-category counts
- Instant search across titles and categories, with matched text highlighted
- Sort by title (A–Z / Z–A), availability, or category
- Filter to available titles only, or show fully borrowed titles
- Availability bar on every card with one-click **Borrow**
- Empty states for no results, empty catalogs, and no loans
- Clear all filters in one click

### Borrowing & returns
- Detailed borrower record: full name, borrower type (Student / Faculty / Staff / Guest), student or ID number, section/department, gender, and contact
- Date & time borrowed plus a custom due date and time
- Quick loan presets: 1 day, 3 days, 1 week, 2 weeks, 1 month
- Free-text notes on each loan
- "Recent borrowers" chips to re-use a previous borrower's details in one click
- Active loans sorted by nearest due date, with status badges: *Overdue by Nd*, *Due today*, *Due in Nd*, *Nd left*
- Overdue rows highlighted, plus loan detail view and one-click return
- Full return history, newest first

### Inventory management
- Admin view with a searchable inventory table (title, category, copies, on loan, available)
- Add, edit, and delete books
- Automatic ID generation with category prefixes (`IT-1`, `SCI-2`, `ENG-3`, `SS-4`)
- Guard rails: copy count can't be set below the number of active loans, and deleting a book that's on loan warns you first
- Inventory and circulation share one live data set, so changes appear instantly everywhere

### Experience
- Light and dark themes, remembered across sessions
- Responsive layout for desktop, tablet, and mobile (breakpoints at 900px and 640px)
- Toast notifications and confirmation dialogs for every destructive action
- Modals close on `Esc` or by clicking the backdrop
- Respects `prefers-reduced-motion`
- All user-supplied text is HTML-escaped before rendering
- No frameworks, no packages, no build step — just three files

---

## 🔐 Demo account

| Username | Password |
| -------- | -------- |
| `admin`  | `admin123` |

The account is seeded automatically the first time the app loads in a fresh browser. You can also create your own account from the **Create account** tab.

---

## 🚀 Getting started

### Option 1 — Open the file directly

```bash
git clone https://github.com/Ashborn1/LMS.git
cd LMS
open index.html        # macOS
# start index.html     # Windows
# xdg-open index.html  # Linux
```

### Option 2 — Serve it locally (recommended)

A local server gives you a stable origin for `localStorage` and cleaner browser behavior:

```bash
# Python (built into most systems)
python3 -m http.server 8000

# or Node.js
npx serve .
```

Then visit <http://localhost:8000>.

There is nothing to install, compile, or configure.

---

## 🧭 How to use it

1. **Sign in** with the demo account or create your own.
2. **Browse the Library** — filter by subject, search, sort, and inspect availability.
3. **Borrow a book** — click *Borrow* on any available card, fill in the borrower and loan details, pick a due date (or hit a preset), and confirm.
4. **Track loans** — the **Loans** section shows active loans with due-date status. Open *View* for the full record, or *Return* to check a book back in.
5. **Review history** — switch to the **History** tab to see every returned loan.
6. **Manage inventory** — open the **Admin** tab to add, edit, or delete titles and set copy counts.
7. **Tune behavior** — use the ⚙️ settings button to change the default loan period or make the student ID optional.

---

## ⌨️ Keyboard shortcuts

| Key      | Action                                  |
| -------- | --------------------------------------- |
| `/`      | Focus the catalog search (Library view) |
| `Esc`    | Close any open modal                    |

---

## 🗂️ Project structure

```
LMS/
├── index.html    # Markup: auth screen, app shell, library + admin views, all modals
├── styles.css    # Design tokens, light/dark themes, components, responsive rules
├── script.js     # State, auth, rendering, borrowing, inventory, events, init
└── README.md
```

`script.js` is organized into 20 numbered sections — config, helpers, toasts, auth, state, theme, stats, catalog, loans, admin, modals, and initialization — so it stays easy to navigate.

---

## 💾 Data & storage

All data lives in the browser's `localStorage` under three keys:

| Key           | Contents                                                        |
| ------------- | --------------------------------------------------------------- |
| `lms_v4`      | Books, active loans, return history, theme, and settings        |
| `lms_users`   | Registered accounts and password hashes                         |
| `lms_session` | The signed-in user (written to `sessionStorage` when "Remember me" is off) |

A book record looks like:

```js
{ id: "IT-1", category: "IT", title: "Cybersecurity Essentials", copies: 10 }
```

A loan record looks like:

```js
{
  id: "L1712345678901-x9k2a",
  bookId: "IT-1",
  borrower: {
    name: "Juan Dela Cruz",
    type: "Student",
    studentId: "2024-00123",
    section: "BSIT 2-A",
    gender: "",
    contact: "juan@example.com"
  },
  date: "2026-10-21T08:00:00.000Z",
  dueDate: "2026-11-04T08:00:00.000Z",
  notes: "",
  returnedAt: null
}
```

Returned loans move from `loans` into `history` with a `returnedAt` timestamp.

> **Data is per browser and per device.** There's no backend sync, and clearing site data or using a different browser/profile starts you fresh. The **Reset** button clears loans and history but keeps your inventory untouched.

---

## ⚙️ Customization

| What                          | Where                                                                    |
| ----------------------------- | ------------------------------------------------------------------------ |
| Seed catalog                  | `DEFAULT_BOOKS` in `script.js`                                           |
| Categories                    | `CATEGORIES` in `script.js`, plus the `<select>` options in `index.html` |
| Category icons and accents    | `CATEGORY_ICONS`, `CATEGORY_COLORS`, and `CATEGORY_PREFIX` in `script.js` |
| Default loan period           | `DEFAULT_SETTINGS.loanDays`, or in-app via ⚙️ Settings                    |
| Theme colors, fonts, spacing  | CSS custom properties in `:root` and `[data-theme="dark"]` in `styles.css` |
| Storage keys / schema version | `STORAGE_KEY`, `USERS_KEY`, `SESSION_KEY` in `script.js`                  |

**To reseed the catalog:** edit `DEFAULT_BOOKS`, then clear the site's local storage (DevTools → Application → Local Storage) — or bump `STORAGE_KEY` from `lms_v4` to `lms_v5` — and reload.

---

## 🌐 Browser support

Works in current versions of Chrome, Edge, Firefox, and Safari. It relies on modern standards only: CSS custom properties, `localStorage` / `sessionStorage`, `matchMedia`, and custom modal overlays built from plain elements. No polyfills or transpilation required.

---

## ⚠️ Notes & limitations

This is a **front-end demo**, not a production circulation system:

- Accounts and passwords live in `localStorage` and are hashed with a simple non-cryptographic function. Never use real credentials or real patron data here.
- All accounts on the same browser share one inventory and one loan ledger; accounts only control sign-in.
- Duplicate copy counts aren't tracked per physical copy — availability is calculated as `copies − active loans`.
- There is no multi-device sync, backup, import/export, or server-side validation.

For real deployment, move accounts, authentication, and records to a backend with proper password hashing and per-user authorization.

---

## 📄 License

No license has been specified for this project. Contact the repository owner before reusing or redistributing it.
