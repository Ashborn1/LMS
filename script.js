// ---- Seed Users (Fallback only) ----
const seedUsers = [
  { id: 1, name: "System Admin", username: "admin", password: "admin123", role: "Admin", is_archived: false },
  { id: 2, name: "Head Bookkeeper", username: "keeper", password: "keeper123", role: "Bookkeeper", is_archived: false },
  { id: 3, name: "Juan Dela Cruz", username: "student", password: "student123", role: "Student", studentNum: "2024-00123", section: "BSIT 2-A", is_archived: false }
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

// Archived View Toggles
let viewArchivedUsers = false;
let viewArchivedBooks = false;
let viewArchivedHistory = false;

const $ = id => document.getElementById(id);

// ---- THEME DROPDOWN LOGIC ----
const savedTheme = localStorage.getItem("themeName") || "midnight-ocean";
document.documentElement.setAttribute("data-theme", savedTheme);

function toggleThemeDropdown(e) {
  e.stopPropagation();
  const dd = $("themeDropdown");
  dd.style.display = dd.style.display === "none" ? "flex" : "none";
}

document.addEventListener("click", (e) => {
  const dd = $("themeDropdown");
  const btn = $("themeBtn");
  if (dd && dd.style.display === "flex" && !btn.contains(e.target) && !dd.contains(e.target)) {
    dd.style.display = "none";
  }
});

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

async function save() {
  if (currentUser) {
    localStorage.setItem("session", JSON.stringify(currentUser));
  }

  const payload = {
    users: users,
    books: books,
    loans: loans,
    history: history,
    requests: requests,
    rejections: rejections,
    extensionRequests: extensionRequests,
    tickets: tickets
  };

  try {
    const response = await fetch('api.php?action=sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const text = await response.text();
    
    try {
      const result = JSON.parse(text);
      if (result.error) {
        alert("MySQL Save Error:\n" + result.error);
      }
    } catch (e) {
      alert("PHP Error:\n" + text.substring(0, 300));
    }
  } catch (error) {
    alert("Failed to connect to api.php. Is XAMPP running?");
  }
}

function getThemeClass(cat) {
  if (cat === "IT") return "theme-it";
  if (cat === "Science") return "theme-science";
  if (cat === "English") return "theme-english";
  if (cat === "Social Studies") return "theme-social";
  return "";
}

const borrowedCount = id => loans.filter(l => l.bookId === id).length;

function showConfirm(title, message, confirmText, callback) {
  $("gcTitle").textContent = title;
  $("gcMessage").textContent = message;
  $("gcConfirmBtn").textContent = confirmText;
  pendingConfirmAction = callback;
  $("globalConfirmModal").hidden = false;
}

$("gcConfirmBtn").onclick = () => {
  if (pendingConfirmAction) pendingConfirmAction();
  $("globalConfirmModal").hidden = true;
  pendingConfirmAction = null;
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach(m => m.hidden = true);
    $("themeDropdown").style.display = "none";
  }
});

$("loginForm").onsubmit = (e) => {
  e.preventDefault();
  $("loginErr").textContent = "";
  
  const u = $("user").value.trim();
  const p = $("pass").value;
  // Prevent archived users from logging in
  const found = users.find(x => x.username === u && x.password === p && !x.is_archived);
  
  if (found) {
    currentUser = found;
    localStorage.setItem("session", JSON.stringify(found));
    showApp();
  } else {
    $("loginErr").textContent = "Invalid username or password.";
  }
};

$("logout").onclick = () => {
  localStorage.removeItem("session");
  currentUser = null;
  $("auth").hidden = false;
  $("app").hidden = true;
};

function openAuthTicketModal(e) {
  e.preventDefault();
  $("authName").value = "";
  $("authUser").value = "";
  $("authDesc").value = "";
  $("authErr").textContent = "";
  $("authTicketModal").hidden = false;
}

function submitAuthTicket() {
  const name = $("authName").value.trim();
  const user = $("authUser").value.trim();
  const desc = $("authDesc").value.trim();
  
  if (!name || !user || !desc) {
    $("authErr").textContent = "Please fill in all fields.";
    return;
  }
  
  const newTicketId = Date.now();
  
  tickets.unshift({
    id: newTicketId,
    userId: "guest",
    userName: name + " (Guest)",
    subject: "Account Recovery: " + user,
    desc: desc,
    date: new Date().toISOString().slice(0, 10), 
    time: new Date().toLocaleString(), 
    status: "Open",
    replies: []
  });
  
  let guestTickets = JSON.parse(localStorage.getItem("guestTickets") || "[]");
  guestTickets.push(newTicketId);
  localStorage.setItem("guestTickets", JSON.stringify(guestTickets));
  
  save();
  $("authTicketModal").hidden = true;
  
  $("guestTicketsModal").hidden = false;
  renderGuestTickets();
}

function openGuestTickets(e) {
  e.preventDefault();
  renderGuestTickets();
  $("guestTicketsModal").hidden = false;
}

function renderGuestTickets() {
  const guestTickets = JSON.parse(localStorage.getItem("guestTickets") || "[]");
  const myTickets = tickets.filter(t => guestTickets.includes(t.id));
  
  const container = $("guestTicketsList");
  
  if (myTickets.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--muted); font-style: italic;">You haven't submitted any tickets yet.</p>`;
    return;
  }
  
  container.innerHTML = myTickets.map(t => {
    const tTime = t.time || t.date;
    
    let repliesHtml = "";
    if (t.replies && t.replies.length > 0) {
      repliesHtml = `<div class="guest-ticket-replies">
        ${t.replies.map(r => `
          <div class="reply-bubble ${r.sender === 'Admin' || r.sender === 'Bookkeeper' ? 'admin' : 'student'}">
            <strong>${r.sender}:</strong> ${r.text}
            <div class="reply-meta">${r.date}</div>
          </div>
        `).join("")}
      </div>`;
    }

    let replyInput = "";
    if (t.status === 'Open') {
      replyInput = `
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <input id="greply-${t.id}" placeholder="Type your reply..." style="flex: 1; padding: 8px; font-size: 13px; border-radius: 6px;">
          <button class="small" onclick="submitGuestReply(${t.id})">Send</button>
        </div>
      `;
    } else {
      replyInput = `<p style="font-size: 12px; color: var(--muted); margin-top: 8px; font-style: italic;">This ticket is resolved. The Admin must reopen it for you to chat.</p>`;
    }

    return `
      <div class="guest-ticket-card">
        <div class="guest-ticket-header">
          <div>
            <div class="guest-ticket-title">${t.subject}</div>
            <div class="guest-ticket-date">Submitted on ${tTime}</div>
          </div>
          <span style="padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: ${t.status === 'Open' ? 'color-mix(in srgb, #f59e0b 15%, transparent)' : 'color-mix(in srgb, #10b981 15%, transparent)'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">
            ${t.status}
          </span>
        </div>
        <div class="guest-ticket-desc">"${t.desc}"</div>
        ${repliesHtml}
        ${replyInput}
      </div>
    `;
  }).join("");
}

