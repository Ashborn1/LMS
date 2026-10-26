# 📚 Library Management System

A small, dependency-free library circulation desk that runs entirely in the browser. Sign in, browse the catalog, record a borrowing with a borrower name and due date, and check books back in.

The project is deliberately minimal: three files, no frameworks, no packages, and no build step. Open `index.html` and it works. Loans and the signed-in user are kept in `localStorage`, so the app remembers them between visits.

> **Status:** working prototype. The core circulation flow — sign in → borrow → track → return — is complete. Features such as search, borrower records beyond a name, return history, and inventory editing are **not** implemented yet. See [Possible next steps](#-possible-next-steps).

---

## ✨ Features

### Accounts & access
- Sign-in screen with a single administrator account
- Inline error message on a failed sign-in
- Session persisted in `localStorage`, so a signed-in user stays signed in after a refresh
- Log out clears the stored session and returns to the sign-in screen

### Catalog
- 20 seeded titles across 4 subjects — IT, Science, English, and Social Studies — for a total of **154 copies**
- Responsive card grid showing each title, its subject, and live availability (`N of M available`)
- Availability is recalculated on every render from the book's copy count minus its active loans
- The **Borrow** button is disabled automatically once every copy of a title is on loan

### Borrowing & returns
- Borrow dialog with a borrower name and a due date
- The due date pre-fills to 14 days ahead and can be changed
- Validation rejects an empty borrower name or due date, and blocks borrowing when no copies remain
- **Active Loans** table listing the book, borrower, and due date
- One-click **Return**, which removes the loan and immediately returns the copy to available stock
- "No active loans." empty state when the ledger is clear

### Interface
- Single light theme built on system fonts
- Responsive card grid (`auto-fill`, `minmax(220px, 1fr)`) that reflows down to phone width
- Centered sign-in card, plus a simple header showing the current user and a Log out button
- No frameworks, no packages, no build step — just three files

---

## 🔐 Demo account

| Username | Password |
| -------- | -------- |
| `admin`  | `admin123` |

These credentials are hard-coded in the login handler in `script.js` and are shown as input placeholders on the sign-in screen. There is **no registration** — the account above is the only way in.

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

1. **Sign in** with `admin` / `admin123`.
2. **Browse the catalog** — every title shows its subject and how many copies are available.
3. **Borrow a book** — click *Borrow* on any available card, enter the borrower's name, adjust the due date if needed, and confirm. The copy count drops by one immediately.
4. **Track loans** — the **Active Loans** table lists each loan's book, borrower, and due date.
5. **Return a book** — click *Return* on a loan row. The loan is removed and the copy becomes available again.
6. **Log out** when finished. Your loans stay in the browser for the next visit.

---

## 🗂️ Project structure

```
LMS/
├── index.html    # Markup: sign-in screen, app shell, book grid, loans table, borrow dialog
├── styles.css    # Layout, card grid, table, dialog styling
├── script.js     # Book data, state, rendering, borrowing, returns, sign-in
└── README.md
```

`script.js` is about 130 lines and is organised into commented sections: books, state, render, borrow, login, and start.

---

## 💾 Data & storage

All data lives in the browser's `localStorage` under two keys:

| Key     | Contents                                        |
| ------- | ----------------------------------------------- |
| `loans` | JSON array of active loans                       |
| `user`  | The signed-in username (removed on log out)      |

A book record looks like this (held in the `BOOKS` constant in `script.js`, not in storage):

```js
{ id: 1, title: "Cybersecurity Essentials", cat: "IT", copies: 10 }
```

A loan record looks like this:

```js
{
  id: 1712345678901,          // Date.now() at borrow time
  bookId: 1,                  // matches a BOOKS id
  borrower: "Juan Dela Cruz",
  due: "2026-11-09"           // date-only string from the date input
}
```

Availability for a title is `copies − (number of active loans for that book)`. Returning a loan **deletes** the record — there is no return history.

> **Data is per browser and per device.** There is no backend sync, and clearing site data or using a different browser/profile starts you fresh. Because the catalog lives in code rather than storage, clearing storage only clears loans.

---

## ⚙️ Customization

| What                        | Where                                                            |
| --------------------------- | ---------------------------------------------------------------- |
| Catalog (titles, subject, copy counts) | the `BOOKS` array at the top of `script.js`            |
| Categories                  | the `cat` values in `BOOKS` (IT, Science, English, Social Studies) |
| Default due date offset     | `due.setDate(due.getDate() + 14)` in `openBorrow()`               |
| Credentials                 | the `u === "admin" && p === "admin123"` check in the login handler |
| Colors, spacing, layout     | the rules in `styles.css`                                         |
| Storage keys                | the `"loans"` and `"user"` string literals in `script.js`          |

Changing `BOOKS` takes effect immediately on reload — no storage clear needed, since the catalog isn't persisted.

---

## 🌐 Browser support

Works in current versions of Chrome, Edge, Firefox, and Safari. It relies only on standard features: CSS Grid, `localStorage`, and `Date`. No polyfills or transpilation required.

---

## ⚠️ Notes & limitations

This is a **front-end demo**, not a production circulation system:

- The username and password are hard-coded in `script.js` and visible to anyone who views the source. Never use real credentials here.
- There is no server, so there is no real authentication, authorization, or data validation beyond the browser.
- Only a borrower **name** is recorded — no borrower type, ID number, section, or contact details.
- The due date is a date only (no time), and due dates are stored but never acted on: there is no overdue flagging or reminder.
- Loans are tracked per title, not per physical copy.
- Returning a loan deletes it, so there is no history and no undo.
- The catalog cannot be edited in the app — titles and copy counts are changed in code.
- There is no search, sorting, filtering, or pagination; all 20 titles render at once.
- One light theme only; no dark mode.
- No multi-device sync, backup, import, or export.

---

## 🗺️ Possible next steps

- Record borrower type, student/ID number, section, and contact details
- Store returned loans separately to build a return history
- Flag overdue loans and sort active loans by nearest due date
- Add search, subject filters, and sorting to the catalog
- Add an admin view to create, edit, and delete titles and set copy counts
- Track copies individually and allow multiple copies per loan
- Add a light/dark theme toggle
- Move accounts and records to a backend with properly hashed passwords

---

## 📄 License

No license has been specified for this project. Contact the repository owner before reusing or redistributing it.
