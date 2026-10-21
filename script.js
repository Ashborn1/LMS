/* ============================================================
   1. CONFIG & DEFAULT DATA
   ============================================================ */
const CATEGORY_ICONS = {
  "IT": "💻",
  "Science": "🔬",
  "English": "📖",
  "Social Studies": "🌏"
};

const CATEGORY_COLORS = {
  "All": "linear-gradient(135deg,#4f46e5,#7c3aed)",
  "IT": "#3b82f6",
  "Science": "#10b981",
  "English": "#f59e0b",
  "Social Studies": "#8b5cf6"
};

const CATEGORIES = ["All", "IT", "Science", "English", "Social Studies"];
const CATEGORY_PREFIX = { "IT":"IT", "Science":"SCI", "English":"ENG", "Social Studies":"SS" };

const DEFAULT_BOOKS = [
  { id:"IT-1",  category:"IT",             title:"Cybersecurity Essentials",        author:"William Stallings",       copies:10 },
  { id:"IT-2",  category:"IT",             title:"Networking Fundamentals",         author:"Behrouz A. Forouzan",     copies:8  },
  { id:"IT-3",  category:"IT",             title:"IT Fundamentals",                 author:"Efraim Turban",           copies:12 },
  { id:"IT-4",  category:"IT",             title:"Web Development",                 author:"Jon Duckett",             copies:7  },
  { id:"IT-5",  category:"IT",             title:"Human-Computer Interaction",      author:"Alan Dix",                copies:5  },
  { id:"SCI-1", category:"Science",        title:"General Biology",                 author:"Sylvia S. Mader",         copies:9  },
  { id:"SCI-2", category:"Science",        title:"Chemistry Basics",                author:"Raymond Chang",           copies:8  },
  { id:"SCI-3", category:"Science",        title:"Physics Principles",              author:"Douglas C. Giancoli",     copies:7  },
  { id:"SCI-4", category:"Science",        title:"Earth and Space Science",         author:"Edward J. Tarbuck",       copies:6  },
  { id:"SCI-5", category:"Science",        title:"Environmental Science",           author:"G. Tyler Miller",         copies:5  },
  { id:"ENG-1", category:"English",        title:"English Grammar and Composition", author:"John E. Warriner",        copies:12 },
  { id:"ENG-2", category:"English",        title:"World Literature",                author:"David Damrosch",          copies:8  },
  { id:"ENG-3", category:"English",        title:"Creative Writing",                author:"Janet Burroway",          copies:6  },
  { id:"ENG-4", category:"English",        title:"Reading Comprehension",           author:"Linda Hoyt",              copies:10 },
  { id:"ENG-5", category:"English",        title:"Public Speaking",                 author:"Stephen E. Lucas",        copies:5  },
  { id:"SS-1",  category:"Social Studies", title:"Philippine History",              author:"Renato Constantino",      copies:10 },
  { id:"SS-2",  category:"Social Studies", title:"World History",                   author:"William J. Duiker",       copies:8  },
  { id:"SS-3",  category:"Social Studies", title:"Geography",                       author:"James M. Rubenstein",     copies:7  },
  { id:"SS-4",  category:"Social Studies", title:"Economics",                       author:"Paul A. Samuelson",       copies:6  },
  { id:"SS-5",  category:"Social Studies", title:"Government and Civics",           author:"James Q. Wilson",         copies:5  }
];

const STORAGE_KEY  = "lms_v6";
const USERS_KEY    = "lms_users";
const SESSION_KEY  = "lms_session";

const DEFAULT_SETTINGS = { loanDays: 14, requireStudentId: true };

/* ============================================================
   2. HELPERS
   ============================================================ */
const $ = id => document.getElementById(id);
const bookById      = id => state.books.find(b => b.id === id);
const borrowedCount = id => state.loans.filter(l => l.bookId === id).length;
const slug          = s => s.toLowerCase().replace(/\s+/g, "-");