function submitGuestReply(ticketId) {
  const input = $(`greply-${ticketId}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  const t = tickets.find(x => x.id === ticketId);
  if (!t) return;
  
  if (!t.replies) t.replies = [];
  
  t.replies.push({
    sender: "Guest",
    text: text,
    date: new Date().toLocaleString()
  });
  
  save();
  renderGuestTickets();
}

function showApp() {
  $("auth").hidden = true;
  $("app").hidden = false;
  $("whoName").textContent = currentUser.name;
  $("whoRole").textContent = currentUser.role;
  
  const isStudent = currentUser.role === "Student";
  const isBookkeeper = currentUser.role === "Bookkeeper";
  const isAdmin = currentUser.role === "Admin";

  $("navCatalog").hidden = isAdmin;
  $("navMyRequests").hidden = !isStudent; 
  $("navRequests").hidden = !isBookkeeper;
  $("navLoans").hidden = isAdmin;
  $("navHistory").hidden = isAdmin;
  $("navBooks").hidden = !isBookkeeper;
  $("navUsers").hidden = !isAdmin;
  $("navTickets").hidden = isBookkeeper;

  $("btnNewTicket").style.display = isAdmin ? "none" : "block";
  $("ticketTabs").style.display = isAdmin ? "flex" : "none";
  $("thQueue").style.display = isAdmin ? "table-cell" : "none";

  // Default view based on role
  if (isAdmin) switchView("users");
  else if (isBookkeeper) switchView("requests");
  else switchView("catalog");
}

function switchView(viewName) {
  ['info', 'catalog', 'my-requests', 'requests', 'loans', 'history', 'books', 'users', 'tickets'].forEach(v => {
    $("view-" + v).hidden = true;
    const navBtn = $("nav" + v.charAt(0).toUpperCase() + v.slice(1).replace('-', ''));
    if (navBtn) navBtn.classList.remove("active");
  });
  
  $("view-" + viewName).hidden = false;
  const activeBtn = $("nav" + viewName.charAt(0).toUpperCase() + viewName.slice(1).replace('-', ''));
  if (activeBtn) activeBtn.classList.add("active");

  if (viewName === 'info') renderGuidelines();
  if (viewName === 'catalog') renderCatalog();
  if (viewName === 'my-requests') renderMyRequests();
  if (viewName === 'requests') renderRequests();
  if (viewName === 'loans') renderLoans();
  if (viewName === 'history') renderHistory();
  if (viewName === 'books') renderManageBooks();
  if (viewName === 'users') renderManageUsers();
  if (viewName === 'tickets') renderTickets();
}

// ---- GUIDELINES RENDER ----
function renderGuidelines() {
  const role = currentUser.role;
  
  const generalRulesDiv = $("generalRulesList");
  const generalRulesTitle = $("generalRulesTitle");
  let generalRulesHtml = "";

  // Dynamic quick rules based on role
  if (role === "Student") {
    generalRulesTitle.textContent = "📌 Student Quick Rules";
    generalRulesHtml = `
      <li><strong>Borrowing Limit:</strong> You can borrow a maximum of <strong>5 books total</strong> at any given time.</li>
      <li><strong>Title Limit:</strong> You can only borrow <strong>1 copy per book title</strong>.</li>
      <li><strong>Loan Period:</strong> Standard borrowing is <strong>14 days</strong>.</li>
      <li><strong>Extensions:</strong> Request extensions before the due date with a <strong>valid reason</strong>.</li>
      <li><strong>Waitlist:</strong> If a book is out of stock, join the waitlist.</li>
    `;
  } else if (role === "Bookkeeper") {
    generalRulesTitle.textContent = "📌 Bookkeeper Quick Rules";
    generalRulesHtml = `
      <li><strong>Enforce Limits:</strong> Ensure students do not exceed <strong>5 active loans</strong> or request more than 1 copy of the same title.</li>
      <li><strong>Extensions:</strong> Strictly review the student's reason before approving extensions.</li>
      <li><strong>Approvals:</strong> Set due dates (14 days standard) when accepting borrow requests.</li>
      <li><strong>Returns:</strong> Process returned books promptly to update inventory.</li>
    `;
  } else if (role === "Admin") {
    generalRulesTitle.textContent = "📌 Admin Quick Rules";
    generalRulesHtml = `
      <li><strong>Account Management:</strong> Use "Archive" instead of deleting to preserve records.</li>
      <li><strong>Support:</strong> Monitor and respond to support tickets for account recovery.</li>
      <li><strong>Oversight:</strong> Review archived history and records when necessary.</li>
    `;
  }

  generalRulesDiv.innerHTML = generalRulesHtml;
  
  // Hide all detailed role cards first
  $("guide-admin").style.display = "none";
  $("guide-bookkeeper").style.display = "none";
  $("guide-student").style.display = "none";

  // Show only the detailed card matching the current user's role
  if (role === "Admin") {
    $("guide-admin").style.display = "block";
  } else if (role === "Bookkeeper") {
    $("guide-bookkeeper").style.display = "block";
  } else if (role === "Student") {
    $("guide-student").style.display = "block";
  }
}

// ---- ARCHIVED TOGGLE FUNCTIONS ----
function toggleViewArchivedUsers() {
  viewArchivedUsers = !viewArchivedUsers;
  $("btnViewArchivedUsers").textContent = viewArchivedUsers ? "Show Active" : "Show Archived";
  $("btnViewArchivedUsers").className = viewArchivedUsers ? "small" : "ghost small";
  renderManageUsers();
}

function toggleViewArchivedBooks() {
  viewArchivedBooks = !viewArchivedBooks;
  $("btnViewArchivedBooks").textContent = viewArchivedBooks ? "Show Active" : "Show Archived";
  $("btnViewArchivedBooks").className = viewArchivedBooks ? "small" : "ghost small";
  renderManageBooks();
}

function toggleViewArchivedHistory() {
  viewArchivedHistory = !viewArchivedHistory;
  $("btnViewArchivedHistory").textContent = viewArchivedHistory ? "Show Active" : "Show Archived";
  $("btnViewArchivedHistory").className = viewArchivedHistory ? "small" : "ghost small";
  renderHistory();
}

// ---- CATALOG & BOOK INFO ----
function renderCatalog() {
  const q = $("search").value.toLowerCase();
  const cat = $("catFilter").value;
  const sortBy = $("sortCatalog").value;

  let filtered = books.filter(b => !b.is_archived && (
    !q || b.title.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q) ||
    (b.author && b.author.toLowerCase().includes(q)) || (b.summary && b.summary.toLowerCase().includes(q)) ||
    (b.published && b.published.toString().toLowerCase().includes(q))
  ) && (cat === "all" || b.cat === cat));

  filtered.sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    if (sortBy === "author-asc") return (a.author || "").localeCompare(b.author || "");
    if (sortBy === "author-desc") return (b.author || "").localeCompare(a.author || "");
    if (sortBy === "date-new") return (b.published || "").localeCompare(a.published || "");
    if (sortBy === "date-old") return (a.published || "").localeCompare(b.published || "");
    return 0;
  });

  $("noResults").hidden = filtered.length > 0;

  $("books").innerHTML = filtered.map(b => {
    const avail = b.copies - borrowedCount(b.id);
    const theme = getThemeClass(b.cat);
    
    let actionBtns = "";
    
    if (currentUser.role === 'Student') {
      const alreadyReq = requests.find(r => r.bookId === b.id && r.studentId === currentUser.id);
      const alreadyBorrowed = loans.find(l => l.bookId === b.id && l.borrowerId === currentUser.id);
      
      if (alreadyReq) {
        actionBtns += `<button disabled style="background:color-mix(in srgb, #f59e0b 15%, transparent); color:#b45309; border:1px solid #fcd34d; opacity:1;" onclick="event.stopPropagation()">Requested</button>`;
      } else if (alreadyBorrowed) {
        actionBtns += `<button disabled style="background:color-mix(in srgb, #10b981 15%, transparent); color:#047857; border:1px solid #6ee7b7; opacity:1;" onclick="event.stopPropagation()">Borrowed</button>`;
      } else {
        if (avail > 0) {
          actionBtns += `<button onclick="event.stopPropagation(); openRequest(${b.id}, false)">Borrow</button>`;
        } else {
          actionBtns += `<button style="background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; box-shadow:0 4px 12px rgba(245,158,11,0.3);" onclick="event.stopPropagation(); openRequest(${b.id}, true)">Request</button>`;
        }
      }
    }

    return `<div class="book ${theme}" onclick="openBookInfo(${b.id})">
      <span class="cat">${b.cat}</span>
      <h3>${b.title}</h3>
      <span class="avail">${avail} of ${b.copies} available</span>
      <div class="book-actions">${actionBtns}</div>
    </div>`;
  }).join("");
}

$("search").oninput = renderCatalog;
$("catFilter").onchange = renderCatalog;
$("sortCatalog").onchange = renderCatalog;

function openBookInfo(id) {
  const b = books.find(x => x.id === id);
  if (!b) return;
  $("biCover").textContent = b.icon;
  $("biCover").className = `book-cover-large ${getThemeClass(b.cat)}`;
  $("biTitle").textContent = b.title;
  $("biCategory").textContent = b.cat;
  $("biCategory").className = `cat ${getThemeClass(b.cat)}`;
  $("biAuthor").textContent = b.author || "Unknown";
  $("biPublished").textContent = b.published || "Unknown";
  $("biCopies").textContent = `${b.copies} copies in library`;
  $("biSummary").textContent = b.summary || "No summary provided.";
  $("bookInfoModal").hidden = false;
}

// ---- STUDENT: REQUESTS ----
let requestingBookId = null;
let isWaitlistReq = false;

function openRequest(id, isWaitlist = false) {
  requestingBookId = id;
  isWaitlistReq = isWaitlist;
  const b = books.find(x => x.id === id);
  
  $("reqName").value = currentUser.name;
  $("reqStudentId").value = currentUser.studentNum || "Not Set";
  $("reqSection").value = currentUser.section || "Not Set";
  
  $("reqContact").value = "";
  $("reqNotes").value = "";
  $("reqErr").textContent = "";

  if (isWaitlist) {
    $("reqBookName").innerHTML = `${b.title} <br><span style="color:#b45309; font-size:12px; font-weight:600;">(Out of Stock - Joining Waitlist)</span>`;
  } else {
    $("reqBookName").textContent = b.title;
  }
  
  $("requestModal").hidden = false;
}

function submitRequest() {
  if (!currentUser.studentNum || !currentUser.section) {
    $("reqErr").textContent = "Your profile is missing Student ID or Section. Please contact Admin.";
    return;
  }

  requests.push({
    id: Date.now(),
    bookId: requestingBookId,
    studentId: currentUser.id,
    studentName: currentUser.name,
    reqStudentId: currentUser.studentNum,
    reqSection: currentUser.section,
    reqContact: $("reqContact").value.trim(),
    notes: $("reqNotes").value.trim(),
    isWaitlist: isWaitlistReq,
    dateRequested: new Date().toISOString().slice(0, 10)
  });
  
  save();
  $("requestModal").hidden = true;
  renderCatalog();
}

function renderMyRequests() {
  const myReqs = requests.filter(r => r.studentId === currentUser.id);
  
  $("noMyRequests").hidden = myReqs.length > 0;
  
  $("myRequestsBody").innerHTML = myReqs.map(r => {
    const book = books.find(b => b.id === r.bookId);
    const badge = r.isWaitlist ? `<span style="background:#f59e0b; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:800; margin-left:8px;">WAITLIST</span>` : "";
    
    return `<tr>
      <td><strong>${book ? book.title : "Deleted Book"}</strong> ${badge}</td>
      <td>${r.dateRequested}</td>
      <td>
        <span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: color-mix(in srgb, #f59e0b 15%, transparent); color: #b45309;">
          Pending Approval
        </span>
      </td>
      <td>
        <div class="actions-cell">
          <button class="ghost danger small" onclick="cancelRequest(${r.id})">Cancel Request</button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function cancelRequest(reqId) {
  showConfirm("Cancel Request", "Are you sure you want to cancel this borrow request?", "Cancel Request", () => {
    requests = requests.filter(r => r.id !== reqId);
    save();
    renderMyRequests();
    renderCatalog(); 
  });
}

function renderRequests() {
  $("noRequests").hidden = requests.length > 0;
  $("requestsBody").innerHTML = requests.map(r => {
    const book = books.find(b => b.id === r.bookId);
    const waitlistBadge = r.isWaitlist ? `<span style="display:inline-block; margin-left: 8px; background:#f59e0b; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:800; letter-spacing:0.5px;">WAITLIST</span>` : "";
    
    return `<tr>
      <td><strong>${book ? book.title : "Deleted Book"}</strong></td>
      <td>${r.studentName} ${waitlistBadge}</td>
      <td>${r.dateRequested}</td>
      <td>
        <div class="actions-cell">
          <button class="ghost small" onclick="openViewRequest(${r.id})">View</button>
        </div>
      </td>
    </tr>`;
  }).join("");
  
  renderExtensionRequests();
}

let viewingRequestId = null;

function openViewRequest(reqId) {
  viewingRequestId = reqId;
  const req = requests.find(r => r.id === reqId);
  const b = books.find(x => x.id === req.bookId);
  
  $("vrBookName").textContent = b ? b.title : "Deleted Book";
  $("vrName").textContent = req.studentName;
  $("vrStudentId").textContent = req.reqStudentId || "—";
  $("vrSection").textContent = req.reqSection || "—";
  $("vrContact").textContent = req.reqContact || "—";
  $("vrNotes").textContent = req.notes || "No notes provided.";
  $("vrDate").textContent = req.dateRequested;
  
  $("viewRequestModal").hidden = false;
}

function promptApprove() {
  $("viewRequestModal").hidden = true;
  const req = requests.find(r => r.id === viewingRequestId);
  const b = books.find(x => x.id === req.bookId);
  
  $("appBookName").textContent = `${b.title} for ${req.studentName}`;
  
  const due = new Date();
  due.setDate(due.getDate() + 14);
  $("appDueDate").value = due.toISOString().slice(0, 10);
  
  $("approveModal").hidden = false;
}

function approveRequest() {
  const reqIndex = requests.findIndex(r => r.id === viewingRequestId);
  if (reqIndex === -1) return;
  
  const req = requests[reqIndex];
  const dueDate = $("appDueDate").value;
  
  loans.push({
    id: Date.now(),
    bookId: req.bookId,
    borrowerId: req.studentId,
    borrower: req.studentName,
    due: dueDate,
    notes: req.notes,
    extensions: []
  });
  
  requests.splice(reqIndex, 1);
  save();
  $("approveModal").hidden = true;
  renderRequests();
}

function promptReject() {
  $("viewRequestModal").hidden = true;
  $("rejectReason").value = "";
  $("rejErr").textContent = "";
  $("rejectModal").hidden = false;
}

function submitReject() {
  const reason = $("rejectReason").value.trim();
  if (!reason) {
    $("rejErr").textContent = "Please provide a reason.";
    return;
  }
  
  const reqIndex = requests.findIndex(r => r.id === viewingRequestId);
  const req = requests[reqIndex];
  
  req.status = "Rejected";
  req.reason = reason;
  req.dateProcessed = new Date().toISOString().slice(0, 10);
  req.is_archived = false; 
  rejections.unshift(req);
  
  requests.splice(reqIndex, 1);
  save();
  $("rejectModal").hidden = true;
  renderRequests();
}

// ---- LOANS & EXTENSIONS ----
function renderLoans() {
  const isStudent = currentUser.role === 'Student';
  const visibleLoans = isStudent ? loans.filter(l => l.borrowerId === currentUser.id) : loans;

  $("noLoans").hidden = visibleLoans.length > 0;

  $("loansBody").innerHTML = visibleLoans.map(l => {
    const book = books.find(b => b.id === l.bookId);
    const hasPendingExt = extensionRequests.find(r => r.loanId === l.id);
    
    let actions = `<button class="ghost small" onclick="viewLoanDetails(${l.id}, false)">View</button>`;
    
    if (isStudent) {
      if (hasPendingExt) {
        actions += `<span style="font-size: 12px; color: #b45309; font-weight: 600; margin-left: 8px;">Ext. Pending</span>`;
      } else {
        actions += `<button class="ghost small" style="color:var(--primary); border-color:color-mix(in srgb, var(--primary) 40%, var(--border));" onclick="openExtendRequest(${l.id})">Request Extend</button>`;
      }
    } else {
      actions += `<button class="ghost small" style="color:var(--primary); border-color:color-mix(in srgb, var(--primary) 40%, var(--border));" onclick="openExtendLoan(${l.id})">Extend</button>`;
      actions += `<button class="small" onclick="returnBook(${l.id})">Return</button>`;
    }

    return `<tr>
      <td><strong>${book ? book.title : "Unknown"}</strong></td>
      <td>${l.borrower}</td>
      <td>${l.due}</td>
      <td><div class="actions-cell">${actions}</div></td>
    </tr>`;
  }).join("");
}

function viewLoanDetails(id, isHistory) {
  const loan = isHistory ? history.find(l => l.id === id) : loans.find(l => l.id === id);
  if(!loan) return;
  const book = books.find(b => b.id === loan.bookId);

  $("ldBookName").textContent = book ? book.title : "Unknown";
  $("ldName").textContent = loan.borrower;
  $("ldStatus").textContent = isHistory ? "Returned" : "Active";
  $("ldStatus").style.color = isHistory ? "#10b981" : "#f59e0b";
  $("ldDueDate").textContent = loan.due;
  $("ldNotes").textContent = loan.notes || "No notes provided.";

  if (isHistory) {
    $("ldReturnRow").style.display = "flex";
    $("ldReturnDate").textContent = loan.returnedAt;
  } else {
    $("ldReturnRow").style.display = "none";
  }

  const extArea = $("ldExtensionsArea");
  const extList = $("ldExtensionsList");
  if (loan.extensions && loan.extensions.length > 0) {
    extArea.style.display = "block";
    extList.innerHTML = loan.extensions.map(e => `
      <div style="border-bottom: 1px dashed var(--border); padding-bottom: 8px; margin-bottom: 8px;">
        <div style="font-weight: 600; color: var(--primary);">New Due: ${e.newDue}</div>
        <div><strong>Reason:</strong> ${e.reason}</div>
      </div>
    `).join("");
    extList.lastElementChild.style.border = "none";
    extList.lastElementChild.style.marginBottom = "0";
    extList.lastElementChild.style.paddingBottom = "0";
  } else {
    extArea.style.display = "none";
  }

  $("loanDetailsModal").hidden = false;
}

function viewRejection(id) {
  const r = rejections.find(x => x.id === id);
  if (!r) return;
  const book = books.find(b => b.id === r.bookId);
  
  $("rjBookName").textContent = book ? book.title : "Deleted Book";
  $("rjName").textContent = r.studentName;
  $("rjStudentId").textContent = r.reqStudentId || "—";
  $("rjSection").textContent = r.reqSection || "—";
  $("rjDate").textContent = r.dateRequested;
  $("rjDateProcessed").textContent = r.dateProcessed;
  $("rjReason").textContent = r.reason;
  
  $("viewRejectionModal").hidden = false;
}

let extendingLoanId = null;

function openExtendLoan(id) {
  extendingLoanId = id;
  const loan = loans.find(l => l.id === id);
  $("elBookName").textContent = books.find(b => b.id === loan.bookId).title;
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  $("elNewDate").value = nextWeek.toISOString().slice(0, 10);
  $("elReason").value = "";
  $("elErr").textContent = "";
  
  $("extendLoanModal").hidden = false;
}

function saveExtendLoan() {
  const reason = $("elReason").value.trim();
  const newDate = $("elNewDate").value;
  if(!reason || !newDate) {
    $("elErr").textContent = "Please fill in all fields.";
    return;
  }
  
  const loan = loans.find(l => l.id === extendingLoanId);
  loan.extensions = loan.extensions || [];
  loan.extensions.push({ oldDue: loan.due, newDue: newDate, reason: reason });
  loan.due = newDate;
  
  save();
  $("extendLoanModal").hidden = true;
  renderLoans();
}

let extReqLoanId = null;

function openExtendRequest(loanId) {
  extReqLoanId = loanId;
  const loan = loans.find(l => l.id === loanId);
  const book = books.find(b => b.id === loan.bookId);
  
  $("extReqBookName").textContent = book.title;
  $("extReason").value = "";
  $("extErr").textContent = "";
  $("extendReqModal").hidden = false;
}

function submitExtensionRequest() {
  const reason = $("extReason").value.trim();
  if (!reason) {
    $("extErr").textContent = "Please provide a reason.";
    return;
  }
  
  const loan = loans.find(l => l.id === extReqLoanId);
  
  extensionRequests.push({
    id: Date.now(),
    loanId: extReqLoanId,
    bookName: books.find(b => b.id === loan.bookId).title,
    studentName: currentUser.name,
    reason: reason
  });
  
  save();
  $("extendReqModal").hidden = true;
  renderLoans();
}

function renderExtensionRequests() {
  const extArea = $("requestsBody");
  
  if (extensionRequests.length > 0) {
    extArea.innerHTML += extensionRequests.map(ext => `
      <tr style="background: color-mix(in srgb, #ef4444 5%, transparent);">
        <td><strong>[EXTENSION] ${ext.bookName}</strong></td>
        <td>${ext.studentName}</td>
        <td>Reason: ${ext.reason}</td>
        <td>
          <div class="actions-cell">
            <button class="small" onclick="openExtApprove(${ext.id})">Approve Ext</button>
            <button class="ghost danger small" onclick="rejectExtension(${ext.id})">Reject</button>
          </div>
        </td>
      </tr>
    `).join("");
  }
}

let extAppReqId = null;

function openExtApprove(reqId) {
  extAppReqId = reqId;
  const req = extensionRequests.find(r => r.id === reqId);
  
  $("extAppBookName").textContent = req.bookName;
  $("extAppReason").textContent = `"${req.reason}"`;
  
  const due = new Date();
  due.setDate(due.getDate() + 7);
  $("extAppNewDate").value = due.toISOString().slice(0, 10);
  
  $("extendAppModal").hidden = false;
}

function approveExtension() {
  const reqIdx = extensionRequests.findIndex(r => r.id === extAppReqId);
  if (reqIdx === -1) return;
  
  const req = extensionRequests[reqIdx];
  const loan = loans.find(l => l.id === req.loanId);
  
  const newDue = $("extAppNewDate").value;
  
  loan.extensions = loan.extensions || [];
  loan.extensions.push({ oldDue: loan.due, newDue: newDue, reason: req.reason });
  loan.due = newDue;
  
  extensionRequests.splice(reqIdx, 1);
  save();
  $("extendAppModal").hidden = true;
  switchView("requests");
}

function rejectExtension(id) {
  showConfirm("Reject Extension", "Are you sure you want to reject this extension request?", "Reject", () => {
    extensionRequests = extensionRequests.filter(r => r.id !== id);
    save();
    switchView("requests");
  });
}

function returnBook(loanId) {
  const idx = loans.findIndex(l => l.id === loanId);
  if (idx === -1) return;
  
  const loan = loans[idx];
  loan.returnedAt = new Date().toISOString().slice(0, 10);
  loan.is_archived = false;
  
  history.unshift(loan);
  loans.splice(idx, 1);
  save();
  renderLoans();
}

// ---- HISTORY & ARCHIVING ----
function renderHistory() {
  const isStudent = currentUser.role === 'Student';
  
  if (isStudent) {
    const myHistory = history.filter(h => h.borrowerId === currentUser.id && !h.is_archived).map(h => ({...h, type: 'loan'}));
    const myRejections = rejections.filter(r => r.studentId === currentUser.id && !r.is_archived).map(r => ({...r, type: 'reject'}));
    
    let combined = [...myHistory, ...myRejections].sort((a, b) => {
      const dateA = a.type === 'loan' ? new Date(a.returnedAt) : new Date(a.dateProcessed);
      const dateB = b.type === 'loan' ? new Date(b.returnedAt) : new Date(b.dateProcessed);
      return dateB - dateA;
    });

    $("historyHead").innerHTML = `<tr><th>Book</th><th>Status</th><th>Date</th><th>Notes / Reason</th></tr>`;
    $("noHistory").hidden = combined.length > 0;

    $("historyBody").innerHTML = combined.map(item => {
      if (item.type === 'loan') {
        const book = books.find(b => b.id === item.bookId);
        return `<tr>
          <td><strong>${book ? book.title : "Unknown"}</strong></td>
          <td><span style="color: #10b981; font-weight: 600;">Returned</span></td>
          <td>${item.returnedAt}</td>
          <td style="font-style: italic; color: var(--muted);">${item.notes || "—"}</td>
        </tr>`;
      } else {
        const book = books.find(b => b.id === item.bookId);
        return `<tr>
          <td><strong>${book ? book.title : "Unknown"}</strong></td>
          <td><span style="color: #ef4444; font-weight: 600;">Rejected</span></td>
          <td>${item.dateProcessed}</td>
          <td style="color: #ef4444;"><strong>Reason:</strong> ${item.reason}</td>
        </tr>`;
      }
    }).join("");
    
  } else {
    const combinedHistory = [
      ...history.filter(h => viewArchivedHistory ? h.is_archived : !h.is_archived).map(h => ({ ...h, itemType: 'loan' })),
      ...rejections.filter(r => viewArchivedHistory ? r.is_archived : !r.is_archived).map(r => ({ ...r, itemType: 'rejection' }))
    ].sort((a, b) => {
      const dateA = a.itemType === 'loan' ? new Date(a.returnedAt) : new Date(a.dateProcessed);
      const dateB = b.itemType === 'loan' ? new Date(b.returnedAt) : new Date(b.dateProcessed);
      return dateB - dateA;
    });

    $("historyHead").innerHTML = `<tr><th>Book</th><th>Borrower</th><th>Status</th><th>Date</th><th style="text-align: right;">Actions</th></tr>`;
    $("noHistory").hidden = combinedHistory.length > 0;

    $("historyBody").innerHTML = combinedHistory.map(item => {
      const book = books.find(b => b.id === item.bookId);
      const bookTitle = book ? book.title : "Unknown";
      
      if (item.itemType === 'loan') {
        return `<tr>
          <td><strong>${bookTitle}</strong></td>
          <td>${item.borrower}</td>
          <td><span style="color: #10b981; font-weight: 600;">Returned</span></td>
          <td>${item.returnedAt}</td>
          <td>
            <div class="actions-cell">
              <button class="ghost small" onclick="viewLoanDetails(${item.id}, true)">View</button>
              ${viewArchivedHistory 
                ? `<button class="ghost small" onclick="unarchiveHistory(${item.id})">Unarchive</button>`
                : `<button class="ghost danger small" onclick="archiveHistory(${item.id})">Archive</button>`
              }
            </div>
          </td>
        </tr>`;
      } else {
        return `<tr>
          <td><strong>${bookTitle}</strong></td>
          <td>${item.studentName}</td>
          <td><span style="color: #ef4444; font-weight: 600;">Rejected</span></td>
          <td>${item.dateProcessed}</td>
          <td>
            <div class="actions-cell">
              <button class="ghost small" onclick="viewRejection(${item.id})">View</button>
              ${viewArchivedHistory 
                ? `<button class="ghost small" onclick="unarchiveRejection(${item.id})">Unarchive</button>`
                : `<button class="ghost danger small" onclick="archiveRejection(${item.id})">Archive</button>`
              }
            </div>
          </td>
        </tr>`;
      }
    }).join("");
  }
}

function archiveHistory(id) {
  showConfirm("Archive History", "Are you sure you want to archive this record?", "Archive", () => {
    const h = history.find(x => x.id === id);
    if (h) h.is_archived = true;
    save();
    renderHistory();
  });
}

function unarchiveHistory(id) {
  const h = history.find(x => x.id === id);
  if (h) h.is_archived = false;
  save();
  renderHistory();
}

function archiveRejection(id) {
  showConfirm("Archive Record", "Are you sure you want to archive this rejected request?", "Archive", () => {
    const r = rejections.find(x => x.id === id);
    if (r) r.is_archived = true;
    save();
    renderHistory();
  });
}

function unarchiveRejection(id) {
  const r = rejections.find(x => x.id === id);
  if (r) r.is_archived = false;
  save();
  renderHistory();
}

// ---- BOOKKEEPER: MANAGE BOOKS ----
function renderManageBooks() {
  const q = $("adminBookSearch").value.toLowerCase();
  const cat = $("adminCatFilter").value;
  const sortBy = $("sortAdminBooks").value;

  let filtered = books.filter(b => (viewArchivedBooks ? b.is_archived : !b.is_archived) && (
    !q || b.title.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q) ||
    (b.author && b.author.toLowerCase().includes(q)) || (b.published && b.published.toString().toLowerCase().includes(q))
  ) && (cat === "all" || b.cat === cat));

  filtered.sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    if (sortBy === "author-asc") return (a.author || "").localeCompare(b.author || "");
    if (sortBy === "author-desc") return (b.author || "").localeCompare(a.author || "");
    if (sortBy === "date-new") return (b.published || "").localeCompare(a.published || "");
    if (sortBy === "date-old") return (a.published || "").localeCompare(b.published || "");
    return 0;
  });

  $("manageBooksBody").innerHTML = filtered.map(b => `
    <tr>
      <td><strong>${b.title}</strong></td>
      <td>${b.cat}</td>
      <td>${b.copies}</td>
      <td>
        <div class="actions-cell">
          <button class="ghost small" onclick="openBookForm(${b.id})">Edit</button>
          ${viewArchivedBooks
            ? `<button class="ghost small" onclick="unarchiveBook(${b.id})">Unarchive</button>`
            : `<button class="ghost danger small" onclick="archiveBook(${b.id})">Archive</button>`
          }
        </div>
      </td>
    </tr>
  `).join("");
}

