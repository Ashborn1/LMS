// ---- Books ----
const BOOKS = [
  { id:1,  title:"Cybersecurity", cat:"IT", copies:10 },
  { id:2,  title:"Networking",    cat:"IT", copies:8  },
  { id:3,  title:"Fundamentals",  cat:"IT", copies:12 },
  { id:4,  title:"Web",           cat:"IT", copies:7  },
  { id:5,  title:"HCI",           cat:"IT", copies:5  },
  { id:6,  title:"Biology",              cat:"Science", copies:9 },
  { id:7,  title:"Chemistry",            cat:"Science", copies:8 },
  { id:8,  title:"Physics",              cat:"Science", copies:7 },
  { id:9,  title:"Earth Science",        cat:"Science", copies:6 },
  { id:10, title:"Environmental Science",cat:"Science", copies:5 },
  { id:11, title:"Grammar",    cat:"English", copies:12 },
  { id:12, title:"Literature", cat:"English", copies:8  },
  { id:13, title:"Writing",    cat:"English", copies:6  },
  { id:14, title:"Reading",    cat:"English", copies:10 },
  { id:15, title:"Speaking",   cat:"English", copies:5  },
  { id:16, title:"Philippine History", cat:"Social Studies", copies:10 },
  { id:17, title:"World History",      cat:"Social Studies", copies:8  },
  { id:18, title:"Geography",          cat:"Social Studies", copies:7  },
  { id:19, title:"Economics",          cat:"Social Studies", copies:6  },
  { id:20, title:"Civics",             cat:"Social Studies", copies:5  }
];

// ---- State ----
let loans = JSON.parse(localStorage.getItem("loans") || "[]");
let history = JSON.parse(localStorage.getItem("history") || "[]");
let currentUser = localStorage.getItem("user") || "";
let currentTab = 'active'; // 'active' or 'history'

const $ = id => document.getElementById(id);

function save() { 
  localStorage.setItem("loans", JSON.stringify(loans)); 
  localStorage.setItem("history", JSON.stringify(history)); 
}
const borrowedCount = id => loans.filter(l => l.bookId === id).length;

// ---- Filter + Sort ----
function getFilteredBooks() {
  const q = $("search").value.trim().toLowerCase();
  const cat = $("catFilter").value;
  const avail = $("availFilter").value;
  const sort = $("sortBy").value;

  let list = BOOKS.filter(b => {
    if (cat !== "all" && b.cat !== cat) return false;
    if (q && !(b.title.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q))) return false;
    const left = b.copies - borrowedCount(b.id);
    if (avail === "available" && left <= 0) return false;
    if (avail === "out" && left > 0) return false;
    return true;
  });

  const leftOf = b => b.copies - borrowedCount(b.id);
  if (sort === "title-asc")  list.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "title-desc") list.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "avail-desc") list.sort((a, b) => leftOf(b) - leftOf(a));
  if (sort === "avail-asc")  list.sort((a, b) => leftOf(a) - leftOf(b));

  return list;
}

// ---- Render ----
function renderBooks() {
  const list = getFilteredBooks();
  $("noResults").hidden = list.length > 0;

  $("books").innerHTML = list.map(b => {
    const avail = b.copies - borrowedCount(b.id);
    return `<div class="book">
      <span class="cat">${b.cat}</span>
      <h3>${b.title}</h3>
      <span class="avail">${avail} of ${b.copies} available</span>
      <button ${avail === 0 ? "disabled" : ""} onclick="openBorrow(${b.id})">Borrow</button>
    </div>`;
  }).join("");
}

function switchTab(tab) {
  currentTab = tab;
  $("tabActive").classList.toggle("active", tab === 'active');
  $("tabHistory").classList.toggle("active", tab === 'history');
  renderLoans();
}