const escapeHtml = s => String(s).replace(/[&<>"']/g,
  c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

function highlight(text, query){
  const safe = escapeHtml(text);
  const q = (query || "").trim();
  if(!q) return safe;
  const pattern = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safe.replace(new RegExp(`(${pattern})`, "ig"), "<mark>$1</mark>");
}
function fmtDateTime(iso){
  if(!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month:"short", day:"numeric", year:"numeric",
    hour:"numeric", minute:"2-digit"
  });
}
function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
function daysUntil(iso){
  const due = startOfDay(iso).getTime();
  const now = startOfDay(new Date()).getTime();
  return Math.round((due - now) / 86400000);
}
function toLocalInput(d){
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   3. TOASTS
   ============================================================ */
const TOAST_ICONS = { success:"✓", error:"✕", info:"ℹ" };
function toast(message, type = "success"){
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || "•"}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Dismiss">✕</button>
  `;
  $("toasts").appendChild(el);
  const remove = () => {
    el.classList.add("out");
    el.addEventListener("animationend", () => el.remove(), { once:true });
    setTimeout(() => el.remove(), 400);
  };
  el.querySelector(".toast-close").addEventListener("click", remove);
  setTimeout(remove, 3500);
}

/* ============================================================
   4. AUTH
   ============================================================ */
function hashPassword(pwd){
  let h = 5381;
  for(let i = 0; i < pwd.length; i++) h = ((h << 5) + h) ^ pwd.charCodeAt(i);
  return String(h >>> 0);
}
function getUsers(){ try{ return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch(e){ return []; } }
function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function seedDefaultUser(){
  const users = getUsers();
  if(users.length === 0){
    users.push({
      username: "admin", name: "Administrator",
      passwordHash: hashPassword("admin123"),
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }
}
function getSession(){
  const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if(!raw) return null;
  try{
    const u = JSON.parse(raw);
    return (u && u.username) ? u : null;
  }catch(e){ clearSession(); return null; }
}
function setSession(user, remember){
  const payload = JSON.stringify({
    username: user.username, name: user.name, loginAt: new Date().toISOString()
  });
  if(remember) localStorage.setItem(SESSION_KEY, payload);
  else sessionStorage.setItem(SESSION_KEY, payload);
}
function clearSession(){
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
function showAuthError(el, msg){ el.textContent = msg; el.classList.add("show"); }
function clearAuthError(el){ el.textContent = ""; el.classList.remove("show"); }

function switchAuthTab(tab){
  document.querySelectorAll(".auth-tab").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === tab));
  $("loginForm").hidden    = tab !== "login";
  $("registerForm").hidden = tab !== "register";
  clearAuthError($("loginError"));
  clearAuthError($("registerError"));
}
function showAuth(){
  $("appScreen").hidden = true;
  $("authScreen").hidden = false;
  $("loginForm").reset();
  $("registerForm").reset();
  $("rememberMe").checked = true;
  switchAuthTab("login");
  setTimeout(() => $("loginUser").focus(), 80);
}
function showApp(){
  const user = getSession();
  $("authScreen").hidden = true;
  $("appScreen").hidden = false;
  const display = (user && (user.name || user.username)) || "User";
  $("userName").textContent = display;
  $("userAvatar").textContent = display.trim().charAt(0).toUpperCase();
  renderAll();
}

function setupAuth(){
  seedDefaultUser();
  document.querySelectorAll(".auth-tab").forEach(btn => {
    btn.addEventListener("click", () => switchAuthTab(btn.dataset.tab));
  });
  document.querySelectorAll(".toggle-pass").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = $(btn.dataset.target);
      if(!input) return;
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      btn.textContent = isPass ? "🙈" : "👁";
    });
  });

  // LOGIN — case-sensitive username
  $("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    clearAuthError($("loginError"));
    const username = $("loginUser").value.trim();
    const password = $("loginPass").value;
    const remember = $("rememberMe").checked;
    if(!username || !password){
      showAuthError($("loginError"), "Please fill in both username and password.");
      return;
    }
    const user = getUsers().find(u => u.username === username);
    if(!user || user.passwordHash !== hashPassword(password)){
      showAuthError($("loginError"), "Invalid username or password.");
      return;
    }
    clearSession();
    setSession(user, remember);
    toast(`Welcome back, ${user.name || user.username}!`, "success");
    showApp();
  });

  // REGISTER — case-sensitive uniqueness
  $("registerForm").addEventListener("submit", e => {
    e.preventDefault();
    clearAuthError($("registerError"));
    const name     = $("regName").value.trim();
    const username = $("regUser").value.trim();
    const pass     = $("regPass").value;
    const confirm  = $("regPassConfirm").value;
    if(!name || !username || !pass){
      showAuthError($("registerError"), "Please fill in all fields."); return;
    }
    if(username.length < 3){
      showAuthError($("registerError"), "Username must be at least 3 characters."); return;
    }
    if(pass.length < 6){
      showAuthError($("registerError"), "Password must be at least 6 characters."); return;
    }
    if(pass !== confirm){
      showAuthError($("registerError"), "Passwords do not match."); return;
    }
    const users = getUsers();
    if(users.some(u => u.username === username)){
      showAuthError($("registerError"), "That username is already taken."); return;
    }
    users.push({ username, name, passwordHash: hashPassword(pass), createdAt: new Date().toISOString() });
    saveUsers(users);
    toast("Account created! You can now sign in.", "success");
    switchAuthTab("login");
    $("loginUser").value = username;
    $("loginPass").value = "";
    $("loginPass").focus();
  });

  $("logoutBtn").addEventListener("click", () => {
    clearSession();
    showAuth();
    toast("You have been signed out.", "info");
  });
}

/* ============================================================
   5. STATE
   ============================================================ */
let state = loadState();

function normalizeLoan(l){
  if(!l || typeof l !== "object" || !l.bookId || !l.date) return null;
  const borrower = (typeof l.borrower === "string")
    ? { name: l.borrower, type:"Student", studentId:"", section:"", gender:"", contact:"" }
    : { name:"", type:"Student", studentId:"", section:"", gender:"", contact:"", ...l.borrower };
  if(!borrower.name) return null;

  const extensions = Array.isArray(l.extensions)
    ? l.extensions.filter(e => e && e.oldDue && e.newDue && e.reason)
    : [];

  const edits = Array.isArray(l.edits)
    ? l.edits.filter(e => e && e.editedAt && e.reason)
    : [];

  return {
    id: l.id || ("L" + Date.now() + "-" + Math.random().toString(36).slice(2,7)),
    bookId: l.bookId,
    borrower,
    date: l.date,
    dueDate: l.dueDate || new Date(new Date(l.date).getTime() + 14*86400000).toISOString(),
    notes: l.notes || "",
    returnedAt: l.returnedAt || null,
    extensions,
    edits
  };
}
function normalizeBook(b){
  if(!b || !b.id || !b.title || !b.category || typeof b.copies !== "number") return null;
  return {
    id: b.id,
    title: b.title,
    author: typeof b.author === "string" ? b.author : "",
    category: b.category,
    copies: b.copies
  };
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      return {
        books: Array.isArray(d.books)
          ? d.books.map(normalizeBook).filter(Boolean)
          : DEFAULT_BOOKS.map(b => ({ ...b })),
        loans:   Array.isArray(d.loans)   ? d.loans.map(normalizeLoan).filter(Boolean)   : [],
        history: Array.isArray(d.history) ? d.history.map(normalizeLoan).filter(Boolean) : [],
        theme: d.theme === "dark" ? "dark" : "light",
        settings: { ...DEFAULT_SETTINGS, ...(d.settings || {}) }
      };
    }
  }catch(e){ console.warn("Could not load saved data:", e); }
  return {
    books: DEFAULT_BOOKS.map(b => ({ ...b })),
    loans: [], history: [], theme:"light",
    settings: { ...DEFAULT_SETTINGS }
  };
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e){ console.warn("Could not save data:", e); }
}

const ui = {
  category: "all", search: "", sort: "title-asc", availability: "all",
  tab: "active", view: "library"
};

/* ============================================================
   6. THEME
   ============================================================ */
function applyTheme(){
  document.documentElement.setAttribute("data-theme", state.theme);
  const btn = $("themeToggle");
  btn.textContent = state.theme === "dark" ? "☀️" : "🌙";
  btn.title = state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

/* ============================================================
   7. STATS
   ============================================================ */
const statPrev = {};
function initStats(){
  $("stats").innerHTML = `
    <div class="stat">
      <div class="stat-icon" style="--tint:#6366f1">📚</div>
      <div><div class="stat-label">Book titles</div><div class="stat-value" id="statTitles">0</div></div>
    </div>
    <div class="stat">
      <div class="stat-icon" style="--tint:#0ea5e9">📦</div>
      <div><div class="stat-label">Total copies</div><div class="stat-value" id="statCopies">0</div></div>
    </div>
    <div class="stat">
      <div class="stat-icon" style="--tint:#10b981">✅</div>
      <div><div class="stat-label">Available</div><div class="stat-value" id="statAvailable">0</div></div>
    </div>
    <div class="stat">
      <div class="stat-icon" style="--tint:#f43f5e">📕</div>
      <div><div class="stat-label">On loan</div><div class="stat-value" id="statLoans">0</div></div>
    </div>
  `;
}
function setStat(key, el, value){
  const from = statPrev[key] ?? 0;
  if(prefersReducedMotion || from === value){ statPrev[key] = value; el.textContent = value; return; }
  statPrev[key] = value;
  const start = performance.now(); const duration = 500;
  function step(t){
    const p = Math.min(1, (t - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (value - from) * eased);
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function updateStats(){
  const totalTitles = state.books.length;
  const totalCopies = state.books.reduce((s,b) => s + b.copies, 0);
  const borrowed    = state.loans.length;
  setStat("titles",    $("statTitles"),    totalTitles);
  setStat("copies",    $("statCopies"),    totalCopies);
  setStat("available", $("statAvailable"), totalCopies - borrowed);
  setStat("loans",     $("statLoans"),     borrowed);
}

/* ============================================================
   8. CATEGORY CHIPS
   ============================================================ */
function renderChips(){
  $("categoryChips").innerHTML = CATEGORIES.map(cat => {
    const key = cat === "All" ? "all" : cat;
    const active = ui.category === key;
    const count = cat === "All"
      ? state.books.length
      : state.books.filter(b => b.category === cat).length;
    const dotStyle = `background:${CATEGORY_COLORS[cat]}`;
    return `
      <button class="chip ${active ? "active" : ""}" data-cat="${key}" role="tab" aria-selected="${active}">
        <span class="chip-dot" style="${dotStyle}"></span>
        ${cat}
        <span class="chip-count">${count}</span>
      </button>
    `;
  }).join("");
}

/* ============================================================
   9. CATALOG
   ============================================================ */
let firstRender = true;
function getFilteredBooks(){
  const q = ui.search.trim().toLowerCase();
  const list = state.books.filter(b => {
    if(ui.category !== "all" && b.category !== ui.category) return false;
    if(q){
      const matches =
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q));
      if(!matches) return false;
    }
    const avail = b.copies - borrowedCount(b.id);
    if(ui.availability === "available" && avail <= 0) return false;
    if(ui.availability === "out" && avail > 0) return false;
    return true;
  });
  const availOf = b => b.copies - borrowedCount(b.id);
  switch(ui.sort){
    case "title-asc":  list.sort((a,b) => a.title.localeCompare(b.title)); break;
    case "title-desc": list.sort((a,b) => b.title.localeCompare(a.title)); break;
    case "author-asc": list.sort((a,b) => (a.author||"").localeCompare(b.author||"") || a.title.localeCompare(b.title)); break;
    case "author-desc":list.sort((a,b) => (b.author||"").localeCompare(a.author||"") || a.title.localeCompare(b.title)); break;
    case "avail-desc": list.sort((a,b) => availOf(b) - availOf(a)); break;
    case "avail-asc":  list.sort((a,b) => availOf(a) - availOf(b)); break;
    case "category":   list.sort((a,b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title)); break;
  }
  return list;
}
function bookCard(b, index){
  const out   = borrowedCount(b.id);
  const avail = b.copies - out;
  const pct   = b.copies ? Math.round((avail / b.copies) * 100) : 0;
  const barClass = pct >= 50 ? "high" : pct >= 20 ? "mid" : "low";
  const authorLine = b.author
    ? `<p class="book-author">${highlight(b.author, ui.search)}</p>`
    : `<p class="book-author" style="opacity:.5">by Unknown</p>`;
  return `
    <article class="book-card cat-${slug(b.category)}" style="--i:${index}">
      <div class="book-top">
        <div class="book-icon">${CATEGORY_ICONS[b.category] || "📗"}</div>
        <span class="cat-badge">${b.category}</span>
      </div>
      <h3 class="book-title">${highlight(b.title, ui.search)}</h3>
      ${authorLine}
      <div class="book-meta">
        <span>${avail} of ${b.copies} available</span>
        <span class="dot">·</span>
        <span>${out} out</span>
      </div>
      <div class="progress">
        <span class="progress-fill ${barClass}" style="width:${pct}%"></span>
      </div>
      <button class="btn borrow" data-id="${b.id}" ${avail === 0 ? "disabled" : ""}>
        ${avail === 0 ? "All copies borrowed" : "Borrow"}
      </button>
    </article>
  `;
}
function renderCatalog(){
  const list = getFilteredBooks();
  const grid = $("catalog");
  grid.classList.toggle("animate", firstRender);
  if(!list.length){
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>${state.books.length ? "No books found" : "Your catalog is empty"}</h3>
        <p>${state.books.length
          ? "Try a different search term or clear your filters."
          : "Head to the Admin tab to add your first book."}</p>
        ${state.books.length
          ? `<button class="btn ghost" id="clearFilters">Clear filters</button>`
          : `<button class="btn" onclick="switchView('admin')">Go to Admin</button>`}
      </div>
    `;
    firstRender = false;
    return;
  }
  grid.innerHTML = list.map(bookCard).join("");
  firstRender = false;
}