$("adminBookSearch").oninput = renderManageBooks;
$("adminCatFilter").onchange = renderManageBooks;
$("sortAdminBooks").onchange = renderManageBooks;

function openBookForm(id = null) {
  $("bfId").value = id || "";
  $("bookFormTitle").textContent = id ? "Edit Book" : "Add New Book";
  
  if (id) {
    const b = books.find(x => x.id === id);
    $("bfTitle").value = b.title;
    $("bfCategory").value = b.cat;
    
    const activeLoans = borrowedCount(id);
    minCopiesAllowed = Math.max(1, activeLoans); 
    
    $("bfCopies").value = b.copies;
    $("btnMinusCopies").disabled = (b.copies <= minCopiesAllowed);

    const pendingReqs = requests.filter(r => r.bookId === id).length;
    $("bfStats").innerHTML = `
      <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
        <span style="color:#f59e0b;">●</span> <strong>${activeLoans}</strong> currently borrowed
      </div>
      <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
        <span style="color:#6366f1;">●</span> <strong>${pendingReqs}</strong> pending requests
      </div>
    `;
    
    $("bfAuthor").value = b.author || "";
    $("bfPublished").value = b.published || "";
    $("bfIcon").value = b.icon || "📘";
    $("bfSummary").value = b.summary || "";
  } else {
    minCopiesAllowed = 1;
    $("bfTitle").value = "";
    $("bfCategory").value = "IT";
    $("bfCopies").value = 1;
    $("btnMinusCopies").disabled = true;
    $("bfStats").innerHTML = ""; 
    $("bfAuthor").value = "";
    $("bfPublished").value = new Date().getFullYear();
    $("bfIcon").value = "📘";
    $("bfSummary").value = "";
  }
  $("bookFormModal").hidden = false;
}