function renderLoans() {
  const today = new Date(); today.setHours(0,0,0,0);
  const isActive = currentTab === 'active';
  const list = isActive ? loans : history;

  // Change table header based on tab
  if (isActive) {
    $("tableHead").innerHTML = `<tr><th>Book</th><th>Borrower</th><th>Type</th><th>Due Date</th><th style="text-align: right;">Actions</th></tr>`;
  } else {
    $("tableHead").innerHTML = `<tr><th>Book</th><th>Borrower</th><th>Type</th><th>Due Date</th><th>Returned On</th><th style="text-align: right;">Actions</th></tr>`;
  }

  $("loansBody").innerHTML = list.map(l => {
    const book = BOOKS.find(b => b.id === l.bookId);
    const due = new Date(l.due); due.setHours(0,0,0,0);
    const overdue = isActive && due < today; // Only show overdue on active tab
    const meta = [l.studentId, l.contact].filter(Boolean).join(" · ");
    
    if (isActive) {
      return `<tr class="${overdue ? "overdue" : ""}">
        <td><strong>${book ? book.title : "Unknown"}</strong></td>
        <td>
          <div class="borrower-cell">
            <span class="name">${l.borrower}</span>
            ${meta ? `<span class="meta">${meta}</span>` : ""}
          </div>
        </td>
        <td>${l.type || "—"}</td>
        <td>${l.due}${overdue ? ' <span class="badge-overdue">Overdue</span>' : ""}</td>
        <td>
          <div class="actions-cell">
            <button class="ghost small" onclick="viewDetails(${l.id})">View</button>
            <button class="ghost small" style="color:#4f46e5; border-color:#c7d2fe;" onclick="openExtend(${l.id})">Extend</button>
            <button class="small" onclick="returnBook(${l.id})">Return</button>
          </div>
        </td>
      </tr>`;
    } else {
      // History tab row
      return `<tr>
        <td><strong>${book ? book.title : "Unknown"}</strong></td>
        <td>
          <div class="borrower-cell">
            <span class="name">${l.borrower}</span>
            ${meta ? `<span class="meta">${meta}</span>` : ""}
          </div>
        </td>
        <td>${l.type || "—"}</td>
        <td>${l.due}</td>
        <td style="color: #10b981; font-weight: 600;">${l.returnedAt}</td>
        <td>
          <div class="actions-cell">
            <button class="ghost small" onclick="viewDetails(${l.id})">View</button>
            <button class="ghost small danger" onclick="deleteHistory(${l.id})">Delete</button>
          </div>
        </td>
      </tr>`;
    }
  }).join("");

  $("noLoans").hidden = list.length > 0;
  $("loansTable").hidden = list.length === 0;
  $("noLoans").textContent = isActive ? "No active loans right now." : "No borrowing history found.";
}

function render() { renderBooks(); renderLoans(); }

// ---- Borrow Modal ----
let borrowBookId = null;

function openBorrow(bookId) {
  borrowBookId = bookId;
  const book = BOOKS.find(b => b.id === bookId);
  $("modalBookName").textContent = book ? book.title : "";

  $("fName").value = "";
  $("fType").value = "Student";
  $("fStudentId").value = "";
  $("fSection").value = "";
  $("fGender").value = "";
  $("fContact").value = "";
  $("fNotes").value = "";

  const due = new Date();
  due.setDate(due.getDate() + 14);
  $("dueDate").value = due.toISOString().slice(0, 10);

  $("modalErr").textContent = "";
  $("modal").hidden = false;
  setTimeout(() => $("fName").focus(), 50);
}

function closeBorrow() { $("modal").hidden = true; borrowBookId = null; }