/* ============================================================
   10. LOANS RENDERING
   ============================================================ */
function statusFor(iso){
  const d = daysUntil(iso);
  if(d < 0)   return { text:`Overdue by ${Math.abs(d)}d`, cls:"overdue", overdue:true };
  if(d === 0) return { text:"Due today", cls:"soon" };
  if(d <= 3)  return { text:`Due in ${d}d`, cls:"soon" };
  return { text:`${d}d left`, cls:"ok" };
}
function borrowerMeta(b){
  return [b.type, b.section, b.studentId].filter(Boolean).map(escapeHtml).join(" · ");
}
function extBadge(loan){
  const n = (loan.extensions && loan.extensions.length) || 0;
  if(!n) return "";
  const latest = loan.extensions[loan.extensions.length - 1];
  const tip = latest.reason
    ? `Extended ${n}× — latest reason: ${latest.reason}`
    : `Extended ${n}×`;
  return `<span class="ext-badge" title="${escapeHtml(tip)}">↻ ${n}</span>`;
}
function notesBadge(loan){
  if(!loan.notes) return "";
  return `<span class="note-badge" title="Note: ${escapeHtml(loan.notes)}">📝</span>`;
}
function editsBadge(loan){
  const n = (loan.edits && loan.edits.length) || 0;
  if(!n) return "";
  const latest = loan.edits[loan.edits.length - 1];
  const tip = latest.reason
    ? `Edited ${n}× — latest reason: ${latest.reason}`
    : `Edited ${n}×`;
  return `<span class="edit-badge" title="${escapeHtml(tip)}">✏️ ${n}</span>`;
}
function cellBook(book, loan){
  const authorLine = book.author
    ? `<span class="cell-book-author">${escapeHtml(book.author)}</span>`
    : "";
  return `
    <div class="cell-book">
      <div class="cell-book-top">
        <span class="mini-icon cat-${slug(book.category)}">${CATEGORY_ICONS[book.category] || "📗"}</span>
        <span>${escapeHtml(book.title)}</span>
        ${loan ? notesBadge(loan) : ""}
      </div>
      ${authorLine}
    </div>
  `;
}
function loanRow(l){
  const book = bookById(l.bookId) || { title:"(removed book)", author:"", category:"IT" };
  const s = statusFor(l.dueDate);
  const meta = borrowerMeta(l.borrower);
  return `
    <tr class="${s.overdue ? "row-overdue" : ""}">
      <td>${cellBook(book, l)}</td>
      <td>
        <div class="borrower-cell">
          <span class="borrower-name">${escapeHtml(l.borrower.name)}</span>
          ${meta ? `<span class="borrower-meta">${meta}</span>` : ""}
        </div>
      </td>
      <td>${fmtDateTime(l.date)}</td>
      <td>${fmtDateTime(l.dueDate)}</td>
      <td><span class="status ${s.cls}">${s.text}</span>${extBadge(l)}</td>
      <td class="actions-cell">
        <button class="btn small ghost view" data-view="${l.id}">View</button>
        <button class="btn small ghost extend" data-extend="${l.id}">Extend</button>
        <button class="btn small ghost return" data-loan="${l.id}">Return</button>
      </td>
    </tr>
  `;
}
function historyRow(l){
  const book = bookById(l.bookId) || { title:"(removed book)", author:"", category:"IT" };
  const meta = borrowerMeta(l.borrower);
  return `
    <tr>
      <td>${cellBook(book, l)}</td>
      <td>
        <div class="borrower-cell">
          <span class="borrower-name">${escapeHtml(l.borrower.name)}</span>
          ${meta ? `<span class="borrower-meta">${meta}</span>` : ""}
        </div>
      </td>
      <td>${fmtDateTime(l.date)}</td>
      <td>${fmtDateTime(l.returnedAt)}</td>
      <td><span class="status ok">Returned</span>${extBadge(l)}${editsBadge(l)}</td>
      <td class="actions-cell">
        <button class="btn small ghost view" data-view="${l.id}">View</button>
        <button class="btn small ghost edit-history" data-edit-history="${l.id}">Edit</button>
        <button class="btn small ghost danger delete-history" data-delete-history="${l.id}">Delete</button>
      </td>
    </tr>
  `;
}
function emptyState(icon, title, text){
  return `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}
function renderLoans(){
  const panel = $("loansPanel");
  $("activeCount").textContent  = state.loans.length;
  $("historyCount").textContent = state.history.length;
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.tab === ui.tab));

  if(ui.tab === "active"){
    if(!state.loans.length){
      panel.innerHTML = emptyState("📭","No active loans",
        "Borrowed books and their due dates will appear here.");
      return;
    }
    const rows = state.loans.slice()
      .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(loanRow).join("");
    panel.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Book</th><th>Borrower</th><th>Borrowed</th>
              <th>Due</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  } else {
    if(!state.history.length){
      panel.innerHTML = emptyState("🕘","No history yet",
        "Returned books will be logged here.");
      return;
    }
    const rows = state.history.slice()
      .sort((a,b) => new Date(b.returnedAt || 0) - new Date(a.returnedAt || 0))
      .map(historyRow).join("");
    panel.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Book</th><th>Borrower</th><th>Borrowed</th><th>Returned</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }
}

/* ============================================================
   11. ADMIN — INVENTORY
   ============================================================ */
function renderAdminBooks(){
  const tbody = $("adminBooksBody");
  if(!tbody) return;
  const q = ($("adminSearch").value || "").trim().toLowerCase();
  const list = state.books.filter(b =>
    !q ||
    b.title.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q) ||
    (b.author && b.author.toLowerCase().includes(q))
  );
  if(!list.length){
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:32px;color:var(--muted)">
          ${state.books.length ? "No books match your search." : 'No books in inventory. Click "Add book" to get started.'}
        </td>
      </tr>
    `;
    return;
  }
  tbody.innerHTML = list.map(b => {
    const out   = borrowedCount(b.id);
    const avail = b.copies - out;
    const color = CATEGORY_COLORS[b.category] || "#64748b";
    const authorCell = b.author
      ? escapeHtml(b.author)
      : `<span style="color:var(--muted);font-style:italic">—</span>`;
    return `
      <tr>
        <td><strong>${escapeHtml(b.title)}</strong></td>
        <td>${authorCell}</td>
        <td><span class="cat-badge" style="--cat:${color}">${escapeHtml(b.category)}</span></td>
        <td>${b.copies}</td>
        <td>${out}</td>
        <td>${avail}</td>
        <td class="actions-cell">
          <button class="btn small ghost edit-book" data-id="${b.id}">Edit</button>
          <button class="btn small ghost danger delete-book" data-id="${b.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join("");
}
let editingBookId = null;
function openInventory(bookId = null){
  editingBookId = bookId;
  if(bookId){
    const book = bookById(bookId);
    if(!book) return;
    $("inventoryModalTitle").textContent = "Edit book";
    $("inventoryModalSub").textContent   = "Update this book's details";
    $("invTitle").value    = book.title;
    $("invAuthor").value   = book.author || "";
    $("invCategory").value = book.category;
    $("invCopies").value   = book.copies;
  } else {
    $("inventoryModalTitle").textContent = "Add book";
    $("inventoryModalSub").textContent   = "Add a new title to the catalog";
    $("invTitle").value    = "";
    $("invAuthor").value   = "";
    $("invCategory").value = "IT";
    $("invCopies").value   = 1;
  }
  $("invError").style.display = "none";
  $("inventoryModal").classList.add("open");
  setTimeout(() => $("invTitle").focus(), 80);
}
function closeInventory(){
  $("inventoryModal").classList.remove("open");
  editingBookId = null;
}
function showInvError(msg){ $("invError").textContent = msg; $("invError").style.display = "block"; }
function generateBookId(category){
  const prefix = CATEGORY_PREFIX[category] || "BK";
  let n = 1;
  while(state.books.some(b => b.id === `${prefix}-${n}`)) n++;
  return `${prefix}-${n}`;
}
function saveInventory(){
  const title    = $("invTitle").value.trim();
  const author   = $("invAuthor").value.trim();
  const category = $("invCategory").value;
  const copies   = parseInt($("invCopies").value, 10);
  if(!title){ showInvError("Please enter a title."); return; }
  if(!copies || copies < 1){ showInvError("Copies must be at least 1."); return; }
  if(editingBookId){
    const book = bookById(editingBookId);
    if(!book){ closeInventory(); return; }
    const out = borrowedCount(book.id);
    if(copies < out){
      showInvError(`Cannot set copies below ${out} — that many are currently on loan.`);
      return;
    }
    book.title    = title;
    book.author   = author;
    book.category = category;
    book.copies   = copies;
    toast(`Updated "${title}"`, "success");
  } else {
    state.books.push({ id: generateBookId(category), title, author, category, copies });
    toast(`Added "${title}"`, "success");
  }
  saveState();
  closeInventory();
  renderAll();
}
function deleteBook(bookId){
  const book = bookById(bookId);
  if(!book) return;
  const out = borrowedCount(bookId);
  const warning = out > 0 ? ` This book has ${out} active loan(s) — those loans will show as "(removed book)".` : "";
  openConfirm({
    title: `Delete "${book.title}"?`,
    message: `This will remove the book from the catalog.${warning}`,
    confirmText: "Delete book", danger: true
  }, () => {
    state.books = state.books.filter(b => b.id !== bookId);
    saveState();
    renderAll();
    toast(`Deleted "${book.title}"`, "success");
  });
}

/* ============================================================
   12. VIEW SWITCHING
   ============================================================ */
function switchView(view){
  ui.view = view;
  document.querySelectorAll(".view-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.view === view));
  $("libraryView").hidden = view !== "library";
  $("adminView").hidden   = view !== "admin";
  if(view === "admin") renderAdminBooks();
}

/* ============================================================
   13. BORROW MODAL
   ============================================================ */
let pendingBookId = null;
let recentCache = [];

function getRecentBorrowers(){
  const seen = new Map();
  const all = [...state.loans, ...state.history]
    .slice()
    .sort((a,b) => new Date(b.returnedAt || b.date) - new Date(a.returnedAt || a.date));
  for(const l of all){
    const key = (l.borrower.studentId || l.borrower.name).toLowerCase();
    if(!key) continue;
    if(!seen.has(key)) seen.set(key, l.borrower);
    if(seen.size >= 6) break;
  }
  return Array.from(seen.values());
}
function updateRequireIdLabel(){
  const isStudent = $("fType").value === "Student";
  $("reqStudentId").style.display =
    (isStudent && state.settings.requireStudentId) ? "" : "none";
}
function setPresetActive(days){
  document.querySelectorAll(".preset").forEach(p =>
    p.classList.toggle("active", Number(p.dataset.days) === days));
}
function applyPreset(days){
  const borrowedVal = $("fBorrowed").value || toLocalInput(new Date());
  const base = new Date(borrowedVal);
  const due  = new Date(base.getTime() + days * 86400000);
  $("fDue").value = toLocalInput(due);
  setPresetActive(days);
}
function openBorrow(bookId){
  const book = bookById(bookId);
  if(!book) return;
  const avail = book.copies - borrowedCount(bookId);
  if(avail <= 0) return;
  pendingBookId = bookId;
  $("borrowForm").reset();
  const now = new Date();
  const due = new Date(now.getTime() + state.settings.loanDays * 86400000);
  $("fBorrowed").value = toLocalInput(now);
  $("fDue").value      = toLocalInput(due);
  setPresetActive(state.settings.loanDays);
  const authorLine = book.author ? ` · <em>${escapeHtml(book.author)}</em>` : "";
  $("modalBookInfo").innerHTML = `
    <div class="mini-icon cat-${slug(book.category)}">${CATEGORY_ICONS[book.category] || "📗"}</div>
    <div>
      <div class="modal-book-title">${escapeHtml(book.title)}</div>
      <div class="modal-book-meta">${book.category}${authorLine} · ${avail} of ${book.copies} copies available</div>
    </div>
  `;
  recentCache = getRecentBorrowers();
  if(recentCache.length){
    $("recentBorrowers").hidden = false;
    $("recentList").innerHTML = recentCache.map((b, i) => `
      <button type="button" class="recent-chip" data-i="${i}">
        ${escapeHtml(b.name)}${b.section ? ` · ${escapeHtml(b.section)}` : ""}
      </button>
    `).join("");
  } else {
    $("recentBorrowers").hidden = true;
  }
  updateRequireIdLabel();
  $("modalError").style.display = "none";
  $("modal").classList.add("open");
  setTimeout(() => $("fName").focus(), 80);
}
function closeBorrow(){
  $("modal").classList.remove("open");
  pendingBookId = null;
}
function showModalError(msg){ $("modalError").textContent = msg; $("modalError").style.display = "block"; }
function validateBorrowForm(){
  const name = $("fName").value.trim();
  if(!name) return "Please enter the borrower's full name.";
  const type = $("fType").value;
  const sid  = $("fStudentId").value.trim();
  if(type === "Student" && state.settings.requireStudentId && !sid){
    return "Student ID number is required for students.";
  }
  const borrowedVal = $("fBorrowed").value;
  const dueVal      = $("fDue").value;
  if(!borrowedVal) return "Please set the date & time borrowed.";
  if(!dueVal)      return "Please set the date & time to return.";
  if(new Date(dueVal) <= new Date(borrowedVal)) return "Return date must be after the borrowed date.";
  return null;
}
function confirmBorrow(){
  const err = validateBorrowForm();
  if(err){ showModalError(err); return; }
  const book = bookById(pendingBookId);
  if(!book){ closeBorrow(); return; }
  if(book.copies - borrowedCount(book.id) <= 0){
    showModalError("Sorry, no copies are left for this book.");
    return;
  }
  const loan = {
    id: "L" + Date.now() + "-" + Math.random().toString(36).slice(2,7),
    bookId: book.id,
    borrower: {
      name:      $("fName").value.trim(),
      type:      $("fType").value,
      studentId: $("fStudentId").value.trim(),
      section:   $("fSection").value.trim(),
      gender:    $("fGender").value,
      contact:   $("fContact").value.trim()
    },
    date:    new Date($("fBorrowed").value).toISOString(),
    dueDate: new Date($("fDue").value).toISOString(),
    notes:   $("fNotes").value.trim(),
    returnedAt: null,
    extensions: [],
    edits: []
  };
  state.loans.push(loan);
  saveState();
  closeBorrow();
  renderAll();
  toast(`Borrowed "${book.title}" to ${loan.borrower.name}`, "success");
}

/* ============================================================
   14. DETAILS MODAL (active + history)
   ============================================================ */
let detailsLoanId = null;

function findLoanAnywhere(id){
  const active = state.loans.find(l => l.id === id);
  if(active) return { loan: active, isActive: true };
  const hist = state.history.find(l => l.id === id);
  if(hist) return { loan: hist, isActive: false };
  return null;
}

function renderDetailsBody(loan, isActive){
  const book = bookById(loan.bookId) || { title:"(removed book)", author:"", category:"IT" };
  const b = loan.borrower;
  const s = isActive ? statusFor(loan.dueDate) : { text:"Returned", cls:"ok" };
  const extensions = loan.extensions || [];
  const edits = loan.edits || [];

  const authorLine = book.author ? ` · <em>${escapeHtml(book.author)}</em>` : "";

  const notesHtml = loan.notes ? `
    <div class="detail-section">
      <div class="detail-section-title">Notes</div>
      <div class="notes-display">${escapeHtml(loan.notes)}</div>
    </div>
  ` : "";

  const extensionsHtml = extensions.length ? `
    <div class="detail-section">
      <div class="detail-section-head">
        <div class="detail-section-title">📅 Extension history</div>
        <span class="ext-count-pill">${extensions.length}×</span>
      </div>
      ${extensions.map(e => `
        <div class="extension-item">
          <div class="extension-row"><span>From</span><span>${fmtDateTime(e.oldDue)}</span></div>
          <div class="extension-row"><span>To</span><span>${fmtDateTime(e.newDue)}</span></div>
          <div class="extension-row"><span>Reason</span><span><strong>${escapeHtml(e.reason)}</strong></span></div>
          <div class="extension-row"><span>Recorded</span><span>${fmtDateTime(e.extendedAt)}${e.by ? ` · ${escapeHtml(e.by)}` : ""}</span></div>
        </div>
      `).join("")}
    </div>
  ` : "";

  const editsHtml = edits.length ? `
    <div class="detail-section">
      <div class="detail-section-head">
        <div class="detail-section-title">✏️ Edit history</div>
        <span class="edit-count-pill">${edits.length}×</span>
      </div>
      ${edits.map(e => `
        <div class="edit-item">
          <div class="edit-row"><span>Reason</span><span><strong>${escapeHtml(e.reason)}</strong></span></div>
          <div class="edit-row"><span>Edited</span><span>${fmtDateTime(e.editedAt)}${e.by ? ` · ${escapeHtml(e.by)}` : ""}</span></div>
        </div>
      `).join("")}
    </div>
  ` : "";

  $("detailsBody").innerHTML = `
    <div class="modal-book">
      <div class="mini-icon cat-${slug(book.category)}">${CATEGORY_ICONS[book.category] || "📗"}</div>
      <div>
        <div class="modal-book-title">${escapeHtml(book.title)}</div>
        <div class="modal-book-meta">${book.category}${authorLine}</div>
      </div>
    </div>
    <div class="detail-list">
      <div class="detail-row"><span class="detail-label">Author</span><span>${escapeHtml(book.author || "—")}</span></div>
      <div class="detail-row"><span class="detail-label">Borrower</span><span>${escapeHtml(b.name)}</span></div>
      <div class="detail-row"><span class="detail-label">Type</span><span>${escapeHtml(b.type || "—")}</span></div>
      <div class="detail-row"><span class="detail-label">Student / ID No.</span><span>${escapeHtml(b.studentId || "—")}</span></div>
      <div class="detail-row"><span class="detail-label">Section / Dept.</span><span>${escapeHtml(b.section || "—")}</span></div>
      <div class="detail-row"><span class="detail-label">Gender</span><span>${escapeHtml(b.gender || "—")}</span></div>
      <div class="detail-row"><span class="detail-label">Contact</span><span>${escapeHtml(b.contact || "—")}</span></div>
      <div class="detail-row"><span class="detail-label">Borrowed</span><span>${fmtDateTime(loan.date)}</span></div>
      <div class="detail-row"><span class="detail-label">Due</span><span>${fmtDateTime(loan.dueDate)}</span></div>
      ${loan.returnedAt ? `<div class="detail-row"><span class="detail-label">Returned</span><span>${fmtDateTime(loan.returnedAt)}</span></div>` : ""}
      <div class="detail-row"><span class="detail-label">Status</span><span class="status ${s.cls}">${s.text}</span></div>
    </div>
    ${notesHtml}
    ${extensionsHtml}
    ${editsHtml}
  `;

  $("detailsExtend").hidden = !isActive;
  $("detailsReturn").hidden = !isActive;
  $("detailsEditHistory").hidden = isActive;
  $("detailsDeleteHistory").hidden = isActive;
}

function openDetails(loanId){
  const result = findLoanAnywhere(loanId);
  if(!result) return;
  detailsLoanId = loanId;
  $("detailsTitle").textContent = result.isActive ? "Active loan details" : "Returned loan details";
  renderDetailsBody(result.loan, result.isActive);
  $("detailsModal").classList.add("open");
}
function closeDetails(){
  $("detailsModal").classList.remove("open");
  detailsLoanId = null;
}

/* ============================================================
   15. EDIT HISTORY RECORD
   ============================================================ */
let editingHistoryLoanId = null;

function openEditHistory(loanId){
  const loan = state.history.find(l => l.id === loanId);
  if(!loan) return;
  editingHistoryLoanId = loanId;

  const book = bookById(loan.bookId) || { title:"(removed book)", author:"", category:"IT" };
  const authorLine = book.author ? ` · ${escapeHtml(book.author)}` : "";
  $("editHistoryBookInfo").innerHTML = `
    <div class="mini-icon cat-${slug(book.category)}">${CATEGORY_ICONS[book.category] || "📗"}</div>
    <div>
      <div class="modal-book-title">${escapeHtml(book.title)}</div>
      <div class="modal-book-meta">${book.category}${authorLine}</div>
    </div>
  `;

  $("ehName").value      = loan.borrower.name || "";
  $("ehType").value      = loan.borrower.type || "Student";
  $("ehStudentId").value = loan.borrower.studentId || "";
  $("ehSection").value   = loan.borrower.section || "";
  $("ehGender").value    = loan.borrower.gender || "";
  $("ehContact").value   = loan.borrower.contact || "";

  $("ehBorrowed").value = toLocalInput(new Date(loan.date));
  $("ehDue").value      = toLocalInput(new Date(loan.dueDate));
  $("ehReturned").value = loan.returnedAt ? toLocalInput(new Date(loan.returnedAt)) : toLocalInput(new Date());

  $("ehNotes").value  = loan.notes || "";
  $("ehReason").value = "";
  $("ehError").style.display = "none";

  $("editHistoryModal").classList.add("open");
  setTimeout(() => $("ehName").focus(), 80);
}
function closeEditHistory(){
  $("editHistoryModal").classList.remove("open");
  editingHistoryLoanId = null;
}
function showEhError(msg){
  $("ehError").textContent = msg;
  $("ehError").style.display = "block";
}
function saveEditHistory(){
  const reason = $("ehReason").value.trim();
  if(!reason){ showEhError("Please provide a reason for editing this record."); return; }

  const loan = state.history.find(l => l.id === editingHistoryLoanId);
  if(!loan){ closeEditHistory(); return; }

  const name = $("ehName").value.trim();
  if(!name){ showEhError("Borrower name is required."); return; }

  const borrowedVal = $("ehBorrowed").value;
  const dueVal      = $("ehDue").value;
  const returnedVal = $("ehReturned").value;
  if(!borrowedVal || !dueVal || !returnedVal){
    showEhError("Please fill in all date fields."); return;
  }
  if(new Date(dueVal) <= new Date(borrowedVal)){
    showEhError("Due date must be after the borrowed date."); return;
  }
  if(new Date(returnedVal) < new Date(borrowedVal)){
    showEhError("Returned date cannot be before the borrowed date."); return;
  }

  loan.borrower.name      = name;
  loan.borrower.type      = $("ehType").value;
  loan.borrower.studentId = $("ehStudentId").value.trim();
  loan.borrower.section   = $("ehSection").value.trim();
  loan.borrower.gender    = $("ehGender").value;
  loan.borrower.contact   = $("ehContact").value.trim();
  loan.date        = new Date(borrowedVal).toISOString();
  loan.dueDate     = new Date(dueVal).toISOString();
  loan.returnedAt  = new Date(returnedVal).toISOString();
  loan.notes       = $("ehNotes").value.trim();

  if(!loan.edits) loan.edits = [];
  const user = getSession();
  loan.edits.push({
    editedAt: new Date().toISOString(),
    by: user ? user.username : "",
    reason
  });

  saveState();
  closeEditHistory();
  closeDetails();
  renderAll();
  toast("Loan record updated", "success");
}

/* ============================================================
   16. DELETE HISTORY RECORD
   ============================================================ */
function deleteHistoryLoan(loanId){
  const loan = state.history.find(l => l.id === loanId);
  if(!loan) return;
  const book = bookById(loan.bookId);
  openConfirm({
    title: "Delete this history record?",
    message: `This will permanently remove "${book ? book.title : "the loan"}" borrowed by ${loan.borrower.name} from the history log. This cannot be undone.`,
    confirmText: "Delete record",
    danger: true
  }, () => {
    state.history = state.history.filter(l => l.id !== loanId);
    saveState();
    closeDetails();
    renderAll();
    toast("History record deleted", "success");
  });
}

/* ============================================================
   17. EXTEND DUE DATE
   ============================================================ */
let extendingLoanId = null;
let extendBaseDue = null;

function openExtend(loanId){
  const loan = state.loans.find(l => l.id === loanId);
  if(!loan) return;
  extendingLoanId = loanId;
  extendBaseDue = new Date(loan.dueDate);

  const book = bookById(loan.bookId) || { title:"(removed book)", author:"", category:"IT" };
  const authorLine = book.author ? ` · ${escapeHtml(book.author)}` : "";
  $("extendBookInfo").innerHTML = `
    <div class="mini-icon cat-${slug(book.category)}">${CATEGORY_ICONS[book.category] || "📗"}</div>
    <div>
      <div class="modal-book-title">${escapeHtml(book.title)}</div>
      <div class="modal-book-meta">${escapeHtml(loan.borrower.name)}${authorLine}</div>
    </div>
  `;
  $("extendCurrentDue").textContent = fmtDateTime(loan.dueDate);

  const base = extendBaseDue > new Date() ? extendBaseDue : new Date();
  const newDue = new Date(base.getTime() + 7 * 86400000);
  $("extendNewDue").value = toLocalInput(newDue);
  $("extendReason").value = "";
  $("extendError").style.display = "none";
  document.querySelectorAll("#extendPresetRow .preset").forEach(p => p.classList.remove("active"));

  $("extendModal").classList.add("open");
  setTimeout(() => $("extendReason").focus(), 80);
}
function closeExtend(){
  $("extendModal").classList.remove("open");
  extendingLoanId = null;
  extendBaseDue = null;
}
function applyExtendPreset(days){
  const base = extendBaseDue && extendBaseDue > new Date() ? extendBaseDue : new Date();
  const newDue = new Date(base.getTime() + days * 86400000);
  $("extendNewDue").value = toLocalInput(newDue);
  document.querySelectorAll("#extendPresetRow .preset").forEach(p =>
    p.classList.toggle("active", Number(p.dataset.days) === days));
}
function showExtendError(msg){
  $("extendError").textContent = msg;
  $("extendError").style.display = "block";
}
function confirmExtend(){
  const reason = $("extendReason").value.trim();
  const newDueVal = $("extendNewDue").value;

  if(!newDueVal){ showExtendError("Please set the new due date."); return; }
  if(!reason){ showExtendError("Please provide a reason for extending the due date."); return; }

  const loan = state.loans.find(l => l.id === extendingLoanId);
  if(!loan){ closeExtend(); return; }

  const newDue = new Date(newDueVal);
  const oldDue = new Date(loan.dueDate);
  if(newDue <= oldDue){
    showExtendError("New due date must be later than the current due date.");
    return;
  }

  const user = getSession();
  if(!loan.extensions) loan.extensions = [];
  loan.extensions.push({
    oldDue:     loan.dueDate,
    newDue:     newDue.toISOString(),
    reason,
    extendedAt: new Date().toISOString(),
    by:         user ? user.username : ""
  });
  loan.dueDate = newDue.toISOString();

  const loanId = loan.id;
  saveState();
  closeExtend();
  closeDetails();
  renderAll();
  toast(`Due date extended — new due: ${fmtDateTime(loan.dueDate)}`, "success");
  setTimeout(() => openDetails(loanId), 120);
}

/* ============================================================
   18. RETURN
   ============================================================ */
function returnLoan(loanId){
  const idx = state.loans.findIndex(l => l.id === loanId);
  if(idx === -1) return;
  const loan = state.loans[idx];
  state.loans.splice(idx, 1);
  state.history.push({ ...loan, returnedAt: new Date().toISOString() });
  saveState();
  renderAll();
  const book = bookById(loan.bookId);
  toast(`Returned "${book ? book.title : "book"}" from ${loan.borrower.name}`, "success");
}

/* ============================================================
   19. SETTINGS
   ============================================================ */
function openSettings(){
  $("setLoanDays").value = state.settings.loanDays;
  $("setRequireId").checked = state.settings.requireStudentId;
  $("settingsModal").classList.add("open");
}
function closeSettings(){ $("settingsModal").classList.remove("open"); }

/* ============================================================
   20. CONFIRM MODAL
   ============================================================ */
let confirmAction = null;
function openConfirm({ title, message, confirmText = "Confirm", danger = false }, cb){
  $("confirmTitle").textContent = title || "Confirm";
  $("confirmMessage").textContent = message || "";
  const ok = $("confirmOk");
  ok.textContent = confirmText;
  ok.className = "btn" + (danger ? " danger" : "");
  confirmAction = cb;
  $("confirmModal").classList.add("open");
  setTimeout(() => ok.focus(), 80);
}
function closeConfirm(){
  $("confirmModal").classList.remove("open");
  confirmAction = null;
}

/* ============================================================
   21. RENDER ALL
   ============================================================ */
function renderAll(){
  updateStats();
  renderChips();
  renderCatalog();
  renderLoans();
  renderAdminBooks();
}

/* ============================================================
   22. EVENT WIRING
   ============================================================ */
function setupAppEvents(){
  $("themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    applyTheme();
  });
  $("settingsBtn").addEventListener("click", openSettings);

  $("viewTabs").addEventListener("click", e => {
    const tab = e.target.closest(".view-tab");
    if(tab) switchView(tab.dataset.view);
  });

  $("categoryChips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    ui.category = chip.dataset.cat;
    renderChips();
    renderCatalog();
  });

  $("catalog").addEventListener("click", e => {
    const borrowBtn = e.target.closest("button.borrow");
    if(borrowBtn){ openBorrow(borrowBtn.dataset.id); return; }
    if(e.target.closest("#clearFilters")){
      ui.category = "all"; ui.search = ""; ui.availability = "all";
      $("search").value = ""; $("clearSearch").hidden = true;
      $("availSelect").value = "all";
      renderChips(); renderCatalog();
    }
  });

  const searchInput = $("search");
  searchInput.addEventListener("input", () => {
    ui.search = searchInput.value;
    $("clearSearch").hidden = !ui.search;
    renderCatalog();
  });
  $("clearSearch").addEventListener("click", () => {
    searchInput.value = ""; ui.search = ""; $("clearSearch").hidden = true;
    searchInput.focus(); renderCatalog();
  });
  $("sortSelect").addEventListener("change", e => { ui.sort = e.target.value; renderCatalog(); });
  $("availSelect").addEventListener("change", e => { ui.availability = e.target.value; renderCatalog(); });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => { ui.tab = tab.dataset.tab; renderLoans(); });
  });

  // Loans panel: view / extend / return / edit history / delete history
  $("loansPanel").addEventListener("click", e => {
    const v = e.target.closest("button.view");
    if(v){ openDetails(v.dataset.view); return; }
    const ext = e.target.closest("button.extend");
    if(ext){ openExtend(ext.dataset.extend); return; }
    const r = e.target.closest("button.return");
    if(r){ returnLoan(r.dataset.loan); return; }
    const eh = e.target.closest("button.edit-history");
    if(eh){ openEditHistory(eh.dataset.editHistory); return; }
    const dh = e.target.closest("button.delete-history");
    if(dh){ deleteHistoryLoan(dh.dataset.deleteHistory); }
  });

  $("borrowForm").addEventListener("submit", e => { e.preventDefault(); confirmBorrow(); });
  $("cancelBorrow").addEventListener("click", closeBorrow);
  $("closeBorrow").addEventListener("click", closeBorrow);
  $("fType").addEventListener("change", updateRequireIdLabel);
  $("fBorrowed").addEventListener("input", () => {
    if(!$("fBorrowed").value) return;
    const active = document.querySelector(".preset.active");
    const days = active ? Number(active.dataset.days) : state.settings.loanDays;
    const base = new Date($("fBorrowed").value);
    const due  = new Date(base.getTime() + days * 86400000);
    $("fDue").value = toLocalInput(due);
  });
  $("fDue").addEventListener("input", () => setPresetActive(null));
  $("presetRow").addEventListener("click", e => {
    const p = e.target.closest(".preset");
    if(p) applyPreset(Number(p.dataset.days));
  });
  $("recentList").addEventListener("click", e => {
    const btn = e.target.closest(".recent-chip");
    if(!btn) return;
    const b = recentCache[Number(btn.dataset.i)];
    if(!b) return;
    $("fName").value      = b.name || "";
    $("fType").value      = b.type || "Student";
    $("fStudentId").value = b.studentId || "";
    $("fSection").value   = b.section || "";
    $("fGender").value    = b.gender || "";
    $("fContact").value   = b.contact || "";
    updateRequireIdLabel();
    $("fName").focus();
  });

  $("addBookBtn").addEventListener("click", () => openInventory(null));
  $("adminSearch").addEventListener("input", renderAdminBooks);
  $("adminBooksBody").addEventListener("click", e => {
    const edit = e.target.closest("button.edit-book");
    if(edit){ openInventory(edit.dataset.id); return; }
    const del = e.target.closest("button.delete-book");
    if(del){ deleteBook(del.dataset.id); }
  });
  $("inventoryForm").addEventListener("submit", e => { e.preventDefault(); saveInventory(); });
  $("cancelInventory").addEventListener("click", closeInventory);
  $("closeInventory").addEventListener("click", closeInventory);

  // Details modal actions
  $("closeDetails").addEventListener("click", closeDetails);
  $("detailsClose").addEventListener("click", closeDetails);
  $("detailsExtend").addEventListener("click", () => {
    const id = detailsLoanId;
    closeDetails();
    if(id) openExtend(id);
  });
  $("detailsReturn").addEventListener("click", () => {
    const id = detailsLoanId;
    closeDetails();
    if(id) returnLoan(id);
  });
  $("detailsEditHistory").addEventListener("click", () => {
    const id = detailsLoanId;
    closeDetails();
    if(id) openEditHistory(id);
  });
  $("detailsDeleteHistory").addEventListener("click", () => {
    const id = detailsLoanId;
    if(id) deleteHistoryLoan(id);
  });

  // Edit history modal
  $("editHistoryForm").addEventListener("submit", e => { e.preventDefault(); saveEditHistory(); });
  $("cancelEditHistory").addEventListener("click", closeEditHistory);
  $("closeEditHistory").addEventListener("click", closeEditHistory);

  // Extend modal
  $("extendForm").addEventListener("submit", e => { e.preventDefault(); confirmExtend(); });
  $("cancelExtend").addEventListener("click", closeExtend);
  $("closeExtend").addEventListener("click", closeExtend);
  $("extendPresetRow").addEventListener("click", e => {
    const p = e.target.closest(".preset");
    if(p) applyExtendPreset(Number(p.dataset.days));
  });
  $("extendNewDue").addEventListener("input", () => {
    document.querySelectorAll("#extendPresetRow .preset").forEach(p => p.classList.remove("active"));
  });

  // Settings
  $("closeSettings").addEventListener("click", closeSettings);
  $("settingsClose").addEventListener("click", closeSettings);
  $("settingsSave").addEventListener("click", () => {
    const days = Math.max(1, Math.min(365, parseInt($("setLoanDays").value, 10) || 14));
    state.settings.loanDays = days;
    state.settings.requireStudentId = $("setRequireId").checked;
    saveState();
    closeSettings();
    toast("Settings saved", "success");
  });

  // Confirm
  $("confirmOk").addEventListener("click", () => {
    const cb = confirmAction;
    closeConfirm();
    if(cb) cb();
  });
  $("confirmCancel").addEventListener("click", closeConfirm);

  // Click-outside to close
  ["modal","inventoryModal","detailsModal","editHistoryModal","extendModal","settingsModal","confirmModal"].forEach(id => {
    $(id).addEventListener("click", e => {
      if(e.target === $(id)) $(id).classList.remove("open");
    });
  });

  // Reset (loans + history only)
  $("resetBtn").addEventListener("click", () => {
    openConfirm({
      title: "Reset loans & history?",
      message: "This clears all active loans and history records. Your book inventory stays intact.",
      confirmText: "Reset records", danger: true
    }, () => {
      state.loans = []; state.history = [];
      saveState(); renderAll();
      toast("Loans and history cleared", "info");
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    const typing = ["INPUT","SELECT","TEXTAREA"].includes(document.activeElement.tagName);
    if(e.key === "/" && !typing && ui.view === "library"){
      e.preventDefault(); $("search").focus();
    }
    if(e.key === "Escape"){
      ["modal","inventoryModal","detailsModal","editHistoryModal","extendModal","settingsModal","confirmModal"].forEach(id =>
        $(id).classList.remove("open"));
    }
  });
}

/* ============================================================
   23. INIT
   ============================================================ */
function init(){
  applyTheme();
  initStats();
  renderAll();
  $("headerDate").textContent = new Date().toLocaleDateString(undefined, {
    weekday:"long", month:"long", day:"numeric", year:"numeric"
  });
  setupAppEvents();
  setupAuth();
  if(getSession()) showApp();
  else showAuth();
}
init();