function adjustCopies(change) {
  let val = parseInt($("bfCopies").value) || 1;
  let newVal = val + change;
  
  if (newVal < minCopiesAllowed) {
    showConfirm("Stock Limit Reached", `You cannot reduce the stock below ${minCopiesAllowed} because there are currently ${minCopiesAllowed} active loans for this book.`, "Okay", () => {});
    return;
  }
  
  $("bfCopies").value = newVal;
  $("btnMinusCopies").disabled = (newVal <= minCopiesAllowed);
}

function saveBook() {
  const id = $("bfId").value;
  const title = $("bfTitle").value;
  const cat = $("bfCategory").value;
  const copies = parseInt($("bfCopies").value);
  const author = $("bfAuthor").value;
  const published = $("bfPublished").value;
  const icon = $("bfIcon").value;
  const summary = $("bfSummary").value;

  if (!title) {
    showConfirm("Missing Field", "Title is required.", "Okay", () => {});
    return;
  }
  
  if (id) {
    if (copies < minCopiesAllowed) {
      showConfirm("Stock Limit Reached", `Cannot set copies below ${minCopiesAllowed} due to active loans.`, "Okay", () => {});
      return;
    }
    const b = books.find(x => x.id == id);
    b.title = title; b.cat = cat; b.copies = copies; b.author = author; b.published = published; b.icon = icon; b.summary = summary;
  } else {
    books.push({
      id: Date.now(), title, cat, copies, author, published, icon, summary, is_archived: false
    });
  }
  save();
  $("bookFormModal").hidden = true;
  renderManageBooks();
}