$("fStudentId").addEventListener("input", function(e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

function confirmBorrow() {
  const name = $("fName").value.trim();
  const type = $("fType").value;
  const studentId = $("fStudentId").value.trim();
  const section = $("fSection").value.trim();
  const gender = $("fGender").value;
  const contact = $("fContact").value.trim();
  const due = $("dueDate").value;
  const notes = $("fNotes").value.trim();

  if (!name) { $("modalErr").textContent = "Full name is required."; return; }
  if (!studentId) { $("modalErr").textContent = "Student / ID number is required."; return; }
  
  if (!/^\d+$/.test(studentId)) {
    $("modalErr").textContent = "Student ID must contain only numbers.";
    return;
  }

  if (!due) { $("modalErr").textContent = "Due date is required."; return; }

  const book = BOOKS.find(b => b.id === borrowBookId);
  if (!book) return;
  if (borrowedCount(book.id) >= book.copies) {
    $("modalErr").textContent = "No copies left for this book.";
    return;
  }

  loans.push({
    id: Date.now(),
    bookId: book.id,
    borrower: name,
    type, studentId, section, gender, contact,
    due,
    notes,
    extensions: []
  });

  save();
  closeBorrow();
  render();
}

function returnBook(loanId) {
  const idx = loans.findIndex(l => l.id === loanId);
  if (idx === -1) return;

  const loan = loans[idx];
  loan.returnedAt = new Date().toISOString().slice(0, 10);
  
  // Move to history
  history.unshift(loan); // Add to top
  loans.splice(idx, 1);  // Remove from active
  
  save();
  render();
}

function deleteHistory(loanId) {
  if (!confirm("Are you sure you want to permanently delete this history record?")) return;
  history = history.filter(l => l.id !== loanId);
  save();
  render();
}

// ---- Extend Logic ----
let extendingLoanId = null;

function openExtend(loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  extendingLoanId = loanId;
  const book = BOOKS.find(b => b.id === loan.bookId);

  $("extendBookName").textContent = book ? book.title : "";
  $("extendCurrentDue").value = loan.due;
  
  // Set min date to tomorrow (or current due date) so they can't pick a past date
  const minDate = new Date(loan.due);
  minDate.setDate(minDate.getDate() + 1);
  $("extendNewDue").min = minDate.toISOString().slice(0, 10);
  
  // Default new date to +7 days
  const defaultDate = new Date(loan.due);
  defaultDate.setDate(defaultDate.getDate() + 7);
  $("extendNewDue").value = defaultDate.toISOString().slice(0, 10);

  $("extendReason").value = "";
  $("extendErr").textContent = "";

  $("extendModal").hidden = false;
  setTimeout(() => $("extendNewDue").focus(), 50);
}

function closeExtend() { $("extendModal").hidden = true; extendingLoanId = null; }

function confirmExtend() {
  const reason = $("extendReason").value.trim();
  const newDue = $("extendNewDue").value;
  
  if (!reason) { $("extendErr").textContent = "Reason is required."; return; }
  if (!newDue) { $("extendErr").textContent = "New due date is required."; return; }

  const loan = loans.find(l => l.id === extendingLoanId);
  if (!loan) return;

  if (new Date(newDue) <= new Date(loan.due)) {
    $("extendErr").textContent = "New due date must be after the current due date.";
    return;
  }

  const oldDue = loan.due;
  loan.due = newDue;
  
  if (!loan.extensions) loan.extensions = [];
  
  // Calculate days added
  const diffTime = Math.abs(new Date(newDue) - new Date(oldDue));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  loan.extensions.push({
    oldDue: oldDue,
    newDue: newDue,
    days: diffDays,
    reason: reason,
    dateExtended: new Date().toISOString().slice(0, 10)
  });

  save();
  closeExtend();
  render();
}

// ---- View Details Modal ----
function viewDetails(loanId) {
  // Check both active loans and history
  const loan = loans.find(l => l.id === loanId) || history.find(l => l.id === loanId);
  if (!loan) return;
  
  const book = BOOKS.find(b => b.id === loan.bookId);
  
  $("viewBookName").textContent = book ? book.title : "Unknown Book";
  $("vName").textContent = loan.borrower || "—";
  $("vType").textContent = loan.type || "—";
  $("vStudentId").textContent = loan.studentId || "—";
  $("vSection").textContent = loan.section || "—";
  $("vContact").textContent = loan.contact || "—";
  $("vDueDate").textContent = loan.due;
  $("vNotes").textContent = loan.notes || "No notes provided.";

  // Show return date if it exists (History tab)
  if (loan.returnedAt) {
    $("vReturnDateRow").style.display = "flex";
    $("vReturnDate").textContent = loan.returnedAt;
  } else {
    $("vReturnDateRow").style.display = "none";
  }

  // Render Extensions
  const extArea = $("vExtensionArea");
  const extList = $("vExtensionList");
  
  if (loan.extensions && loan.extensions.length > 0) {
    extArea.style.display = "block";
    extList.innerHTML = loan.extensions.map(ext => `
      <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="font-weight: 600; color: #4f46e5; margin-bottom: 4px;">+${ext.days} Days (from ${ext.oldDue} to ${ext.newDue})</div>
        <div><strong>Reason:</strong> ${ext.reason}</div>
      </div>
    `).join("");
    
    extList.lastElementChild.style.border = "none";
    extList.lastElementChild.style.marginBottom = "0";
    extList.lastElementChild.style.paddingBottom = "0";
  } else {
    extArea.style.display = "none";
  }
  
  $("viewModal").hidden = false;
}

function closeView() { $("viewModal").hidden = true; }

// ---- Login ----
function showApp() {
  $("auth").hidden = true;
  $("app").hidden = false;
  $("who").textContent = "👤 " + currentUser;
  render();
}

function showAuth() {
  $("auth").hidden = false;
  $("app").hidden = true;
}

$("loginBtn").onclick = () => {
  const u = $("user").value.trim();
  const p = $("pass").value;
  if (u === "admin" && p === "admin123") {
    currentUser = u;
    localStorage.setItem("user", u);
    showApp();
  } else {
    $("loginErr").textContent = "Invalid credentials.";
  }
};

$("logout").onclick = () => {
  localStorage.removeItem("user");
  currentUser = "";
  showAuth();
};

// ---- Filter / search events ----
$("search").oninput = renderBooks;
$("catFilter").onchange = renderBooks;
$("sortBy").onchange = renderBooks;
$("availFilter").onchange = renderBooks;

// ---- Modal events ----
$("cancelBorrow").onclick = closeBorrow;
$("confirmBorrow").onclick = confirmBorrow;
$("cancelExtend").onclick = closeExtend;
$("confirmExtend").onclick = confirmExtend;
$("closeView").onclick = closeView;

// ---- Start ----
if (currentUser) showApp(); else showAuth();