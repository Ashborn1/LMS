// ---- Seed Data ----
const seedUsers = [
  { id: 1, name: "System Admin", username: "admin", password: "admin123", role: "Admin", is_archived: false },
  { id: 2, name: "Head Bookkeeper", username: "keeper", password: "keeper123", role: "Bookkeeper", is_archived: false },
  { id: 3, name: "Juan Dela Cruz", username: "student", password: "student123", role: "Student", studentNum: "2024-00123", section: "BSIT 2-A", is_archived: false },
  { id: 4, name: "Maria Clara", username: "maria", password: "maria123", role: "Student", studentNum: "2024-00124", section: "BSIT 2-B", is_archived: false },
  { id: 5, name: "Jose Rizal", username: "jose", password: "jose123", role: "Student", studentNum: "2023-00100", section: "BSCS 3-A", is_archived: false }
];

const seedBooks = [
  { id: 1, title: "Introduction to Computer Science", cat: "IT", copies: 5, author: "Jean-Claude Franchiotti", published: "2024", cover_url: "https://covers.openlibrary.org/b/isbn/9781711471839-L.jpg?default=false", reference_url: "https://openstax.org/details/books/introduction-computer-science", icon: "💻", summary: "An introductory survey of algorithms, data structures, computer systems, software development, cybersecurity, cloud computing, and machine learning, with practical exercises." },
  { id: 2, title: "Foundations of Information Systems", cat: "IT", copies: 8, author: "Mahesh S. Raisinghani", published: "2025", cover_url: "https://pictures.abebooks.com/isbn/9781711472959-us.jpg", reference_url: "https://openstax.org/details/books/foundations-information-systems", icon: "💻", summary: "Introduces hardware, software, databases, networks, and how organizations collect, process, store, and use information." },
  { id: 3, title: "Principles of Data Science", cat: "IT", copies: 6, author: "Shaun V. Ault", published: "2025", cover_url: "https://it-ebooks.dev/img/books/p/principles-of-data-science.big.webp", reference_url: "https://openstax.org/details/books/principles-data-science", icon: "💻", summary: "Explains data science principles through examples, Python code, datasets, and exercises, including discussions of data ethics and artificial intelligence." },
  { id: 4, title: "Introduction to Python Programming", cat: "IT", copies: 7, author: "Udayan Das", published: "2024", cover_url: "https://media.oceanofpdf.com/2024/06/PDF-EPUB-Introduction-to-Python-Programming-by-Udayan-Das-Download.jpg", reference_url: "https://openstax.org/details/books/introduction-python-programming", icon: "💻", summary: "Teaches Python fundamentals and problem-solving using activities, examples from multiple fields, and an interactive code runner." },
  { id: 5, title: "Python Crash Course, 3rd Edition", cat: "IT", copies: 4, author: "Eric Matthes", published: "2023", cover_url: "https://www.oreilly.com/library/cover/9781098156664/248w/?format=webp", reference_url: "https://www.oreilly.com/library/view/python-crash-course/9781098156664/", icon: "💻", summary: "A hands-on introduction to Python fundamentals followed by projects involving a game, data visualization, and a web application." },
  { id: 6, title: "Astronomy 2e", cat: "Science", copies: 9, author: "Andrew Fraknoi", published: "2022", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzcxMCwicHVyIjoiYmxvYl9pZCJ9fQ==--cbdb306abe88eedb165c11e31d22ee11edb4f5f0/cover.png", reference_url: "https://openstax.org/details/books/astronomy-2e", icon: "🧬", summary: "Introduces the solar system, stars, galaxies, and the universe using accessible explanations, illustrations, and everyday analogies." },
  { id: 7, title: "Anatomy and Physiology 2e", cat: "Science", copies: 7, author: "J. Gordon Betts", published: "2022", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzcwOSwicHVyIjoiYmxvYl9pZCJ9fQ==--abf1ae6641ab7cf070fec53710db59fa5ce44e18/cover.png", reference_url: "https://openstax.org/details/books/anatomy-and-physiology-2e", icon: "🧬", summary: "A body-systems-based introduction to human anatomy and physiology for life science and health students, supported by illustrations and interactive resources." },
  { id: 8, title: "College Physics 2e", cat: "Science", copies: 10, author: "Paul Peter Urone", published: "2022", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTA5ODMsInB1ciI6ImJsb2JfaWQifX0=--c17d4f0134e3e83baa88b3c1026dac6e9d2bdd1f/cover.png", reference_url: "https://openstax.org/details/books/college-physics-2e", icon: "🧬", summary: "Presents algebra-based physics through conceptual explanations, quantitative problems, and practical applications, including biological and medical examples." },
  { id: 9, title: "Organic Chemistry: A Tenth Edition", cat: "Science", copies: 12, author: "John McMurry", published: "2023", cover_url: "https://images.weserv.nl/?url=covers.vitalsource.com%2Fvbid%2F978-1-961584-30-3%2Fwidth%2F320%3Fstyle%3Dpreview&output=jpg", reference_url: "https://openstax.org/details/books/organic-chemistry", icon: "🧬", summary: "A two-semester organic chemistry text organized around functional groups, with worked examples and applications of chemical concepts." },
  { id: 10, title: "Introduction to Behavioral Neuroscience", cat: "Science", copies: 1, author: "Elizabeth D. Kirby", published: "2024", cover_url: "https://u.osu.edu/kirbylab/files/2024/11/book-cover-image-233x300.png", reference_url: "https://openstax.org/details/books/introduction-behavioral-neuroscience", icon: "🧬", summary: "Examines how the nervous system and environment influence behavior, thought, movement, and emotion, introducing neuroscience research and experiments." },
  { id: 11, title: "Writing Guide with Handbook", cat: "English", copies: 10, author: "Michelle Bachelor Robinson", published: "2021", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzMwMywicHVyIjoiYmxvYl9pZCJ9fQ==--2724ca58f77d6e837f243312ef248b80c5d83530/cover.jpg", reference_url: "https://openstax.org/details/books/writing-guide", icon: "📚", summary: "Covers writing processes, rhetorical genres, grammar, editing, usage, and citation for introductory composition courses." },
  { id: 12, title: "Advanced Community College ESL Composition", cat: "English", copies: 8, author: "Edgar Perez", published: "2020", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTUzMywicHVyIjoiYmxvYl9pZCJ9fQ==--328da93946fa7876337a1089ef42e4f971ac1334/Cover-Picture.jpg", reference_url: "https://human.libretexts.org/Bookshelves/Languages/English_as_a_Second_Language/Advanced_Community_College_ESL_Composition_-_An_Integrated_Skills_Approach_(Perez_et_al.)", icon: "📚", summary: "An advanced English-as-a-second-language composition text that integrates reading, academic writing, research, and language skills." },
  { id: 13, title: "Culturally Responsive Composition", cat: "English", copies: 6, author: "Andy Gurevich", published: "2023", cover_url: "https://images.weserv.nl/?url=mhcc.pressbooks.pub%2Fapp%2Fuploads%2Fsites%2F42%2F2023%2F07%2FCulturally-Responsive-Composition.png", reference_url: "https://mhcc.pressbooks.pub/culturallyresponsivecomposition/", icon: "📚", summary: "A guide to academic writing and the stages of essay creation, incorporating cultural responsiveness, exercises, and downloadable handouts." },
  { id: 14, title: "English 102 Book with English 105 supplemental", cat: "English", copies: 9, author: "Octaviano Gutierrez", published: "2023", cover_url: "https://images.weserv.nl/?url=openwa.pressbooks.pub%2Fapp%2Fuploads%2Fsites%2F412%2F2023%2F09%2FEnglish102cover-2.png", reference_url: "https://openwa.pressbooks.pub/octavianog/", icon: "📚", summary: "A composition and literature resource featuring short stories, fairy tales, literary criticism, and writing-process materials." },
  { id: 15, title: "Advanced Grammar in Use, 4th Edition", cat: "English", copies: 7, author: "Martin Hewings", published: "2023", cover_url: "https://imgv2-2-f.scribdassets.com/img/document/878573171/original/aef77cc7ff/1?v=1", reference_url: "https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/advanced-grammar-use-4th-edition", icon: "📚", summary: "A reference and practice book for advanced English learners, covering grammar in 105 units, including academic grammar, with answers and online tests." },
  { id: 16, title: "Introduction to Political Science", cat: "Social Studies", copies: 5, author: "Mark Carl Rom", published: "2022", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzY5OCwicHVyIjoiYmxvYl9pZCJ9fQ==--05c889d117e85faf639c38d080ff2ec3f34736e4/cover.png", reference_url: "https://openstax.org/details/books/introduction-political-science", icon: "🌍", summary: "Introduces political systems around the world and examines political action, civic participation, and how political realities develop." },
  { id: 17, title: "Introduction to Anthropology", cat: "Social Studies", copies: 7, author: "Jennifer Hasty", published: "2022", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzQ1NywicHVyIjoiYmxvYl9pZCJ9fQ==--da90654ff0429adaf1d9822d52da419b54721b9f/cover.jpg", reference_url: "https://openstax.org/details/books/introduction-anthropology", icon: "🌍", summary: "Introduces the four fields of anthropology and explores human cultures, biological diversity, archaeology, language, and inequality." },
  { id: 18, title: "Introduction to Sociology 3e", cat: "Social Studies", copies: 6, author: "Tonja R. Conerly", published: "2021", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzA5NywicHVyIjoiYmxvYl9pZCJ9fQ==--76cb22adcac26d507ee86e5de7cea2226d1a26be/cover.jpg", reference_url: "https://openstax.org/details/books/introduction-sociology-3e", icon: "🌍", summary: "Explores sociological theories, culture, institutions, social interactions, discrimination, and the structure of society." },
  { id: 19, title: "World History, Volume 1: to 1500", cat: "Social Studies", copies: 8, author: "Ann Kordas", published: "2023", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NjU0NywicHVyIjoiYmxvYl9pZCJ9fQ==--3058e70f8044c8879c9e2d07354eed7d0059dee0/cover.png", reference_url: "https://openstax.org/details/books/world-history-volume-1", icon: "🌍", summary: "Surveys world history through 1500, comparing societies and experiences across regions and incorporating primary sources." },
  { id: 20, title: "World History, Volume 2: from 1400", cat: "Social Studies", copies: 5, author: "Ann Kordas", published: "2022", cover_url: "https://open.umn.edu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDU0MCwicHVyIjoiYmxvYl9pZCJ9fQ==--e1f6915da3f3faf436475a9e62b644991194ff19/cover.png", reference_url: "https://openstax.org/details/books/world-history-volume-2", icon: "🌍", summary: "Surveys global history from 1400 onward, including exploration, colonization, revolutions, wars, and globalization, using diverse perspectives and primary sources." }
];

// ---- Load State ----
let users = [];
let books = [];
let loans = [];
let history = [];
let requests = [];
let rejections = [];
let extensionRequests = [];
let tickets = [];

let currentUser = null;
let currentTicketView = 'ongoing'; 
let minCopiesAllowed = 1;
let pendingConfirmAction = null;

let viewArchivedUsers = false;
let viewArchivedBooks = false;
let viewArchivedHistory = false;

const $ = id => document.getElementById(id);

// ---- CONSTANTS & HELPERS ----
const MAX_LOANS = 5;        
const FINE_PER_DAY = 5;     
const CATALOG_PAGE = 12;    

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const today = () => new Date().toLocaleDateString("en-CA");          
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString("en-CA"); };   
const dayDiff = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);   
const fineFor = (due, returnedAt = today()) => (Math.max(0, dayDiff(returnedAt, due)) * FINE_PER_DAY) || 0;
const money = n => "₱" + n.toLocaleString();
const titleOf = (id, fallback = "Unknown") => (books.find(b => b.id === id) || {}).title || fallback;

const dateFmt = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function dueBadge(due) {
  const d = dayDiff(due, today());
  if (d < 0) return `<span class="badge badge-red">Overdue ${-d} day${d === -1 ? "" : "s"} · ${money(fineFor(due))}</span>`;
  if (d === 0) return `<span class="badge badge-amber">Due today</span>`;
  if (d <= 3) return `<span class="badge badge-amber">Due in ${d} day${d === 1 ? "" : "s"}</span>`;
  return "";
}

// ---- GLOBAL CLOCK ----
function updateClock() {
  const now = new Date();
  $("clockDate").textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  $("clockTime").textContent = now.toLocaleTimeString('en-US');
}
setInterval(updateClock, 1000);
updateClock();

// ---- THEME ----
const savedTheme = localStorage.getItem("themeName") || "midnight-ocean";
document.documentElement.setAttribute("data-theme", savedTheme);

function toggleThemeDropdown(e) { e.stopPropagation(); const dd = $("themeDropdown"); dd.style.display = dd.style.display === "none" ? "flex" : "none"; }
document.addEventListener("click", (e) => { const dd = $("themeDropdown"); const btn = $("themeBtn"); if (dd && dd.style.display === "flex" && !btn.contains(e.target) && !dd.contains(e.target)) dd.style.display = "none"; });
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("themeName", theme);
  $("themeDropdown").style.display = "none";
  const activeOpt = document.querySelector(`.theme-option[data-theme="${theme}"]`);
  if (activeOpt) {
    document.querySelectorAll(".theme-option").forEach(opt => opt.classList.remove("active"));
    activeOpt.classList.add("active");
    const icon = activeOpt.querySelector(".theme-option-icon").cloneNode(true);
    const title = activeOpt.querySelector(".theme-option-title").textContent;
    const btnIcon = $("activeThemeIcon");
    btnIcon.style.background = icon.style.background;
    btnIcon.style.color = icon.style.color;
    btnIcon.textContent = icon.textContent;
    $("activeThemeName").textContent = title;
  }
}
setTheme(savedTheme);

// ---- SAVE & SYNC ----
async function save() {
  const payload = { users, books, loans, history, requests, rejections, extensionRequests, tickets };
  try {
    const response = await fetch('api.php?action=sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    try {
      const result = JSON.parse(text);
      if (result.error) alert("MySQL Save Error:\n" + result.error);
    } catch (e) { alert("PHP Error:\n" + text.substring(0, 300)); }
  } catch (error) { alert("Failed to connect to api.php. Is XAMPP running?"); }
}

function getThemeClass(cat) {
  if (cat === "IT") return "theme-it";
  if (cat === "Science") return "theme-science";
  if (cat === "English") return "theme-english";
  if (cat === "Social Studies") return "theme-social";
  return "";
}

const borrowedCount = id => loans.filter(l => l.bookId === id).length;

let confirmationAllowsEnter = true;
function showConfirm(title, message, confirmText, callback, allowEnter = true) {
  $("gcTitle").textContent = title;
  $("gcMessage").textContent = message;
  $("gcConfirmBtn").textContent = confirmText;
  pendingConfirmAction = callback;
  confirmationAllowsEnter = allowEnter;
  $("gcEnterHint").hidden = !allowEnter;
  $("globalConfirmModal").hidden = false;
}
$("gcConfirmBtn").onclick = () => { if (pendingConfirmAction) pendingConfirmAction(); $("globalConfirmModal").hidden = true; pendingConfirmAction = null; confirmationAllowsEnter = true; };
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal").forEach(m => m.hidden = true);
  if (e.key === "Enter" && !$("globalConfirmModal").hidden && confirmationAllowsEnter && pendingConfirmAction && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    $("gcConfirmBtn").click();
  }
});

// ---- WAITLIST AUTO-ASSIGN ----
function promoteWaitlist(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  const free = book.copies - borrowedCount(bookId) - requests.filter(r => r.bookId === bookId && !r.isWaitlist).length;
  
  if (free > 0) {
    const waitlisted = requests.filter(r => r.bookId === bookId && r.isWaitlist).sort((a, b) => a.id - b.id);
    if (waitlisted.length > 0) {
      const nextStudent = waitlisted[0];
      loans.push({ id: Date.now(), bookId: bookId, borrowerId: nextStudent.studentId, borrower: nextStudent.studentName, due: addDays(14), notes: "Auto-approved from waitlist", extensions: [] });
      requests = requests.filter(r => r.id !== nextStudent.id);
      save();
    }
  }
}

function refreshUserChip() {
  const u = currentUser;
  $("whoName").textContent = u.name;
  $("whoRole").textContent = u.role;
  $("userAvatar").textContent = (u.name.trim()[0] || "?").toUpperCase();
}

// ---- LOGIN & GUESTS ----
$("loginForm").onsubmit = (e) => {
  e.preventDefault();
  $("loginErr").textContent = "";
  const u = $("user").value.trim();
  const p = $("pass").value;
  const found = users.find(x => x.username === u && x.password === p && !x.is_archived);
  if (found) {
    currentUser = found;
    localStorage.setItem("session", JSON.stringify(found.id));
    showApp();
  } else { $("loginErr").textContent = "Invalid username or password."; }
};

$("logout").onclick = () => { localStorage.removeItem("session"); currentUser = null; $("auth").hidden = false; $("app").hidden = true; };

function openAuthTicketModal(e) {
  e.preventDefault();
  $("authName").value = ""; $("authUser").value = ""; $("authDesc").value = ""; $("authErr").textContent = "";
  $("authTicketModal").hidden = false;
}

function submitAuthTicket() {
  const name = $("authName").value.trim(), user = $("authUser").value.trim(), desc = $("authDesc").value.trim();
  if (!name || !user || !desc) { $("authErr").textContent = "Please fill in all fields."; return; }
  const newTicketId = Date.now();
  tickets.unshift({ id: newTicketId, userId: "guest", userName: name + " (Guest)", subject: "Account Recovery: " + user, desc, date: today(), time: new Date().toLocaleString(), status: "Open", replies: [] });
  let guestTickets = JSON.parse(localStorage.getItem("guestTickets") || "[]");
  guestTickets.push(newTicketId);
  localStorage.setItem("guestTickets", JSON.stringify(guestTickets));
  save();
  $("authTicketModal").hidden = true; $("guestTicketsModal").hidden = false;
  renderGuestTickets();
}

function openGuestTickets(e) { e.preventDefault(); renderGuestTickets(); $("guestTicketsModal").hidden = false; }

function renderGuestTickets() {
  const guestTickets = JSON.parse(localStorage.getItem("guestTickets") || "[]");
  const myTickets = tickets.filter(t => guestTickets.includes(t.id));
  const container = $("guestTicketsList");
  if (myTickets.length === 0) { container.innerHTML = `<p style="text-align: center; color: var(--muted); font-style: italic;">You haven't submitted any tickets yet.</p>`; return; }
  
  container.innerHTML = myTickets.map(t => {
    const tTime = t.time || t.date;
    let repliesHtml = (t.replies && t.replies.length > 0) ? `<div class="guest-ticket-replies">${t.replies.map(r => `<div class="reply-bubble ${r.sender === 'Admin' || r.sender === 'Bookkeeper' ? 'admin' : 'student'}"><strong>${esc(r.sender)}:</strong> ${esc(r.text)}<div class="reply-meta">${esc(r.date)}</div></div>`).join("")}</div>` : "";
    let replyInput = t.status === 'Open' ? `<div style="display: flex; gap: 8px; margin-top: 12px;"><input id="greply-${t.id}" placeholder="Type your reply..." style="flex: 1; padding: 8px; font-size: 13px; border-radius: 6px;"><button class="small" onclick="submitGuestReply(${t.id})">Send</button></div>` : `<p style="font-size: 12px; color: var(--muted); margin-top: 8px; font-style: italic;">This ticket is resolved. The Admin must reopen it for you to chat.</p>`;
    return `<div class="guest-ticket-card"><div class="guest-ticket-header"><div><div class="guest-ticket-title">${esc(t.subject)}</div><div class="guest-ticket-date">Submitted on ${esc(dateFmt(tTime))}</div></div><span style="padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: ${t.status === 'Open' ? 'color-mix(in srgb, #f59e0b 15%, transparent)' : 'color-mix(in srgb, #10b981 15%, transparent)'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">${t.status}</span></div><div class="guest-ticket-desc">"${esc(t.desc)}"</div>${repliesHtml}${replyInput}</div>`;
  }).join("");
}

function submitGuestReply(ticketId) {
  const input = $(`greply-${ticketId}`); if (!input) return;
  const text = input.value.trim(); if (!text) return;
  const t = tickets.find(x => x.id === ticketId); if (!t) return;
  if (!t.replies) t.replies = [];
  t.replies.push({ sender: "Guest", text, date: new Date().toLocaleString() });
  save(); renderGuestTickets();
}

// ---- APP NAVIGATION ----
function showApp() {
  $("auth").hidden = true; $("app").hidden = false;
  refreshUserChip();
  const isStudent = currentUser.role === "Student", isBookkeeper = currentUser.role === "Bookkeeper", isAdmin = currentUser.role === "Admin";
  $("navCatalog").hidden = isAdmin; $("navMyRequests").hidden = !isStudent; $("navRequests").hidden = !isBookkeeper;
  $("navLoans").hidden = isAdmin; $("navBooks").hidden = !isBookkeeper; $("navDashboard").hidden = !isBookkeeper;
  $("navUsers").hidden = !isAdmin; $("navTickets").hidden = isBookkeeper;
  $("btnNewTicket").style.display = isAdmin ? "none" : "block"; $("ticketTabs").style.display = isAdmin ? "flex" : "none"; $("thQueue").style.display = isAdmin ? "table-cell" : "none";
  if (isAdmin) switchView("users"); else if (isBookkeeper) switchView("dashboard"); else switchView("catalog");
}

const navId = v => "nav" + v.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
function switchView(viewName) {
  ['info', 'dashboard', 'catalog', 'my-requests', 'requests', 'loans', 'history', 'books', 'users', 'tickets'].forEach(v => { $("view-" + v).hidden = true; $(navId(v)).classList.remove("active"); });
  $("view-" + viewName).hidden = false; $(navId(viewName)).classList.add("active");
  if (viewName === 'info') renderGuidelines();
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'catalog') renderCatalog();
  if (viewName === 'my-requests') renderMyRequests();
  if (viewName === 'requests') renderRequests();
  if (viewName === 'loans') renderLoans();
  if (viewName === 'history') renderHistory();
  if (viewName === 'books') renderManageBooks();
  if (viewName === 'users') renderManageUsers();
  if (viewName === 'tickets') renderTickets();
  renderNotifications();
}

// ---- GUIDELINES ----
function renderGuidelines() {
  const role = currentUser.role;
  const generalRulesDiv = $("generalRulesList"), generalRulesTitle = $("generalRulesTitle");
  let generalRulesHtml = "";
  if (role === "Student") {
    generalRulesTitle.textContent = "📌 Student Quick Rules";
    generalRulesHtml = `<li><strong>Borrowing Limit:</strong> You can borrow a maximum of <strong>5 books total</strong> at any given time.</li><li><strong>Title Limit:</strong> You can only borrow <strong>1 copy per book title</strong>.</li><li><strong>Loan Period:</strong> Standard borrowing is <strong>14 days</strong>.</li><li><strong>Extensions:</strong> Request extensions before the due date with a <strong>valid reason</strong>.</li><li><strong>Waitlist:</strong> If a book is out of stock, join the waitlist. Waitlisted requests move up first come, first served.</li><li><strong>Late Fine:</strong> ${money(FINE_PER_DAY)} for every day a book is returned after its due date.</li>`;
  } else if (role === "Bookkeeper") {
    generalRulesTitle.textContent = "📌 Bookkeeper Quick Rules";
    generalRulesHtml = `<li><strong>Enforce Limits:</strong> Ensure students do not exceed <strong>5 active loans</strong> or request more than 1 copy of the same title.</li><li><strong>Extensions:</strong> Strictly review the student's reason before approving extensions.</li><li><strong>Approvals:</strong> Set due dates (14 days standard) when accepting borrow requests.</li><li><strong>Returns:</strong> Process returned books promptly to update inventory.</li><li><strong>Late Fines:</strong> ${money(FINE_PER_DAY)} per overdue day. The fine is shown when you process a late return.</li>`;
  } else if (role === "Admin") {
    generalRulesTitle.textContent = "📌 Admin Quick Rules";
    generalRulesHtml = `<li><strong>Account Management:</strong> Use "Archive" instead of deleting to preserve records.</li><li><strong>Support:</strong> Monitor and respond to support tickets for account recovery.</li><li><strong>Oversight:</strong> Review archived history and records when necessary.</li>`;
  }
  generalRulesDiv.innerHTML = generalRulesHtml;
  $("guide-admin").style.display = "none"; $("guide-bookkeeper").style.display = "none"; $("guide-student").style.display = "none";
  if (role === "Admin") $("guide-admin").style.display = "block";
  else if (role === "Bookkeeper") $("guide-bookkeeper").style.display = "block";
  else if (role === "Student") $("guide-student").style.display = "block";
}

// ---- GLOBAL SEARCH ----
function closeGlobalSearch() {
  $("globalSearchResults").classList.remove("active");
  $("globalSearch").value = "";
}

$("globalSearch").oninput = function() {
  const q = this.value.toLowerCase().trim();
  const resBox = $("globalSearchResults");
  
  if (q.length < 2) { 
    resBox.classList.remove("active"); 
    return; 
  }
  
  const isAdmin = currentUser.role === 'Admin';
  const isBookkeeper = currentUser.role === 'Bookkeeper';
  const isStudent = currentUser.role === 'Student';
  
  let html = "";
  let hasResults = false;

  // 1. BOOKS (Visible to everyone)
  const bookRes = books.filter(b => !b.is_archived && (
    b.title.toLowerCase().includes(q) || 
    b.author.toLowerCase().includes(q) || 
    b.published.includes(q)
  )).slice(0, 3);
  
  if (bookRes.length > 0) {
    hasResults = true;
    html += `<div style="font-size: 10px; font-weight: 800; color: var(--muted); padding: 8px 12px 4px;">BOOKS</div>`;
    html += bookRes.map(b => `
      <div class="gs-item" onclick="openBookInfo(${b.id}); closeGlobalSearch();">
        <strong>${esc(b.title)}</strong>
        <small>${esc(b.cat)} · ${b.published}</small>
      </div>
    `).join("");
  }

  // 2. USERS (Visible to Admin ONLY)
  if (isAdmin) {
    const userRes = users.filter(u => !u.is_archived && (
      u.name.toLowerCase().includes(q) || 
      u.username.toLowerCase().includes(q) ||
      (u.studentNum && u.studentNum.toLowerCase().includes(q))
    )).slice(0, 3);
    
    if (userRes.length > 0) {
      hasResults = true;
      html += `<div style="font-size: 10px; font-weight: 800; color: var(--muted); padding: 8px 12px 4px;">ACCOUNTS</div>`;
      html += userRes.map(u => `
        <div class="gs-item" onclick="switchView('users'); $('adminUserSearch').value='${esc(u.name)}'; renderManageUsers(); closeGlobalSearch();">
          <strong>${esc(u.name)}</strong>
          <small>${esc(u.role)} ${u.studentNum ? '· ' + u.studentNum : ''}</small>
        </div>
      `).join("");
    }
  }

  // 3. ACTIVE LOANS (Visible to Bookkeeper, or Student's own)
  const searchableLoans = isBookkeeper ? loans : (isStudent ? loans.filter(l => l.borrowerId === currentUser.id) : []);
  const loanRes = searchableLoans.filter(l => 
    l.borrower.toLowerCase().includes(q) || 
    titleOf(l.bookId).toLowerCase().includes(q) || 
    l.due.includes(q)
  ).slice(0, 3);

  if (loanRes.length > 0) {
    hasResults = true;
    html += `<div style="font-size: 10px; font-weight: 800; color: var(--muted); padding: 8px 12px 4px;">ACTIVE LOANS</div>`;
    html += loanRes.map(l => `
      <div class="gs-item" onclick="switchView('loans'); closeGlobalSearch();">
        <strong>${esc(titleOf(l.bookId))}</strong>
        <small>${esc(l.borrower)} · Due ${esc(dateFmt(l.due))}</small>
      </div>
    `).join("");
  }

  // 4. PENDING REQUESTS (Visible to Bookkeeper, or Student's own)
  const searchableReqs = isBookkeeper ? requests : (isStudent ? requests.filter(r => r.studentId === currentUser.id) : []);
  const reqRes = searchableReqs.filter(r => 
    r.studentName.toLowerCase().includes(q) || 
    titleOf(r.bookId).toLowerCase().includes(q) ||
    r.dateRequested.includes(q)
  ).slice(0, 3);

  if (reqRes.length > 0) {
    hasResults = true;
    const targetView = isBookkeeper ? 'requests' : 'my-requests';
    html += `<div style="font-size: 10px; font-weight: 800; color: var(--muted); padding: 8px 12px 4px;">BORROW REQUESTS</div>`;
    html += reqRes.map(r => `
      <div class="gs-item" onclick="switchView('${targetView}'); closeGlobalSearch();">
        <strong>${esc(titleOf(r.bookId))}</strong>
        <small>${esc(r.studentName)} · ${r.isWaitlist ? 'Waitlist' : 'Pending'}</small>
      </div>
    `).join("");
  }

  // 5. SUPPORT TICKETS (Visible to Admin, or Student's own)
  const searchableTickets = isAdmin ? tickets : (isStudent ? tickets.filter(t => t.userId === currentUser.id) : []);
  const ticketRes = searchableTickets.filter(t => 
    t.subject.toLowerCase().includes(q) || 
    t.userName.toLowerCase().includes(q) ||
    t.date.includes(q)
  ).slice(0, 3);

  if (ticketRes.length > 0) {
    hasResults = true;
    html += `<div style="font-size: 10px; font-weight: 800; color: var(--muted); padding: 8px 12px 4px;">SUPPORT TICKETS</div>`;
    html += ticketRes.map(t => `
      <div class="gs-item" onclick="switchView('tickets'); closeGlobalSearch();">
        <strong>${esc(t.subject)}</strong>
        <small>${esc(t.userName)} · ${t.status}</small>
      </div>
    `).join("");
  }

  // 6. HISTORY / FINES (Visible to Bookkeeper, or Student's own)
  const searchableHistory = isBookkeeper ? history : (isStudent ? history.filter(h => h.borrowerId === currentUser.id) : []);
  const historyRes = searchableHistory.filter(h => 
    h.borrower.toLowerCase().includes(q) || 
    titleOf(h.bookId).toLowerCase().includes(q) || 
    h.returnedAt.includes(q)
  ).slice(0, 3);

  if (historyRes.length > 0) {
    hasResults = true;
    html += `<div style="font-size: 10px; font-weight: 800; color: var(--muted); padding: 8px 12px 4px;">HISTORY & FINES</div>`;
    html += historyRes.map(h => {
      const fine = fineFor(h.due, h.returnedAt);
      return `
        <div class="gs-item" onclick="switchView('history'); closeGlobalSearch();">
          <strong>${esc(titleOf(h.bookId))}</strong>
          <small>${esc(h.borrower)} · ${fine ? money(fine) + ' Fine' : 'No Fine'}</small>
        </div>
      `;
    }).join("");
  }

  // Render Results
  if (!hasResults) {
    html = `<div style="padding: 12px; font-size: 13px; color: var(--muted); text-align: center;">No results found for "${esc(q)}".</div>`;
  }

  resBox.innerHTML = html;
  resBox.classList.add("active");
};

document.addEventListener("click", (e) => {
  if (!e.target.closest(".global-search-wrapper")) {
    $("globalSearchResults").classList.remove("active");
  }
}, false);

// ---- CATALOG ----
let catalogLimit = CATALOG_PAGE;
function resetCatalogLimit() { catalogLimit = CATALOG_PAGE; renderCatalog(); }
function showMoreBooks() { catalogLimit += CATALOG_PAGE; renderCatalog(); }

const COVER_DIR = "covers/", COVER_EXTS = ["jpg", "png", "webp", "jpeg"];
function coverSlug(t) { return String(t).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function coverCandidates(b) { const out = []; if (b.cover_url) out.push(b.cover_url); [coverSlug(b.title), String(b.id)].forEach(n => COVER_EXTS.forEach(e => out.push(COVER_DIR + n + "." + e))); return out; }
function coverImgHtml(b, extraStyle = "") { const list = coverCandidates(b); return `<img src="${esc(list[0])}" data-bookid="${b.id}" data-i="0" alt="${esc(b.title)} cover" style="${extraStyle}" onerror="coverFallback(this)">`; }
function coverFallback(img) { const b = books.find(x => String(x.id) === img.dataset.bookid); const list = b ? coverCandidates(b) : []; const next = (parseInt(img.dataset.i, 10) || 0) + 1; if (next < list.length) { img.dataset.i = next; img.src = list[next]; return; } img.onerror = null; img.parentElement.innerHTML = `<span style="font-size: 64px;">${b ? b.icon : "📘"}</span>`; }

function renderCatalog() {
  const q = $("search").value.toLowerCase(), cat = $("catFilter").value, yearFilter = $("yearFilter").value, sortBy = $("sortCatalog").value, onlyAvailable = $("availOnly").checked;
  let filtered = books.filter(b => {
    const matchArchived = !b.is_archived;
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q) || (b.author && b.author.toLowerCase().includes(q)) || (b.summary && b.summary.toLowerCase().includes(q)) || (b.published && b.published.toString().toLowerCase().includes(q));
    const matchCat = cat === "all" || b.cat === cat;
    const matchAvail = !onlyAvailable || (b.copies - borrowedCount(b.id)) > 0;
    let matchYear = true; if (yearFilter === "2020-2026") matchYear = (b.published >= 2020 && b.published <= 2026); else if (yearFilter !== "all") matchYear = (b.published == yearFilter);
    return matchArchived && matchSearch && matchCat && matchYear && matchAvail;
  });
  filtered.sort((a, b) => { if (sortBy === "title-asc") return a.title.localeCompare(b.title); if (sortBy === "title-desc") return b.title.localeCompare(a.title); if (sortBy === "author-asc") return (a.author || "").localeCompare(b.author || ""); if (sortBy === "author-desc") return (b.author || "").localeCompare(a.author || ""); if (sortBy === "date-new") return (b.published || "").localeCompare(a.published || ""); if (sortBy === "date-old") return (a.published || "").localeCompare(b.published || ""); return 0; });

  const visible = filtered.slice(0, catalogLimit), remaining = filtered.length - visible.length;
  $("loadMoreWrap").hidden = remaining <= 0; $("loadMoreBtn").textContent = `Show more (${remaining} remaining)`;

  if (filtered.length === 0) {
    $("books").innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>No books found</h3><p>Try adjusting your search or filters.</p></div>`;
    return;
  }

  $("books").innerHTML = visible.map(b => {
    const avail = b.copies - borrowedCount(b.id), theme = getThemeClass(b.cat);
    let actionBtns = "";
    if (currentUser.role === 'Student') {
      const alreadyReq = requests.find(r => r.bookId === b.id && r.studentId === currentUser.id);
      const alreadyBorrowed = loans.find(l => l.bookId === b.id && l.borrowerId === currentUser.id);
      if (alreadyReq) actionBtns += `<button disabled style="background:color-mix(in srgb, #f59e0b 15%, transparent); color:#b45309; border:1px solid #fcd34d; opacity:1;" onclick="event.stopPropagation()">Requested</button>`;
      else if (alreadyBorrowed) actionBtns += `<button disabled style="background:color-mix(in srgb, #10b981 15%, transparent); color:#047857; border:1px solid #6ee7b7; opacity:1;" onclick="event.stopPropagation()">Borrowed</button>`;
      else { if (avail > 0) actionBtns += `<button onclick="event.stopPropagation(); openRequest(${b.id}, false)">Borrow</button>`; else actionBtns += `<button style="background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; box-shadow:0 4px 12px rgba(245,158,11,0.3);" onclick="event.stopPropagation(); openRequest(${b.id}, true)">Request</button>`; }
    }
    return `<div class="book ${theme}" onclick="openBookInfo(${b.id})"><div class="book-cover-container">${coverImgHtml(b)}</div><span class="cat">${esc(b.cat)}</span><h3>${esc(b.title)}</h3><span class="avail">${avail} of ${b.copies} available</span><div class="book-actions">${actionBtns}</div></div>`;
  }).join("");
}

$("search").oninput = resetCatalogLimit; $("catFilter").onchange = resetCatalogLimit; $("yearFilter").onchange = resetCatalogLimit; $("sortCatalog").onchange = resetCatalogLimit; $("availOnly").onchange = resetCatalogLimit;

function openBookInfo(id) {
  const b = books.find(x => x.id === id); if (!b) return;
  $("biCover").innerHTML = coverImgHtml(b, "width: 100%; height: 100%; object-fit: cover;"); $("biCover").className = "book-cover-large";
  $("biTitle").textContent = b.title; $("biCategory").textContent = b.cat; $("biCategory").className = `cat ${getThemeClass(b.cat)}`;
  $("biAuthor").textContent = b.author || "Unknown"; $("biPublished").textContent = b.published || "Unknown"; $("biCopies").textContent = `${b.copies} copies in library`; $("biSummary").textContent = b.summary || "No summary provided.";
  if (b.reference_url) { $("biReferenceDiv").style.display = "block"; $("biReferenceLink").href = b.reference_url; } else { $("biReferenceDiv").style.display = "none"; }
  $("bookInfoModal").hidden = false;
}

// ---- REQUESTS ----
let requestingBookId = null, isWaitlistReq = false;
function openRequest(id, isWaitlist = false) {
  requestingBookId = id; isWaitlistReq = isWaitlist; const b = books.find(x => x.id === id);
  $("reqName").value = currentUser.name; $("reqStudentId").value = currentUser.studentNum || "Not Set"; $("reqSection").value = currentUser.section || "Not Set";
  $("reqContact").value = ""; $("reqNotes").value = ""; $("reqErr").textContent = "";
  if (isWaitlist) $("reqBookName").innerHTML = `${esc(b.title)} <br><span style="color:#b45309; font-size:12px; font-weight:600;">(Out of Stock - Joining Waitlist)</span>`; else $("reqBookName").textContent = b.title;
  $("requestModal").hidden = false;
}

function submitRequest() {
  if (!currentUser.studentNum || !currentUser.section) { $("reqErr").textContent = "Your profile is missing Student ID or Section. Please contact Admin."; return; }
  const alreadyHas = loans.some(l => l.bookId === requestingBookId && l.borrowerId === currentUser.id) || requests.some(r => r.bookId === requestingBookId && r.studentId === currentUser.id);
  if (alreadyHas) { $("reqErr").textContent = "You already borrowed or requested a copy of this title (limit: 1 per title)."; return; }
  const inUse = loans.filter(l => l.borrowerId === currentUser.id).length + requests.filter(r => r.studentId === currentUser.id).length;
  if (inUse >= MAX_LOANS) { $("reqErr").textContent = `Borrow limit reached: you can have at most ${MAX_LOANS} books borrowed or requested at a time.`; return; }
  requests.push({ id: Date.now(), bookId: requestingBookId, studentId: currentUser.id, studentName: currentUser.name, reqStudentId: currentUser.studentNum, reqSection: currentUser.section, reqContact: $("reqContact").value.trim(), notes: $("reqNotes").value.trim(), isWaitlist: isWaitlistReq, dateRequested: today() });
  save(); $("requestModal").hidden = true; renderCatalog();
}

function waitlistPosition(r) { return requests.filter(x => x.bookId === r.bookId && x.isWaitlist && x.id <= r.id).length; }

function renderMyRequests() {
  const myReqs = requests.filter(r => r.studentId === currentUser.id);
  if (myReqs.length === 0) { $("myRequestsBody").innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-state-icon">📋</div><h3>No pending requests</h3><p>Go to the Catalog to request a book.</p></div></td></tr>`; return; }
  $("myRequestsBody").innerHTML = myReqs.map(r => {
    const badge = r.isWaitlist ? `<span style="background:#f59e0b; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:800; margin-left:8px;">WAITLIST</span>` : "";
    const status = r.isWaitlist ? `Waitlisted · #${waitlistPosition(r)} in line` : "Pending Approval";
    return `<tr><td><strong>${esc(titleOf(r.bookId, "Deleted Book"))}</strong> ${badge}</td><td>${esc(dateFmt(r.dateRequested))}</td><td><span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: color-mix(in srgb, #f59e0b 15%, transparent); color: #b45309;">${status}</span></td><td><div class="actions-cell"><button class="ghost danger small" onclick="cancelRequest(${r.id})">Cancel Request</button></div></td></tr>`;
  }).join("");
}

function cancelRequest(reqId) {
  showConfirm("Cancel Request", "Are you sure you want to cancel this borrow request?", "Cancel Request", () => {
    const req = requests.find(r => r.id === reqId); requests = requests.filter(r => r.id !== reqId);
    if (req) promoteWaitlist(req.bookId);
    save(); renderMyRequests(); renderCatalog();
  }, false);
}

function renderRequests() {
  if (requests.length === 0 && extensionRequests.length === 0) { $("requestsBody").innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-state-icon">📥</div><h3>No pending requests</h3><p>All requests have been processed.</p></div></td></tr>`; return; }
  $("requestsBody").innerHTML = requests.map(r => {
    const waitlistBadge = r.isWaitlist ? `<span style="display:inline-block; margin-left: 8px; background:#f59e0b; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:800; letter-spacing:0.5px;">WAITLIST</span>` : "";
    return `<tr><td><strong>${esc(titleOf(r.bookId, "Deleted Book"))}</strong></td><td>${esc(r.studentName)} ${waitlistBadge}</td><td>${esc(dateFmt(r.dateRequested))}</td><td><div class="actions-cell"><button class="ghost small" onclick="openViewRequest(${r.id})">View</button></div></td></tr>`;
  }).join("");
  renderExtensionRequests();
}

let viewingRequestId = null;
function openViewRequest(reqId) {
  viewingRequestId = reqId; const req = requests.find(r => r.id === reqId); const b = books.find(x => x.id === req.bookId);
  $("vrBookName").textContent = b ? b.title : "Deleted Book"; $("vrName").textContent = req.studentName; $("vrStudentId").textContent = req.reqStudentId || "—"; $("vrSection").textContent = req.reqSection || "—"; $("vrContact").textContent = req.reqContact || "—"; $("vrNotes").textContent = req.notes || "No notes provided."; $("vrDate").textContent = dateFmt(req.dateRequested);
  $("viewRequestModal").hidden = false;
}

function promptApprove() { $("viewRequestModal").hidden = true; const req = requests.find(r => r.id === viewingRequestId); const b = books.find(x => x.id === req.bookId); $("appBookName").textContent = `${b.title} for ${req.studentName}`; $("appDueDate").value = addDays(14); $("approveModal").hidden = false; }

function approveRequest() {
  const reqIndex = requests.findIndex(r => r.id === viewingRequestId); if (reqIndex === -1) return;
  const req = requests[reqIndex], dueDate = $("appDueDate").value, book = books.find(b => b.id === req.bookId);
  let problem = ""; if (!dueDate) problem = "Please set a due date."; else if (!book || book.is_archived) problem = "This book is no longer in the catalog. Reject the request instead."; else if (book.copies - borrowedCount(book.id) <= 0) problem = "No copies are available right now. Wait for a return before approving this request."; else if (loans.some(l => l.bookId === req.bookId && l.borrowerId === req.studentId)) problem = `${req.studentName} already has a copy of this title (limit: 1 per title).`; else if (loans.filter(l => l.borrowerId === req.studentId).length >= MAX_LOANS) problem = `${req.studentName} already has ${MAX_LOANS} active loans.`;
  if (problem) { showConfirm("Cannot Approve", problem, "Okay", () => {}); return; }
  loans.push({ id: Date.now(), bookId: req.bookId, borrowerId: req.studentId, borrower: req.studentName, due: dueDate, notes: req.notes, extensions: [] });
  requests.splice(reqIndex, 1); save(); $("approveModal").hidden = true; renderRequests();
}

function promptReject() { $("viewRequestModal").hidden = true; $("rejectReason").value = ""; $("rejErr").textContent = ""; $("rejectModal").hidden = false; }

function submitReject() {
  const reason = $("rejectReason").value.trim(); if (!reason) { $("rejErr").textContent = "Please provide a reason."; return; }
  const reqIndex = requests.findIndex(r => r.id === viewingRequestId), req = requests[reqIndex];
  req.reason = reason; req.dateProcessed = today(); req.is_archived = false; rejections.unshift(req);
  requests.splice(reqIndex, 1); promoteWaitlist(req.bookId); save(); $("rejectModal").hidden = true; renderRequests();
}

// ---- LOANS & EXTENSIONS ----
function renderLoans() {
  const isStudent = currentUser.role === 'Student';
  const visibleLoans = (isStudent ? loans.filter(l => l.borrowerId === currentUser.id) : [...loans]).sort((a, b) => String(a.due).localeCompare(String(b.due)));
  if (visibleLoans.length === 0) { $("loansBody").innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-state-icon">📖</div><h3>No active loans</h3><p>There are currently no books checked out.</p></div></td></tr>`; return; }
  $("loansBody").innerHTML = visibleLoans.map(l => {
    const hasPendingExt = extensionRequests.find(r => r.loanId === l.id);
    let actions = `<button class="ghost small" onclick="viewLoanDetails(${l.id}, false)">View</button>`;
    if (isStudent) { if (hasPendingExt) actions += `<span style="font-size: 12px; color: #b45309; font-weight: 600; margin-left: 8px;">Ext. Pending</span>`; else actions += `<button class="ghost small" style="color:var(--primary); border-color:color-mix(in srgb, var(--primary) 40%, var(--border));" onclick="openExtendRequest(${l.id})">Request Extend</button>`; }
    else { actions += `<button class="ghost small" style="color:var(--primary); border-color:color-mix(in srgb, var(--primary) 40%, var(--border));" onclick="openExtendLoan(${l.id})">Extend</button>`; actions += `<button class="small" onclick="returnBook(${l.id})">Return</button>`; }
    return `<tr><td><strong>${esc(titleOf(l.bookId))}</strong></td><td>${esc(l.borrower)}</td><td>${esc(dateFmt(l.due))} ${dueBadge(l.due)}</td><td><div class="actions-cell">${actions}</div></td></tr>`;
  }).join("");
}

function viewLoanDetails(id, isHistory) {
  const loan = isHistory ? history.find(l => l.id === id) : loans.find(l => l.id === id); if (!loan) return;
  $("ldBookName").textContent = titleOf(loan.bookId); $("ldName").textContent = loan.borrower; $("ldStatus").textContent = isHistory ? "Returned" : "Active"; $("ldStatus").style.color = isHistory ? "#10b981" : "#f59e0b"; $("ldDueDate").textContent = dateFmt(loan.due); $("ldNotes").textContent = loan.notes || "No notes provided.";
  const fine = fineFor(loan.due, isHistory ? loan.returnedAt : today()); $("ldFine").textContent = fine ? money(fine) : "None"; $("ldFine").style.color = fine ? "#ef4444" : "";
  if (isHistory) { $("ldReturnRow").style.display = "flex"; $("ldReturnDate").textContent = dateFmt(loan.returnedAt); } else { $("ldReturnRow").style.display = "none"; }
  const extArea = $("ldExtensionsArea"), extList = $("ldExtensionsList");
  if (loan.extensions && loan.extensions.length > 0) {
    extArea.style.display = "block"; extList.innerHTML = loan.extensions.map(e => `<div style="border-bottom: 1px dashed var(--border); padding-bottom: 8px; margin-bottom: 8px;"><div style="font-weight: 600; color: var(--primary);">${esc(dateFmt(e.oldDue || "—"))} → ${esc(dateFmt(e.newDue))}</div><div><strong>Reason:</strong> ${esc(e.reason)}</div></div>`).join("");
    extList.lastElementChild.style.border = "none"; extList.lastElementChild.style.marginBottom = "0"; extList.lastElementChild.style.paddingBottom = "0";
  } else extArea.style.display = "none";
  $("loanDetailsModal").hidden = false;
}

function viewRejection(id) {
  const r = rejections.find(x => x.id === id); if (!r) return; const book = books.find(b => b.id === r.bookId);
  $("rjBookName").textContent = book ? book.title : "Deleted Book"; $("rjName").textContent = r.studentName; $("rjStudentId").textContent = r.reqStudentId || "—"; $("rjSection").textContent = r.reqSection || "—"; $("rjDate").textContent = dateFmt(r.dateRequested); $("rjDateProcessed").textContent = dateFmt(r.dateProcessed); $("rjReason").textContent = r.reason;
  $("viewRejectionModal").hidden = false;
}

let extendingLoanId = null;
function openExtendLoan(id) { extendingLoanId = id; const loan = loans.find(l => l.id === id); $("elBookName").textContent = books.find(b => b.id === loan.bookId).title; $("elNewDate").value = addDays(7); $("elReason").value = ""; $("elErr").textContent = ""; $("extendLoanModal").hidden = false; }

function saveExtendLoan() {
  const reason = $("elReason").value.trim(), newDate = $("elNewDate").value; if(!reason || !newDate) { $("elErr").textContent = "Please fill in all fields."; return; }
  const loan = loans.find(l => l.id === extendingLoanId); loan.extensions = loan.extensions || []; loan.extensions.push({ oldDue: loan.due, newDue: newDate, reason }); loan.due = newDate;
  save(); $("extendLoanModal").hidden = true; renderLoans();
}

let extReqLoanId = null;
function openExtendRequest(loanId) { extReqLoanId = loanId; const loan = loans.find(l => l.id === loanId); $("extReqBookName").textContent = books.find(b => b.id === loan.bookId).title; $("extReason").value = ""; $("extErr").textContent = ""; $("extendReqModal").hidden = false; }

function submitExtensionRequest() {
  const reason = $("extReason").value.trim(); if (!reason) { $("extErr").textContent = "Please provide a reason."; return; }
  const loan = loans.find(l => l.id === extReqLoanId);
  extensionRequests.push({ id: Date.now(), loanId: extReqLoanId, bookName: books.find(b => b.id === loan.bookId).title, studentName: currentUser.name, reason });
  save(); $("extendReqModal").hidden = true; renderLoans();
}

function renderExtensionRequests() {
  if (extensionRequests.length > 0) {
    $("requestsBody").innerHTML += extensionRequests.map(ext => `<tr style="background: color-mix(in srgb, #ef4444 5%, transparent);"><td><strong>[EXTENSION] ${esc(ext.bookName)}</strong></td><td>${esc(ext.studentName)}</td><td>Reason: ${esc(ext.reason)}</td><td><div class="actions-cell"><button class="small" onclick="openExtApprove(${ext.id})">Approve Ext</button><button class="ghost danger small" onclick="rejectExtension(${ext.id})">Reject</button></div></td></tr>`).join("");
  }
}

let extAppReqId = null;
function openExtApprove(reqId) { extAppReqId = reqId; const req = extensionRequests.find(r => r.id === reqId); $("extAppBookName").textContent = req.bookName; $("extAppReason").textContent = `"${req.reason}"`; $("extAppNewDate").value = addDays(7); $("extendAppModal").hidden = false; }

function approveExtension() {
  const reqIdx = extensionRequests.findIndex(r => r.id === extAppReqId); if (reqIdx === -1) return;
  const req = extensionRequests[reqIdx], loan = loans.find(l => l.id === req.loanId); if (!loan) { extensionRequests.splice(reqIdx, 1); save(); $("extendAppModal").hidden = true; switchView("requests"); return; }
  const newDue = $("extendAppNewDate").value; if (!newDue) { showConfirm("Missing Date", "Please pick a new due date.", "Okay", () => {}); return; }
  loan.extensions = loan.extensions || []; loan.extensions.push({ oldDue: loan.due, newDue, reason: req.reason }); loan.due = newDue;
  extensionRequests.splice(reqIdx, 1); save(); $("extendAppModal").hidden = true; switchView("requests");
}

function rejectExtension(id) { showConfirm("Reject Extension", "Are you sure you want to reject this extension request?", "Reject", () => { extensionRequests = extensionRequests.filter(r => r.id !== id); save(); switchView("requests"); }, false); }

function returnBook(loanId) {
  const idx = loans.findIndex(l => l.id === loanId); if (idx === -1) return;
  const loan = loans[idx]; loan.returnedAt = today(); loan.is_archived = false; loan.fine_paid = 0;
  history.unshift(loan); loans.splice(idx, 1); extensionRequests = extensionRequests.filter(r => r.loanId !== loanId);
  promoteWaitlist(loan.bookId); save(); renderLoans();
  const fine = fineFor(loan.due, loan.returnedAt);
  if (fine) { const late = dayDiff(loan.returnedAt, loan.due); showConfirm("Late Return", `${loan.borrower} returned this book ${late} day${late === 1 ? "" : "s"} late. Collect a fine of ${money(fine)}.`, "Okay", () => {}); }
}

// ---- HISTORY ----
function historyItems() {
  const isStudent = currentUser.role === 'Student', archivedView = !isStudent && viewArchivedHistory, wanted = x => !!x.is_archived === archivedView;
  const loanRows = history.filter(h => wanted(h) && (!isStudent || h.borrowerId === currentUser.id)).map(h => ({ kind: 'loan', id: h.id, bookId: h.bookId, person: h.borrower, date: h.returnedAt, due: h.due, fine: fineFor(h.due, h.returnedAt), fine_paid: h.fine_paid, note: h.notes || "" }));
  const rejectionRows = rejections.filter(r => wanted(r) && (!isStudent || r.studentId === currentUser.id)).map(r => ({ kind: 'rejection', id: r.id, bookId: r.bookId, person: r.studentName, date: r.dateProcessed, due: "", fine: 0, fine_paid: true, note: r.reason || "" }));
  return [...loanRows, ...rejectionRows].map(x => ({ ...x, title: titleOf(x.bookId) })).sort((a, b) => new Date(b.date) - new Date(a.date));
}

const historyStatus = i => i.kind === 'loan' ? `<span style="color: #10b981; font-weight: 600;">Returned</span>` : `<span style="color: #ef4444; font-weight: 600;">Rejected</span>`;
const historyFine = i => i.fine ? `<span style="color: #ef4444; font-weight: 600;">${money(i.fine)} ${i.fine_paid ? '(Paid)' : '(Unpaid)'}</span>` : "—";
const historyNote = i => i.kind === 'loan' ? `<span style="font-style: italic; color: var(--muted);">${esc(i.note) || "—"}</span>` : `<span style="color: #ef4444;"><strong>Reason:</strong> ${esc(i.note)}</span>`;

function renderHistory() {
  const isStudent = currentUser.role === 'Student', items = historyItems();
  $("btnViewArchivedHistory").hidden = isStudent;
  $("btnViewArchivedHistory").textContent = viewArchivedHistory ? "Show Active" : "Show Archived";
  if (items.length === 0) { $("historyBody").innerHTML = `<tr><td colspan="${isStudent ? 5 : 6}"><div class="empty-state"><div class="empty-state-icon">🕘</div><h3>No history found</h3><p>There are no records to display.</p></div></td></tr>`; return; }
  if (isStudent) {
    $("historyHead").innerHTML = `<tr><th>Book</th><th>Status</th><th>Date</th><th>Fine</th><th>Notes / Reason</th></tr>`;
    $("historyBody").innerHTML = items.map(i => `<tr><td><strong>${esc(i.title)}</strong></td><td>${historyStatus(i)}</td><td>${esc(dateFmt(i.date))}</td><td>${historyFine(i)}</td><td>${historyNote(i)}</td></tr>`).join("");
    return;
  }
  $("historyHead").innerHTML = `<tr><th>Book</th><th>Borrower</th><th>Status</th><th>Date</th><th>Fine</th><th style="text-align: right;">Actions</th></tr>`;
  $("historyBody").innerHTML = items.map(i => {
    const view = i.kind === 'loan' ? `viewLoanDetails(${i.id}, true)` : `viewRejection(${i.id})`;
    const archive = i.kind === 'loan' ? 'archiveHistory' : 'archiveRejection', unarchive = i.kind === 'loan' ? 'unarchiveHistory' : 'unarchiveRejection';
    return `<tr><td><strong>${esc(i.title)}</strong></td><td>${esc(i.person)}</td><td>${historyStatus(i)}</td><td>${esc(dateFmt(i.date))}</td><td>${historyFine(i)}</td><td><div class="actions-cell"><button class="ghost small" onclick="${view}">View</button>${viewArchivedHistory ? `<button class="ghost small" onclick="${unarchive}(${i.id})">Unarchive</button>` : `<button class="ghost danger small" onclick="${archive}(${i.id})">Archive</button>`}</div></td></tr>`;
  }).join("");
}

function toggleViewArchivedHistory() {
  viewArchivedHistory = !viewArchivedHistory;
  renderHistory();
}

function exportHistoryCsv() {
  const items = historyItems(); if (items.length === 0) { showConfirm("Nothing to Export", "There are no history records to export.", "Okay", () => {}); return; }
  const cell = v => { let s = String(v ?? ""); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const header = ["Book", "Borrower", "Status", "Date", "Due Date", "Late Fine (PHP)", "Notes / Reason"];
  const rows = items.map(i => [i.title, i.person, i.kind === 'loan' ? "Returned" : "Rejected", i.date, i.due, i.fine, i.note]);
  const csv = "﻿" + [header, ...rows].map(r => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), a = document.createElement("a");
  a.href = url; a.download = `library-history-${today()}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function archiveHistory(id) { showConfirm("Archive History", "Are you sure you want to archive this record?", "Archive", () => { const h = history.find(x => x.id === id); if (h) h.is_archived = true; save(); renderHistory(); }, false); }
function unarchiveHistory(id) { const h = history.find(x => x.id === id); if (h) h.is_archived = false; save(); renderHistory(); }
function archiveRejection(id) { showConfirm("Archive Record", "Are you sure you want to archive this rejected request?", "Archive", () => { const r = rejections.find(x => x.id === id); if (r) r.is_archived = true; save(); renderHistory(); }, false); }
function unarchiveRejection(id) { const r = rejections.find(x => x.id === id); if (r) r.is_archived = false; save(); renderHistory(); }

// ---- MANAGE BOOKS ----
function renderManageBooks() {
  $("btnViewArchivedBooks").textContent = viewArchivedBooks ? "Show Active" : "Show Archived";
  const q = $("adminBookSearch").value.toLowerCase(), cat = $("adminCatFilter").value, sortBy = $("sortAdminBooks").value;
  let filtered = books.filter(b => (viewArchivedBooks ? b.is_archived : !b.is_archived) && (!q || b.title.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q) || (b.author && b.author.toLowerCase().includes(q)) || (b.published && b.published.toString().toLowerCase().includes(q))) && (cat === "all" || b.cat === cat));
  filtered.sort((a, b) => { if (sortBy === "title-asc") return a.title.localeCompare(b.title); if (sortBy === "title-desc") return b.title.localeCompare(a.title); if (sortBy === "author-asc") return (a.author || "").localeCompare(b.author || ""); if (sortBy === "author-desc") return (b.author || "").localeCompare(a.author || ""); if (sortBy === "date-new") return (b.published || "").localeCompare(a.published || ""); if (sortBy === "date-old") return (a.published || "").localeCompare(b.published || ""); return 0; });
  if (filtered.length === 0) { $("manageBooksBody").innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-state-icon">📚</div><h3>No books found</h3><p>Try adjusting your search.</p></div></td></tr>`; return; }
  $("manageBooksBody").innerHTML = filtered.map(b => `<tr><td><strong>${esc(b.title)}</strong></td><td>${esc(b.cat)}</td><td>${b.copies}</td><td><div class="actions-cell"><button class="ghost small" onclick="openBookForm(${b.id})">Edit</button>${viewArchivedBooks ? `<button class="ghost small" onclick="unarchiveBook(${b.id})">Unarchive</button>` : `<button class="ghost danger small" onclick="archiveBook(${b.id})">Archive</button>`}</div></td></tr>`).join("");
}

function toggleViewArchivedBooks() {
  viewArchivedBooks = !viewArchivedBooks;
  renderManageBooks();
}

function exportBooksCsv() {
  const filtered = books.filter(b => !b.is_archived);
  const cell = v => { let s = String(v ?? ""); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const header = ["ID", "Title", "Category", "Author", "Published", "Copies", "Summary"];
  const rows = filtered.map(b => [b.id, b.title, b.cat, b.author, b.published, b.copies, b.summary]);
  const csv = "﻿" + [header, ...rows].map(r => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), a = document.createElement("a");
  a.href = url; a.download = `library-books-${today()}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

$("adminBookSearch").oninput = renderManageBooks; $("adminCatFilter").onchange = renderManageBooks; $("sortAdminBooks").onchange = renderManageBooks;

function openBookForm(id = null) {
  $("bfId").value = id || ""; $("bookFormTitle").textContent = id ? "Edit Book" : "Add New Book";
  if (id) {
    const b = books.find(x => x.id === id); $("bfTitle").value = b.title; $("bfCategory").value = b.cat;
    const activeLoans = borrowedCount(id), pendingReqs = requests.filter(r => r.bookId === id).length;
    minCopiesAllowed = Math.max(1, activeLoans); $("bfCopies").value = b.copies; $("btnMinusCopies").disabled = (b.copies <= minCopiesAllowed);
    $("bfStats").innerHTML = `<div style="display:flex; align-items:center; gap:6px; margin-top:4px;"><span style="color:#f59e0b;">●</span> <strong>${activeLoans}</strong> currently borrowed</div><div style="display:flex; align-items:center; gap:6px; margin-top:2px;"><span style="color:#6366f1;">●</span> <strong>${pendingReqs}</strong> pending requests</div>`;
    $("bfAuthor").value = b.author || ""; $("bfPublished").value = b.published || ""; $("bfCoverUrl").value = b.cover_url || ""; $("bfReferenceUrl").value = b.reference_url || ""; $("bfIcon").value = b.icon || "📘"; $("bfSummary").value = b.summary || "";
  } else {
    minCopiesAllowed = 1; $("bfTitle").value = ""; $("bfCategory").value = "IT"; $("bfCopies").value = 1; $("btnMinusCopies").disabled = true; $("bfStats").innerHTML = ""; $("bfAuthor").value = ""; $("bfPublished").value = new Date().getFullYear(); $("bfCoverUrl").value = ""; $("bfReferenceUrl").value = ""; $("bfIcon").value = "📘"; $("bfSummary").value = "";
  }
  $("bookFormModal").hidden = false;
}

function adjustCopies(change) { let val = parseInt($("bfCopies").value) || 1, newVal = val + change; if (newVal < minCopiesAllowed) { showConfirm("Stock Limit Reached", `You cannot reduce the stock below ${minCopiesAllowed} because there are currently ${minCopiesAllowed} active loans for this book.`, "Okay", () => {}); return; } $("bfCopies").value = newVal; $("btnMinusCopies").disabled = (newVal <= minCopiesAllowed); }

function saveBook() {
  const id = $("bfId").value, title = $("bfTitle").value, cat = $("bfCategory").value, copies = parseInt($("bfCopies").value), author = $("bfAuthor").value, published = $("bfPublished").value, icon = $("bfIcon").value, summary = $("bfSummary").value, coverUrl = $("bfCoverUrl").value.trim(), referenceUrl = $("bfReferenceUrl").value.trim();
  if (!title) { showConfirm("Missing Field", "Title is required.", "Okay", () => {}); return; }
  if (id) {
    if (copies < minCopiesAllowed) { showConfirm("Stock Limit Reached", `Cannot set copies below ${minCopiesAllowed} due to active loans.`, "Okay", () => {}); return; }
    const b = books.find(x => x.id == id); b.title = title; b.cat = cat; b.copies = copies; b.author = author; b.published = published; b.icon = icon; b.summary = summary; b.cover_url = coverUrl; b.reference_url = referenceUrl; promoteWaitlist(b.id);
  } else { books.push({ id: Date.now(), title, cat, copies, author, published, icon, summary, cover_url: coverUrl, reference_url: referenceUrl, is_archived: false }); }
  save(); $("bookFormModal").hidden = true; renderManageBooks();
}

function archiveBook(id) { showConfirm("Archive Book", "Are you sure you want to archive this book? It will be hidden from the catalog but kept in the database.", "Archive", () => { const b = books.find(x => x.id === id); if (b) b.is_archived = true; save(); renderManageBooks(); }, false); }
function unarchiveBook(id) { const b = books.find(x => x.id === id); if (b) b.is_archived = false; save(); renderManageBooks(); }

// ---- MANAGE USERS ----
function renderManageUsers() {
  $("btnViewArchivedUsers").textContent = viewArchivedUsers ? "Show Active" : "Show Archived";
  const q = $("adminUserSearch").value.toLowerCase();
  const filtered = users.filter(u => (viewArchivedUsers ? u.is_archived : !u.is_archived) && (!q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || (u.studentNum && u.studentNum.toLowerCase().includes(q)) || (u.section && u.section.toLowerCase().includes(q))));
  if (filtered.length === 0) { $("manageUsersBody").innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-state-icon">👥</div><h3>No accounts found</h3><p>Try adjusting your search.</p></div></td></tr>`; return; }
  $("manageUsersBody").innerHTML = filtered.map(u => `<tr><td><strong>${esc(u.name)}</strong></td><td>${esc(u.username)}</td><td><span class="cat" style="background:color-mix(in srgb, var(--primary) 15%, transparent); color:var(--primary);">${esc(u.role)}</span></td><td><div class="actions-cell"><button class="ghost small" onclick="openUserForm(${u.id})">Edit</button>${u.id !== currentUser.id ? (viewArchivedUsers ? `<button class="ghost small" onclick="unarchiveUser(${u.id})">Unarchive</button>` : `<button class="ghost danger small" onclick="archiveUser(${u.id})">Archive</button>`) : ''}</div></td></tr>`).join("");
}

function toggleViewArchivedUsers() {
  viewArchivedUsers = !viewArchivedUsers;
  renderManageUsers();
}

function exportUsersCsv() {
  const filtered = users.filter(u => !u.is_archived);
  const cell = v => { let s = String(v ?? ""); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const header = ["ID", "Name", "Username", "Role", "Student ID", "Section"];
  const rows = filtered.map(u => [u.id, u.name, u.username, u.role, u.studentNum, u.section]);
  const csv = "﻿" + [header, ...rows].map(r => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), a = document.createElement("a");
  a.href = url; a.download = `library-users-${today()}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

$("adminUserSearch").oninput = renderManageUsers;

function toggleUserFields() { $("ufStudentFields").style.display = ($("ufRole").value === "Student") ? "flex" : "none"; }
$("ufRole").onchange = toggleUserFields;

function openUserForm(id = null) {
  $("ufId").value = id || ""; $("userFormTitle").textContent = id ? "Edit User" : "Add User";
  if (id) { const u = users.find(x => x.id === id); $("ufName").value = u.name; $("ufUsername").value = u.username; $("ufPassword").value = u.password; $("ufRole").value = u.role; $("ufStudentNum").value = u.studentNum || ""; $("ufSection").value = u.section || ""; }
  else { $("ufName").value = ""; $("ufUsername").value = ""; $("ufPassword").value = ""; $("ufRole").value = "Student"; $("ufStudentNum").value = ""; $("ufSection").value = ""; }
  toggleUserFields(); $("userFormModal").hidden = false;
}

function saveUser() {
  const id = $("ufId").value, name = $("ufName").value, username = $("ufUsername").value, password = $("ufPassword").value, role = $("ufRole").value, studentNum = $("ufStudentNum").value, section = $("ufSection").value;
  if (!name || !username || !password) { showConfirm("Missing Fields", "All fields are required.", "Okay", () => {}); return; }
  if (id) { const u = users.find(x => x.id == id); u.name = name; u.username = username; u.password = password; u.role = role; u.studentNum = studentNum; u.section = section; }
  else { users.push({ id: Date.now(), name, username, password, role, studentNum, section, is_archived: false }); }
  save(); $("userFormModal").hidden = true; renderManageUsers();
}

function archiveUser(id) { showConfirm("Archive Account", "Are you sure you want to archive this user account?", "Archive", () => { const u = users.find(x => x.id === id); if (u) u.is_archived = true; save(); renderManageUsers(); }, false); }
function unarchiveUser(id) { const u = users.find(x => x.id === id); if (u) u.is_archived = false; save(); renderManageUsers(); }

// ---- SUPPORT TICKETS ----
let currentTicketId = null;
function switchTicketView(view) { currentTicketView = view; document.querySelectorAll('#ticketTabs .tab-btn').forEach(btn => btn.classList.remove('active')); if(view === 'ongoing') $("tabOngoing").classList.add('active'); else $("tabResolved").classList.add('active'); renderTickets(); }

function renderTickets() {
  const isStudent = currentUser.role === 'Student';
  let displayTickets = isStudent ? tickets.filter(t => t.userId === currentUser.id) : tickets.filter(t => currentTicketView === 'ongoing' ? t.status === 'Open' : t.status === 'Resolved');
  displayTickets.sort((a,b) => isStudent ? new Date(b.time || b.date) - new Date(a.time || a.date) : (currentTicketView === 'ongoing' ? new Date(a.time || a.date) - new Date(b.time || b.date) : new Date(b.time || b.date) - new Date(a.time || a.date)));
  
  if (displayTickets.length === 0) { $("ticketsBody").innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon">🎫</div><h3>No tickets found</h3><p>There are no support tickets in this view.</p></div></td></tr>`; return; }
  
  const ongoingTickets = tickets.filter(t => t.status === 'Open').sort((a,b) => new Date(a.time || a.date) - new Date(b.time || b.date));
  $("ticketsBody").innerHTML = displayTickets.map(t => {
    let queueNumHtml = !isStudent ? (currentTicketView === 'ongoing' ? `<td><span class="queue-badge">#${ongoingTickets.findIndex(x => x.id === t.id) + 1}</span></td>` : `<td>—</td>`) : "";
    const tTime = t.time || t.date;
    return `<tr>${queueNumHtml}<td style="font-size: 12px; color: var(--muted);">${esc(dateFmt(tTime))}</td><td><strong>${esc(t.subject)}</strong></td><td>${esc(t.userName)}</td><td><span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: ${t.status === 'Open' ? 'color-mix(in srgb, #f59e0b 15%, transparent)' : 'color-mix(in srgb, #10b981 15%, transparent)'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">${t.status}</span></td><td><div class="actions-cell">${!isStudent ? `<button class="ghost small" onclick="toggleTicketStatus(${t.id})">${t.status === 'Open' ? 'Close Chat' : 'Reopen Chat'}</button>` : ''}<button class="ghost small" onclick="viewTicket(${t.id})">View / Reply</button></div></td></tr>`;
  }).join("");
}

function toggleTicketStatus(id) { if (currentUser.role === 'Student') return; const t = tickets.find(x => x.id === id); if (!t) return; t.status = (t.status === 'Open') ? 'Resolved' : 'Open'; if (t.status === 'Open') t.time = new Date().toLocaleString(); save(); renderTickets(); }
function openTicketForm() { $("tSubject").value = ""; $("tDesc").value = ""; $("tErr").textContent = ""; $("ticketFormModal").hidden = false; }

function submitTicket() {
  const subject = $("tSubject").value.trim(), desc = $("tDesc").value.trim();
  if(!subject || !desc) { $("tErr").textContent = "Please fill in all fields."; return; }
  tickets.unshift({ id: Date.now(), userId: currentUser.id, userName: currentUser.name, subject, desc, date: today(), time: new Date().toLocaleString(), status: "Open", replies: [] });
  save(); $("ticketFormModal").hidden = true; renderTickets();
}

function viewTicket(id) {
  currentTicketId = id; const t = tickets.find(x => x.id === id); const tTime = t.time || t.date;
  $("vtSubject").textContent = t.subject; $("vtUser").textContent = t.userName; $("vtDate").textContent = dateFmt(tTime); $("vtDesc").textContent = t.desc; $("replyText").value = "";
  $("vtStatusBadge").innerHTML = `<span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: ${t.status === 'Open' ? 'color-mix(in srgb, #f59e0b 15%, transparent)' : 'color-mix(in srgb, #10b981 15%, transparent)'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">Status: ${t.status}</span>`;
  const rContainer = $("ticketReplies");
  if (!t.replies || t.replies.length === 0) rContainer.innerHTML = `<p style="font-size: 13px; color: var(--muted); font-style: italic; text-align: center;">No replies yet.</p>`;
  else rContainer.innerHTML = t.replies.map(r => `<div class="reply-bubble ${r.sender === 'Admin' || r.sender === 'Bookkeeper' ? 'admin' : 'student'}"><strong>${esc(r.sender)}:</strong> ${esc(r.text)}<div class="reply-meta">${esc(r.date)}</div></div>`).join("");
  if (t.status === 'Open') { $("replyArea").style.display = "flex"; $("resolvedMessage").style.display = "none"; } else { $("replyArea").style.display = "none"; $("resolvedMessage").style.display = "block"; }
  $("viewTicketModal").hidden = false;
}

function submitReply() {
  const text = $("replyText").value.trim(); if (!text) return;
  const t = tickets.find(x => x.id === currentTicketId); if (!t) return;
  if (!t.replies) t.replies = [];
  t.replies.push({ sender: currentUser.role, text, date: new Date().toLocaleString() });
  save(); viewTicket(currentTicketId); renderTickets();
}

// ---- DASHBOARD ----
function renderDashboard() {
  const catalog = books.filter(b => !b.is_archived), overdue = loans.filter(l => dayDiff(l.due, today()) < 0), dueSoon = loans.filter(l => { const d = dayDiff(l.due, today()); return d >= 0 && d <= 3; }).sort((a, b) => String(a.due).localeCompare(String(b.due)));
  const fines = overdue.reduce((sum, l) => sum + fineFor(l.due), 0), waitlisted = requests.filter(r => r.isWaitlist).length, plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
  $("dashDate").textContent = new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" });
  const rows = [];
  if (overdue.length) rows.push({ tone: "red", n: overdue.length, text: overdue.length === 1 ? "overdue loan" : "overdue loans", sub: `${money(fines)} in late fines so far`, go: "loans", cta: "View loans" });
  const pending = requests.length + extensionRequests.length;
  if (pending) { const parts = []; if (requests.length) parts.push(plural(requests.length, "borrow request")); if (extensionRequests.length) parts.push(plural(extensionRequests.length, "extension request")); rows.push({ tone: "teal", n: pending, text: pending === 1 ? "request waiting for a decision" : "requests waiting for a decision", sub: parts.join(", ") + (waitlisted ? ` (${waitlisted} on the waitlist)` : ""), go: "requests", cta: "Review" }); }
  if (dueSoon.length) rows.push({ tone: "amber", n: dueSoon.length, text: dueSoon.length === 1 ? "loan due in the next 3 days" : "loans due in the next 3 days", sub: `Next up: ${titleOf(dueSoon[0].bookId)}`, go: "loans", cta: "View loans" });
  $("dashAttn").innerHTML = rows.length ? rows.map(r => `<button class="attn-row ${r.tone}" onclick="switchView('${r.go}')"><span class="attn-num">${r.n}</span><span class="attn-text"><strong>${r.text}</strong><small>${esc(r.sub)}</small></span><span class="attn-go">${r.cta}</span></button>`).join("") : `<p class="dash-empty">You're all caught up. There are no overdue loans or pending requests.</p>`;
  const totalCopies = catalog.reduce((s, b) => s + b.copies, 0), onLoan = catalog.reduce((s, b) => s + Math.min(b.copies, borrowedCount(b.id)), 0), onShelf = totalCopies - onLoan, loanPct = totalCopies ? Math.round(onLoan / totalCopies * 100) : 0, outOfStock = catalog.filter(b => b.copies - borrowedCount(b.id) <= 0).length;
  $("dashShelf").innerHTML = `<div class="shelf-bar" role="img" aria-label="${onShelf} copies on the shelf, ${onLoan} on loan"><span class="shelf-loan" style="width: ${loanPct}%"></span></div><ul class="shelf-legend"><li><i class="dot shelf"></i><span>Copies on the shelf</span><strong>${onShelf}</strong></li><li><i class="dot loan"></i><span>Copies on loan</span><strong>${onLoan}</strong></li></ul><ul class="dash-list shelf-facts"><li><span>Titles in the catalog</span><strong>${catalog.length}</strong></li><li><span>Titles out of stock</span><strong class="${outOfStock ? "bad" : ""}">${outOfStock}</strong></li></ul>`;
  const counts = {}; [...loans, ...history].forEach(l => { counts[l.bookId] = (counts[l.bookId] || 0) + 1; }); const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  $("dashTop").innerHTML = top.length ? `<ol class="dash-list">${top.map(([id, n]) => `<li><span>${esc(titleOf(Number(id)))}</span><strong>${n}×</strong></li>`).join("")}</ol>` : `<p class="dash-empty">Nothing has been borrowed yet.</p>`;
  const attention = [...overdue, ...dueSoon].sort((a, b) => String(a.due).localeCompare(String(b.due)));
  $("dashDue").innerHTML = attention.length ? `<ul class="dash-list">${attention.map(l => `<li><span><strong>${esc(titleOf(l.bookId))}</strong><br><small>${esc(l.borrower)}, due ${esc(dateFmt(l.due))}</small></span>${dueBadge(l.due)}</li>`).join("")}</ul>` : `<p class="dash-empty">Nothing is overdue or due in the next 3 days.</p>`;
}

// ---- STUDENT NOTIFICATIONS ----
const seenKey = () => `seenNotifs_${currentUser.id}`, getSeen = () => { try { return JSON.parse(localStorage.getItem(seenKey()) || "[]"); } catch (e) { return []; } };
function renderNotifications() {
  const box = $("notifBanner"); if (!currentUser || currentUser.role !== "Student") { box.hidden = true; return; }
  const seen = getSeen(), weekAgo = Date.now() - 7 * 86400000;
  const items = [ ...loans.filter(l => l.borrowerId === currentUser.id && l.id > weekAgo).map(l => ({ key: "L" + l.id, ok: true, target: "loans", action: "View loan", text: `Approved: <strong>${esc(titleOf(l.bookId, "a book"))}</strong> — due ${esc(dateFmt(l.due))}` })), ...rejections.filter(r => r.studentId === currentUser.id && !r.is_archived && new Date(r.dateProcessed) > weekAgo).map(r => ({ key: "R" + r.id, ok: false, target: "history", action: "View history", text: `Rejected: <strong>${esc(titleOf(r.bookId, "a book"))}</strong> — ${esc(r.reason)}` })) ].filter(n => !seen.includes(n.key));
  box.hidden = items.length === 0;
  box.innerHTML = items.map(n => `<div class="notif ${n.ok ? "ok" : "bad"}"><span>${n.ok ? "✅" : "❌"} ${n.text}</span><button class="ghost small" onclick="openNotification('${n.key}', '${n.target}')">${n.action}</button></div>`).join("") + `<button class="ghost small" onclick="dismissNotifications()">Dismiss</button>`;
}
function openNotification(key, target) {
  localStorage.setItem(seenKey(), JSON.stringify([...new Set([...getSeen(), key])]));
  switchView(target);
}
function dismissNotifications() { const keys = [ ...loans.filter(l => l.borrowerId === currentUser.id).map(l => "L" + l.id), ...rejections.filter(r => r.studentId === currentUser.id).map(r => "R" + r.id) ]; localStorage.setItem(seenKey(), JSON.stringify([...new Set([...getSeen(), ...keys])])); renderNotifications(); }

// ---- PROFILE ----
function openProfile() { $("pfName").value = currentUser.name; $("pfUsername").value = currentUser.username; $("pfInfo").textContent = currentUser.role === "Student" ? `${currentUser.studentNum || "No student ID"} · ${currentUser.section || "No section"}` : currentUser.role; $("pfCurrent").value = ""; $("pfNew").value = ""; $("pfConfirm").value = ""; $("pfErr").textContent = ""; $("profileModal").hidden = false; }
function saveProfile() { const name = $("pfName").value.trim(), current = $("pfCurrent").value, next = $("pfNew").value, confirm = $("pfConfirm").value; if (!name) { $("pfErr").textContent = "Name can't be empty."; return; } if (next || confirm || current) { if (current !== currentUser.password) { $("pfErr").textContent = "Current password is incorrect."; return; } if (next.length < 4) { $("pfErr").textContent = "New password must be at least 4 characters."; return; } if (next !== confirm) { $("pfErr").textContent = "New passwords don't match."; return; } currentUser.password = next; } currentUser.name = name; save(); refreshUserChip(); $("profileModal").hidden = true; }

// ---- INIT (Skeletal Loading) ----
async function initApp() {
  $("books").innerHTML = Array(8).fill(0).map(() => `<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div></div>`).join("");
  
  try {
    const response = await fetch('api.php?action=load&t=' + Date.now(), { cache: 'no-store' });
    const data = await response.json();
    
    let needsSave = false;
    if (!data.users || data.users.length === 0) { users = seedUsers; books = seedBooks; needsSave = true; } else { users = data.users; books = data.books || []; }
    loans = data.loans || []; history = data.history || []; requests = data.requests || []; rejections = data.rejections || []; extensionRequests = data.extension_requests || []; tickets = data.tickets || [];
    extensionRequests = extensionRequests.filter(r => loans.some(l => l.id === r.loanId));
    if (needsSave) await save(); 

    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      const saved = JSON.parse(savedSession), id = (saved && typeof saved === "object") ? saved.id : saved;
      const user = users.find(u => u.id === id && !u.is_archived);
      if (user) { currentUser = user; showApp(); } else localStorage.removeItem("session");
    }
  } catch (error) {
    console.error("Failed to load initial data from database:", error);
    $("books").innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Connection Failed</h3><p>Could not connect to the database.</p></div>`;
  }
}

// Start the app
initApp();