function archiveBook(id) {
  showConfirm("Archive Book", "Are you sure you want to archive this book? It will be hidden from the catalog but kept in the database.", "Archive", () => {
    const b = books.find(x => x.id === id);
    if (b) b.is_archived = true;
    save();
    renderManageBooks();
  });
}

function unarchiveBook(id) {
  const b = books.find(x => x.id === id);
  if (b) b.is_archived = false;
  save();
  renderManageBooks();
}

// ---- ADMIN: MANAGE USERS ----
function renderManageUsers() {
  const q = $("adminUserSearch").value.toLowerCase();
  
  const filtered = users.filter(u => (viewArchivedUsers ? u.is_archived : !u.is_archived) && (
    !q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) ||
    (u.studentNum && u.studentNum.toLowerCase().includes(q)) || (u.section && u.section.toLowerCase().includes(q))
  ));

  if (filtered.length === 0) {
    $("manageUsersBody").innerHTML = `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--muted)">No accounts match your search.</td></tr>`;
    return;
  }

  $("manageUsersBody").innerHTML = filtered.map(u => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.username}</td>
      <td><span class="cat" style="background:color-mix(in srgb, var(--primary) 15%, transparent); color:var(--primary);">${u.role}</span></td>
      <td>
        <div class="actions-cell">
          <button class="ghost small" onclick="openUserForm(${u.id})">Edit</button>
          ${u.id !== currentUser.id ? (
            viewArchivedUsers 
              ? `<button class="ghost small" onclick="unarchiveUser(${u.id})">Unarchive</button>`
              : `<button class="ghost danger small" onclick="archiveUser(${u.id})">Archive</button>`
          ) : ''}
        </div>
      </td>
    </tr>
  `).join("");
}

$("adminUserSearch").oninput = renderManageUsers;

function toggleUserFields() {
  const role = $("ufRole").value;
  $("ufStudentFields").style.display = (role === "Student") ? "flex" : "none";
}

$("ufRole").onchange = toggleUserFields;

function openUserForm(id = null) {
  $("ufId").value = id || "";
  $("userFormTitle").textContent = id ? "Edit User" : "Add User";
  
  if (id) {
    const u = users.find(x => x.id === id);
    $("ufName").value = u.name;
    $("ufUsername").value = u.username;
    $("ufPassword").value = u.password;
    $("ufRole").value = u.role;
    $("ufStudentNum").value = u.studentNum || "";
    $("ufSection").value = u.section || "";
  } else {
    $("ufName").value = "";
    $("ufUsername").value = "";
    $("ufPassword").value = "";
    $("ufRole").value = "Student";
    $("ufStudentNum").value = "";
    $("ufSection").value = "";
  }
  toggleUserFields();
  $("userFormModal").hidden = false;
}

function saveUser() {
  const id = $("ufId").value;
  const name = $("ufName").value;
  const username = $("ufUsername").value;
  const password = $("ufPassword").value;
  const role = $("ufRole").value;
  const studentNum = $("ufStudentNum").value;
  const section = $("ufSection").value;

  if (!name || !username || !password) {
    showConfirm("Missing Fields", "All fields are required.", "Okay", () => {});
    return;
  }

  if (id) {
    const u = users.find(x => x.id == id);
    u.name = name; u.username = username; u.password = password; u.role = role; u.studentNum = studentNum; u.section = section;
  } else {
    users.push({ id: Date.now(), name, username, password, role, studentNum, section, is_archived: false });
  }
  save();
  $("userFormModal").hidden = true;
  renderManageUsers();
}

function archiveUser(id) {
  showConfirm("Archive Account", "Are you sure you want to archive this user account?", "Archive", () => {
    const u = users.find(x => x.id === id);
    if (u) u.is_archived = true;
    save();
    renderManageUsers();
  });
}

function unarchiveUser(id) {
  const u = users.find(x => x.id === id);
  if (u) u.is_archived = false;
  save();
  renderManageUsers();
}

// ---- SUPPORT TICKETS & REPLIES ----
let currentTicketId = null;

function switchTicketView(view) {
  currentTicketView = view;
  document.querySelectorAll('#ticketTabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  if(view === 'ongoing') $("tabOngoing").classList.add('active');
  else $("tabResolved").classList.add('active');
  renderTickets();
}

function renderTickets() {
  const isStudent = currentUser.role === 'Student';
  
  let displayTickets = [];
  
  if (isStudent) {
    displayTickets = tickets.filter(t => t.userId === currentUser.id);
    displayTickets.sort((a,b) => new Date(b.time || b.date) - new Date(a.time || a.date));
  } else {
    displayTickets = tickets.filter(t => currentTicketView === 'ongoing' ? t.status === 'Open' : t.status === 'Resolved');
    
    displayTickets.sort((a,b) => {
      const timeA = new Date(a.time || a.date).getTime();
      const timeB = new Date(b.time || b.date).getTime();
      return currentTicketView === 'ongoing' ? timeA - timeB : timeB - timeA;
    });
  }
  
  $("noTickets").hidden = displayTickets.length > 0;
  
  const ongoingTickets = tickets.filter(t => t.status === 'Open');
  ongoingTickets.sort((a,b) => new Date(a.time || a.date) - new Date(b.time || b.date));

  $("ticketsBody").innerHTML = displayTickets.map(t => {
    let queueNumHtml = "";
    if (!isStudent) {
      if (currentTicketView === 'ongoing') {
        const qIndex = ongoingTickets.findIndex(x => x.id === t.id) + 1;
        queueNumHtml = `<td><span class="queue-badge">#${qIndex}</span></td>`;
      } else {
        queueNumHtml = `<td>—</td>`;
      }
    }

    const tTime = t.time || t.date;

    return `<tr>
      ${queueNumHtml}
      <td style="font-size: 12px; color: var(--muted);">${tTime}</td>
      <td><strong>${t.subject}</strong></td>
      <td>${t.userName}</td>
      <td>
        <span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: ${t.status === 'Open' ? 'color-mix(in srgb, #f59e0b 15%, transparent)' : 'color-mix(in srgb, #10b981 15%, transparent)'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">
          ${t.status}
        </span>
      </td>
      <td>
        <div class="actions-cell">
          ${!isStudent ? `
            <button class="ghost small" onclick="toggleTicketStatus(${t.id})">
              ${t.status === 'Open' ? 'Close Chat' : 'Reopen Chat'}
            </button>
          ` : ''}
          <button class="ghost small" onclick="viewTicket(${t.id})">View / Reply</button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function toggleTicketStatus(id) {
  if (currentUser.role === 'Student') return;
  
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  
  t.status = (t.status === 'Open') ? 'Resolved' : 'Open';
  
  if (t.status === 'Open') {
    t.time = new Date().toLocaleString();
  }
  
  save();
  renderTickets();
}

function openTicketForm() {
  $("tSubject").value = "";
  $("tDesc").value = "";
  $("tErr").textContent = "";
  $("ticketFormModal").hidden = false;
}

function submitTicket() {
  const subject = $("tSubject").value.trim();
  const desc = $("tDesc").value.trim();
  if(!subject || !desc) {
    $("tErr").textContent = "Please fill in all fields.";
    return;
  }
  
  tickets.unshift({
    id: Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    subject: subject,
    desc: desc,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleString(),
    status: "Open",
    replies: []
  });
  save();
  $("ticketFormModal").hidden = true;
  renderTickets();
}

function viewTicket(id) {
  currentTicketId = id;
  const t = tickets.find(x => x.id === id);
  const tTime = t.time || t.date;
  
  $("vtSubject").textContent = t.subject;
  $("vtUser").textContent = t.userName;
  $("vtDate").textContent = tTime;
  $("vtDesc").textContent = t.desc;
  $("replyText").value = "";

  $("vtStatusBadge").innerHTML = `
    <span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: ${t.status === 'Open' ? 'color-mix(in srgb, #f59e0b 15%, transparent)' : 'color-mix(in srgb, #10b981 15%, transparent)'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">
      Status: ${t.status}
    </span>
  `;

  const rContainer = $("ticketReplies");
  if (!t.replies || t.replies.length === 0) {
    rContainer.innerHTML = `<p style="font-size: 13px; color: var(--muted); font-style: italic; text-align: center;">No replies yet.</p>`;
  } else {
    rContainer.innerHTML = t.replies.map(r => {
      const isAdminReply = r.sender === 'Admin' || r.sender === 'Bookkeeper';
      return `
        <div class="reply-bubble ${isAdminReply ? 'admin' : 'student'}">
          <strong>${r.sender}:</strong> ${r.text}
          <div class="reply-meta">${r.date}</div>
        </div>
      `;
    }).join("");
  }

  if (t.status === 'Open') {
    $("replyArea").style.display = "flex";
    $("resolvedMessage").style.display = "none";
  } else {
    $("replyArea").style.display = "none";
    $("resolvedMessage").style.display = "block";
  }

  $("viewTicketModal").hidden = false;
}

function submitReply() {
  const text = $("replyText").value.trim();
  if (!text) return;
  
  const t = tickets.find(x => x.id === currentTicketId);
  if (!t) return;
  
  if (!t.replies) t.replies = [];
  
  t.replies.push({
    sender: currentUser.role,
    text: text,
    date: new Date().toLocaleString()
  });
  
  save();
  viewTicket(currentTicketId); 
  renderTickets(); 
}

// ---- INIT ----
async function initApp() {
  try {
    const response = await fetch('api.php?action=load&t=' + Date.now(), { cache: 'no-store' });
    const data = await response.json();
    
    let needsSave = false;

    if (!data.users || data.users.length === 0) {
      users = seedUsers;
      needsSave = true;
    } else {
      users = data.users;
    }

    books = data.books || [];
    loans = data.loans || [];
    history = data.history || [];
    requests = data.requests || [];
    rejections = data.rejections || [];
    extensionRequests = data.extension_requests || [];
    tickets = data.tickets || [];

    if (needsSave) {
      await save(); 
    }

    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      currentUser = JSON.parse(savedSession);
      showApp();
    }
  } catch (error) {
    console.error("Failed to load initial data from database:", error);
  }
}

// Start the app
initApp();