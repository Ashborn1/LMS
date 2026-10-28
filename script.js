// ---- Initial Seed Data ----
const seedBooks = [
  { id:1,  title:"Cybersecurity", cat:"IT", copies:10, author:"William Stallings", published:"2022", icon:"🛡️", summary:"A comprehensive guide to securing networks." },
  { id:2,  title:"Networking", cat:"IT", copies:8, author:"Behrouz A. Forouzan", published:"2021", icon:"🌐", summary:"Fundamentals of data communications." },
  { id:3,  title:"Fundamentals", cat:"IT", copies:12, author:"Efraim Turban", published:"2019", icon:"💻", summary:"Introduction to information systems." },
  { id:4,  title:"Web", cat:"IT", copies:7, author:"Jon Duckett", published:"2020", icon:"🕸️", summary:"Guide to front-end web development." },
  { id:5,  title:"HCI", cat:"IT", copies:5, author:"Alan Dix", published:"2018", icon:"🖱️", summary:"Human-Computer Interaction basics." },
  { id:6,  title:"Biology", cat:"Science", copies:9, author:"Sylvia S. Mader", published:"2021", icon:"🧬", summary:"Study of living organisms." },
  { id:7,  title:"Chemistry", cat:"Science", copies:8, author:"Raymond Chang", published:"2019", icon:"🧪", summary:"Composition and properties of matter." },
  { id:8,  title:"Physics", cat:"Science", copies:7, author:"Douglas C. Giancoli", published:"2020", icon:"⚛️", summary:"Principles of mechanics and thermodynamics." },
  { id:9,  title:"Earth Science", cat:"Science", copies:6, author:"Edward J. Tarbuck", published:"2018", icon:"🌍", summary:"Geology and meteorology." },
  { id:10, title:"Environmental Science", cat:"Science", copies:5, author:"G. Tyler Miller", published:"2022", icon:"🌱", summary:"Humans and the natural world." },
  { id:11, title:"Grammar", cat:"English", copies:12, author:"John E. Warriner", published:"2017", icon:"📝", summary:"English grammar and punctuation." },
  { id:12, title:"Literature", cat:"English", copies:8, author:"David Damrosch", published:"2019", icon:"📖", summary:"Anthology of world literature." },
  { id:13, title:"Writing", cat:"English", copies:6, author:"Janet Burroway", published:"2021", icon:"✍️", summary:"Creative writing techniques." },
  { id:14, title:"Reading", cat:"English", copies:10, author:"Linda Hoyt", published:"2018", icon:"📚", summary:"Reading comprehension strategies." },
  { id:15, title:"Speaking", cat:"English", copies:5, author:"Stephen E. Lucas", published:"2020", icon:"🎤", summary:"The art of public speaking." },
  { id:16, title:"Philippine History", cat:"Social Studies", copies:10, author:"Renato Constantino", published:"2015", icon:"🇵🇭", summary:"Nationalist perspective on PH history." },
  { id:17, title:"World History", cat:"Social Studies", copies:8, author:"William J. Duiker", published:"2019", icon:"🏛️", summary:"Global narrative of human history." },
  { id:18, title:"Geography", cat:"Social Studies", copies:7, author:"James M. Rubenstein", published:"2021", icon:"🗺️", summary:"Physical and human geography." },
  { id:19, title:"Economics", cat:"Social Studies", copies:6, author:"Paul A. Samuelson", published:"2018", icon:"📈", summary:"Micro and macroeconomics." },
  { id:20, title:"Civics", cat:"Social Studies", copies:5, author:"James Q. Wilson", published:"2020", icon:"⚖️", summary:"Government structures and citizenship." }
];

const seedUsers = [
  { id: 1, name: "System Admin", username: "admin", password: "admin123", role: "Admin" },
  { id: 2, name: "Head Bookkeeper", username: "keeper", password: "keeper123", role: "Bookkeeper" },
  { id: 3, name: "Juan Dela Cruz", username: "student", password: "student123", role: "Student", studentNum: "2024-00123", section: "BSIT 2-A" }
];

// ---- Load State ----
let users = JSON.parse(localStorage.getItem("users") || "null") || seedUsers;
let books = JSON.parse(localStorage.getItem("books") || "null") || seedBooks;
let loans = JSON.parse(localStorage.getItem("loans") || "[]");
let history = JSON.parse(localStorage.getItem("history") || "[]");
let requests = JSON.parse(localStorage.getItem("requests") || "[]");
let rejections = JSON.parse(localStorage.getItem("rejections") || "[]");
let extensionRequests = JSON.parse(localStorage.getItem("extReqs") || "[]");
let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");

let currentUser = null;
const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("loans", JSON.stringify(loans));
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("requests", JSON.stringify(requests));
  localStorage.setItem("rejections", JSON.stringify(rejections));
  localStorage.setItem("extReqs", JSON.stringify(extensionRequests));
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

function getThemeClass(cat) {
  if (cat === "IT") return "theme-it";
  if (cat === "Science") return "theme-science";
  if (cat === "English") return "theme-english";
  if (cat === "Social Studies") return "theme-social";
  return "";
}

const borrowedCount = id => loans.filter(l => l.bookId === id).length;

// ---- CUSTOM CONFIRM MODAL ----
function showConfirm(title, message, onConfirm) {
  $("confirmTitle").textContent = title;
  $("confirmMessage").textContent = message;
  
  const btn = $("confirmBtn");
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  
  newBtn.onclick = () => {
    $("confirmModal").hidden = true;
    onConfirm();
  };
  
  $("confirmModal").hidden = false;
}

// ---- AUTHENTICATION ----
$("loginForm").onsubmit = (e) => {
  e.preventDefault();
  $("loginErr").textContent = "";
  const u = $("user").value.trim();
  const p = $("pass").value;
  const found = users.find(x => x.username === u && x.password === p);
  
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

// ---- GUEST TICKETS ----
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
    status: "Open",
    replies: []
  });
  
  let guestTickets = JSON.parse(localStorage.getItem("guestTickets") || "[]");
  guestTickets.push(newTicketId);
  localStorage.setItem("guestTickets", JSON.stringify(guestTickets));
  
  save();
  $("authTicketModal").hidden = true;
  alert("Ticket sent! You can track it by clicking 'Track my submitted tickets' below.");
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
    container.innerHTML = `<p style="text-align: center; color: #64748b; font-style: italic;">You haven't submitted any tickets yet.</p>`;
    return;
  }
  
  container.innerHTML = myTickets.map(t => {
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
      replyInput = `<p style="font-size: 12px; color: #64748b; margin-top: 8px; font-style: italic;">This ticket is resolved. The Admin must reopen it for you to chat.</p>`;
    }

    return `
      <div class="guest-ticket-card">
        <div class="guest-ticket-header">
          <div>
            <div class="guest-ticket-title">${t.subject}</div>
            <div class="guest-ticket-date">Submitted on ${t.date}</div>
          </div>
          <span style="padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: ${t.status === 'Open' ? '#fef3c7' : '#d1fae5'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">
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

// ---- APP LOGIC ----
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

  if (isAdmin) switchView("users");
  else if (isBookkeeper) switchView("requests");
  else switchView("catalog");
}

function switchView(viewName) {
  ['catalog', 'my-requests', 'requests', 'loans', 'history', 'books', 'users', 'tickets'].forEach(v => {
    $("view-" + v).hidden = true;
    const navBtn = $("nav" + v.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''));
    if (navBtn) navBtn.classList.remove("active");
  });
  
  $("view-" + viewName).hidden = false;
  const activeBtn = $("nav" + viewName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''));
  if (activeBtn) activeBtn.classList.add("active");

  if (viewName === 'catalog') renderCatalog();
  if (viewName === 'my-requests') renderMyRequests();
  if (viewName === 'requests') renderRequests();
  if (viewName === 'loans') renderLoans();
  if (viewName === 'history') renderHistory();
  if (viewName === 'books') renderManageBooks();
  if (viewName === 'users') renderManageUsers();
  if (viewName === 'tickets') renderTickets();
}

// ---- CATALOG ----
function renderCatalog() {
  const q = $("search").value.toLowerCase();
  const cat = $("catFilter").value;
  const sortBy = $("sortCatalog").value;

  let filtered = books.filter(b => {
    const matchSearch = !q || 
                        b.title.toLowerCase().includes(q) || 
                        b.cat.toLowerCase().includes(q) ||
                        (b.author && b.author.toLowerCase().includes(q)) ||
                        (b.summary && b.summary.toLowerCase().includes(q)) ||
                        (b.published && b.published.toString().toLowerCase().includes(q));
    const matchCat = cat === "all" || b.cat === cat;
    return matchSearch && matchCat;
  });

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
    
    let actionBtns = `<button class="view-btn" onclick="openBookInfo(${b.id})">View</button>`;
    
    if (currentUser.role === 'Student') {
      const alreadyReq = requests.find(r => r.bookId === b.id && r.studentId === currentUser.id);
      const alreadyBorrowed = loans.find(l => l.bookId === b.id && l.borrowerId === currentUser.id);
      
      if (alreadyReq) {
        actionBtns += `<button disabled style="background:#fef3c7; color:#b45309; border:1px solid #fcd34d; opacity:1;">Requested</button>`;
      } else if (alreadyBorrowed) {
        actionBtns += `<button disabled style="background:#d1fae5; color:#047857; border:1px solid #6ee7b7; opacity:1;">Borrowed</button>`;
      } else {
        actionBtns += `<button ${avail === 0 ? "disabled" : ""} onclick="openRequest(${b.id})">Request</button>`;
      }
    }

    return `<div class="book ${theme}">
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

// ---- MY REQUESTS (STUDENT) ----
let editReqId = null;

function renderMyRequests() {
  const myReqs = requests.filter(r => r.studentId === currentUser.id);
  $("noMyRequests").hidden = myReqs.length > 0;
  
  $("myRequestsBody").innerHTML = myReqs.map(r => {
    const book = books.find(b => b.id === r.bookId);
    return `<tr>
      <td><strong>${book ? book.title : "Unknown"}</strong></td>
      <td>${r.dateRequested}</td>
      <td>${r.notes || "—"}</td>
      <td><span style="color: #b45309; font-weight: 600;">Pending</span></td>
      <td>
        <div class="actions-cell">
          <button class="ghost small" onclick="openEditRequest(${r.id})">Edit</button>
          <button class="ghost danger small" onclick="cancelRequest(${r.id})">Cancel</button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function openEditRequest(reqId) {
  editReqId = reqId;
  const req = requests.find(r => r.id === reqId);
  const book = books.find(b => b.id === req.bookId);
  
  $("erBookName").textContent = book ? book.title : "Unknown";
  $("erNotes").value = req.notes || "";
  $("erErr").textContent = "";
  $("editRequestModal").hidden = false;
}

function saveEditRequest() {
  const newNotes = $("erNotes").value.trim();
  const req = requests.find(r => r.id === editReqId);
  
  if (req) {
    req.notes = newNotes;
    save();
    $("editRequestModal").hidden = true;
    renderMyRequests();
  }
}

function cancelRequest(reqId) {
  showConfirm("Cancel Request", "Are you sure you want to cancel this borrow request?", () => {
    requests = requests.filter(r => r.id !== reqId);
    save();
    renderMyRequests();
    renderCatalog(); 
  });
}

// ---- BOOKKEEPER: APPROVE/REJECT REQUESTS ----
function renderRequests() {
  $("noRequests").hidden = requests.length > 0;
  $("requestsBody").innerHTML = requests.map(r => {
    const book = books.find(b => b.id === r.bookId);
    return `<tr>
      <td><strong>${book ? book.title : "Deleted Book"}</strong></td>
      <td>${r.studentName}</td>
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
  rejections.unshift(req);
  
  requests.splice(reqIndex, 1);
  save();
  $("rejectModal").hidden = true;
  renderRequests();
}

// ---- LOANS & EXTENSIONS ----
function renderLoans() {
  const isStudent = currentUser.role === 'Student';
  const visibleLoans = isStudent 
    ? loans.filter(l => l.borrowerId === currentUser.id) 
    : loans;

  $("noLoans").hidden = visibleLoans.length > 0;

  $("loansBody").innerHTML = visibleLoans.map(l => {
    const book = books.find(b => b.id === l.bookId);
    const hasPendingExt = extensionRequests.find(r => r.loanId === l.id);
    
    let actions = `<button class="ghost small" onclick="viewLoanDetails(${l.id}, false)">View</button>`;
    
    if (isStudent) {
      if (hasPendingExt) {
        actions += `<span style="font-size: 12px; color: #b45309; font-weight: 600; margin-left: 8px;">Ext. Pending</span>`;
      } else {
        actions += `<button class="ghost small" style="color:#4f46e5; border-color:#c7d2fe;" onclick="openExtendRequest(${l.id})">Request Extend</button>`;
      }
    } else {
      actions += `<button class="ghost small" style="color:#4f46e5; border-color:#c7d2fe;" onclick="openExtendLoan(${l.id})">Extend</button>`;
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
      <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="font-weight: 600; color: #4f46e5;">New Due: ${e.newDue}</div>
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
      <tr style="background: #fef2f2;">
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
  showConfirm("Reject Extension", "Are you sure you want to reject this extension request?", () => {
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
  
  history.unshift(loan);
  loans.splice(idx, 1);
  save();
  renderLoans();
}

function renderHistory() {
  const isStudent = currentUser.role === 'Student';
  
  if (isStudent) {
    const myHistory = history.filter(h => h.borrowerId === currentUser.id).map(h => ({...h, type: 'loan'}));
    const myRejections = rejections.filter(r => r.studentId === currentUser.id).map(r => ({...r, type: 'reject'}));
    
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
          <td style="font-style: italic; color: #64748b;">${item.notes || "—"}</td>
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
      ...history.map(h => ({ ...h, itemType: 'loan' })),
      ...rejections.map(r => ({ ...r, itemType: 'rejection' }))
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
              <button class="ghost danger small" onclick="deleteHistory(${item.id})">Delete</button>
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
              <button class="ghost danger small" onclick="deleteRejection(${item.id})">Delete</button>
            </div>
          </td>
        </tr>`;
      }
    }).join("");
  }
}

function deleteHistory(id) {
  showConfirm("Delete History Record", "Are you sure you want to permanently delete this record?", () => {
    history = history.filter(h => h.id !== id);
    save();
    renderHistory();
  });
}

function deleteRejection(id) {
  showConfirm("Delete Rejection Record", "Are you sure you want to permanently delete this rejected request?", () => {
    rejections = rejections.filter(r => r.id !== id);
    save();
    renderHistory();
  });
}

// ---- BOOKKEEPER: MANAGE BOOKS ----
function renderManageBooks() {
  const q = $("adminBookSearch").value.toLowerCase();
  const cat = $("adminCatFilter").value;
  const sortBy = $("sortAdminBooks").value;

  let filtered = books.filter(b => {
    const matchSearch = !q || 
                        b.title.toLowerCase().includes(q) || 
                        b.cat.toLowerCase().includes(q) || 
                        (b.author && b.author.toLowerCase().includes(q)) ||
                        (b.published && b.published.toString().toLowerCase().includes(q));
    const matchCat = cat === "all" || b.cat === cat;
    return matchSearch && matchCat;
  });

  filtered.sort((a, b) => {
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    if (sortBy === "author-asc") return (a.author || "").localeCompare(b.author || "");
    if (sortBy === "author-desc") return (b.author || "").localeCompare(a.author || "");
    if (sortBy === "date-new") return (b.published || "").localeCompare(a.published || "");
    if (sortBy === "date-old") return (a.published || "").localeCompare(b.published || "");
    return 0;
  });

  $("manageBooksBody").innerHTML = filtered.map(b => {
    const borrowed = borrowedCount(b.id);
    return `
    <tr>
      <td><strong>${b.title}</strong></td>
      <td>${b.cat}</td>
      <td>${b.copies}</td>
      <td><span style="font-weight: 600; color: ${borrowed > 0 ? '#ef4444' : '#64748b'};">${borrowed}</span></td>
      <td>
        <div class="actions-cell">
          <button class="ghost small" onclick="openBookForm(${b.id})">Edit</button>
          <button class="ghost danger small" onclick="deleteBook(${b.id})">Delete</button>
        </div>
      </td>
    </tr>
  `;
  }).join("");
}

$("adminBookSearch").oninput = renderManageBooks;
$("adminCatFilter").onchange = renderManageBooks;
$("sortAdminBooks").onchange = renderManageBooks;

function adjustCopies(amount) {
  const input = $("bfCopies");
  let currentVal = parseInt(input.value) || 1;
  let newVal = currentVal + amount;
  
  if (newVal < 1) newVal = 1; // Minimum 1 copy total
  
  const id = $("bfId").value;
  if (id) {
    const b = books.find(x => x.id == id);
    const borrowed = borrowedCount(b.id);
    
    if (newVal < borrowed) {
      newVal = borrowed; // Cap at borrowed limit
      $("bfError").textContent = `Cannot reduce stock below ${borrowed} because there are active loans.`;
      setTimeout(() => { $("bfError").textContent = ""; }, 3000);
    }
  }
  
  input.value = newVal;
}

function openBookForm(id = null) {
  $("bfId").value = id || "";
  $("bookFormTitle").textContent = id ? "Edit Book" : "Add New Book";
  $("bfError").textContent = ""; // Clear errors
  
  if (id) {
    const b = books.find(x => x.id === id);
    $("bfTitle").value = b.title;
    $("bfCategory").value = b.cat;
    $("bfCopiesLabel").textContent = `Copies (Currently ${borrowedCount(b.id)} borrowed)`;
    $("bfCopies").value = b.copies;
    $("bfAuthor").value = b.author || "";
    $("bfPublished").value = b.published || "";
    $("bfIcon").value = b.icon || "📘";
    $("bfSummary").value = b.summary || "";
  } else {
    $("bfTitle").value = "";
    $("bfCategory").value = "IT";
    $("bfCopiesLabel").textContent = "Initial Copies";
    $("bfCopies").value = 1;
    $("bfAuthor").value = "";
    $("bfPublished").value = new Date().getFullYear();
    $("bfIcon").value = "📘";
    $("bfSummary").value = "";
  }
  $("bookFormModal").hidden = false;
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
    $("bfError").textContent = "Title is required.";
    return;
  }

  if (id) {
    const b = books.find(x => x.id == id);
    const borrowed = borrowedCount(b.id);
    
    if (copies < borrowed) {
      $("bfError").textContent = `Cannot reduce total copies below ${borrowed} because there are active loans.`;
      return;
    }

    b.title = title; b.cat = cat; b.copies = copies; b.author = author; b.published = published; b.icon = icon; b.summary = summary;
  } else {
    books.push({
      id: Date.now(), title, cat, copies, author, published, icon, summary
    });
  }
  
  save();
  $("bookFormModal").hidden = true;
  renderManageBooks();
}

function deleteBook(id) {
  showConfirm("Delete Book", "Are you sure you want to delete this book? Active loans will be affected.", () => {
    books = books.filter(b => b.id !== id);
    save();
    renderManageBooks();
  });
}

// ---- ADMIN: MANAGE USERS ----
function renderManageUsers() {
  $("manageUsersBody").innerHTML = users.map(u => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.username}</td>
      <td><span class="cat" style="background:#e0e7ff; color:#4f46e5;">${u.role}</span></td>
      <td>
        <div class="actions-cell">
          <button class="ghost small" onclick="openUserForm(${u.id})">Edit</button>
          ${u.id !== currentUser.id ? `<button class="ghost danger small" onclick="deleteUser(${u.id})">Delete</button>` : ''}
        </div>
      </td>
    </tr>
  `).join("");
}

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

  if (!name || !username || !password) return alert("All fields required");

  if (id) {
    const u = users.find(x => x.id == id);
    u.name = name; u.username = username; u.password = password; u.role = role; u.studentNum = studentNum; u.section = section;
  } else {
    users.push({ id: Date.now(), name, username, password, role, studentNum, section });
  }
  save();
  $("userFormModal").hidden = true;
  renderManageUsers();
}

function deleteUser(id) {
  showConfirm("Delete Account", "Are you sure you want to permanently delete this user account?", () => {
    users = users.filter(u => u.id !== id);
    save();
    renderManageUsers();
  });
}

// ---- SUPPORT TICKETS & REPLIES ----
let currentTicketId = null;

function renderTickets() {
  const isStudent = currentUser.role === 'Student';
  const myTickets = isStudent ? tickets.filter(t => t.userId === currentUser.id) : tickets;
  
  $("noTickets").hidden = myTickets.length > 0;
  
  $("ticketsBody").innerHTML = myTickets.map(t => `
    <tr>
      <td><strong>${t.subject}</strong></td>
      <td>${t.userName}</td>
      <td>
        <span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: ${t.status === 'Open' ? '#fef3c7' : '#d1fae5'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">
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
    </tr>
  `).join("");
}

function toggleTicketStatus(id) {
  if (currentUser.role === 'Student') return;
  
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  
  t.status = (t.status === 'Open') ? 'Resolved' : 'Open';
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
  
  $("vtSubject").textContent = t.subject;
  $("vtUser").textContent = t.userName;
  $("vtDate").textContent = t.date;
  $("vtDesc").textContent = t.desc;
  $("replyText").value = "";

  $("vtStatusBadge").innerHTML = `
    <span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: ${t.status === 'Open' ? '#fef3c7' : '#d1fae5'}; color: ${t.status === 'Open' ? '#b45309' : '#047857'};">
      Status: ${t.status}
    </span>
  `;

  const rContainer = $("ticketReplies");
  if (!t.replies || t.replies.length === 0) {
    rContainer.innerHTML = `<p style="font-size: 13px; color: #94a3b8; font-style: italic; text-align: center;">No replies yet.</p>`;
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
const savedSession = localStorage.getItem("session");
if (savedSession) {
  currentUser = JSON.parse(savedSession);
  showApp();
}