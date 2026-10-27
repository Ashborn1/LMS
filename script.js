// ---- Books (20 titles, 154 copies) ----
const BOOKS = [
  // IT
  { id:1,  title:"Cybersecurity", cat:"IT", copies:10 },
  { id:2,  title:"Networking",    cat:"IT", copies:8  },
  { id:3,  title:"Fundamentals",  cat:"IT", copies:12 },
  { id:4,  title:"Web",           cat:"IT", copies:7  },
  { id:5,  title:"HCI",           cat:"IT", copies:5  },
  // Science
  { id:6,  title:"Biology",              cat:"Science", copies:9 },
  { id:7,  title:"Chemistry",            cat:"Science", copies:8 },
  { id:8,  title:"Physics",              cat:"Science", copies:7 },
  { id:9,  title:"Earth Science",        cat:"Science", copies:6 },
  { id:10, title:"Environmental Science",cat:"Science", copies:5 },
  // English
  { id:11, title:"Grammar",    cat:"English", copies:12 },
  { id:12, title:"Literature", cat:"English", copies:8  },
  { id:13, title:"Writing",    cat:"English", copies:6  },
  { id:14, title:"Reading",    cat:"English", copies:10 },
  { id:15, title:"Speaking",   cat:"English", copies:5  },
  // Social Studies
  { id:16, title:"Philippine History", cat:"Social Studies", copies:10 },
  { id:17, title:"World History",      cat:"Social Studies", copies:8  },
  { id:18, title:"Geography",          cat:"Social Studies", copies:7  },
  { id:19, title:"Economics",          cat:"Social Studies", copies:6  },
  { id:20, title:"Civics",             cat:"Social Studies", copies:5  }
];

// ---- State ----
let loans = JSON.parse(localStorage.getItem("loans") || "[]");
let currentUser = localStorage.getItem("user") || "";
const $ = id => document.getElementById(id);

function save() { localStorage.setItem("loans", JSON.stringify(loans)); }
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
      <h3>${b.title}</h3>
      <span class="cat">${b.cat}</span>
      <span class="avail">${avail} of ${b.copies} available</span>
      <button ${avail === 0 ? "disabled" : ""} onclick="openBorrow(${b.id})">Borrow</button>
    </div>`;
  }).join("");
}

function renderLoans() {
  const today = new Date(); today.setHours(0,0,0,0);

  $("loansBody").innerHTML = loans.map(l => {
    const book = BOOKS.find(b => b.id === l.bookId);
    const due = new Date(l.due); due.setHours(0,0,0,0);
    const overdue = due < today;
    return `<tr class="${overdue ? "overdue" : ""}">
      <td>${book ? book.title : "Unknown"}</td>
      <td>${l.borrower}</td>
      <td>${l.due}${overdue ? ' <span class="badge-overdue">Overdue</span>' : ""}</td>
      <td><button onclick="returnBook(${l.id})">Return</button></td>
    </tr>`;
  }).join("");

  $("noLoans").hidden = loans.length > 0;
  $("loansTable").hidden = loans.length === 0;
}

function render() { renderBooks(); renderLoans(); }

// ---- Borrow ----
let borrowBookId = null;

function openBorrow(bookId) {
  borrowBookId = bookId;
  $("borrowerName").value = "";
  const due = new Date();
  due.setDate(due.getDate() + 14);
  $("dueDate").value = due.toISOString().slice(0, 10);
  $("modalErr").textContent = "";
  $("modal").hidden = false;
}

function closeBorrow() { $("modal").hidden = true; borrowBookId = null; }

function confirmBorrow() {
  const name = $("borrowerName").value.trim();
  const due = $("dueDate").value;
  if (!name) { $("modalErr").textContent = "Name required"; return; }
  if (!due) { $("modalErr").textContent = "Due date required"; return; }

  const book = BOOKS.find(b => b.id === borrowBookId);
  if (!book) return;
  if (borrowedCount(book.id) >= book.copies) { $("modalErr").textContent = "No copies left"; return; }

  loans.push({ id: Date.now(), bookId: book.id, borrower: name, due });
  save();
  closeBorrow();
  render();
}

function returnBook(loanId) {
  loans = loans.filter(l => l.id !== loanId);
  save();
  render();
}

// ---- Login ----
function showApp() {
  $("auth").hidden = true;
  $("app").hidden = false;
  $("who").textContent = currentUser;
  render();
}

function showAuth() {
  $("auth").hidden = false;
  $("app").hidden = true;
}

$("loginBtn").onclick = () => {
  const u = $("user").value;
  const p = $("pass").value;
  if (u === "admin" && p === "admin123") {
    currentUser = u;
    localStorage.setItem("user", u);
    showApp();
  } else {
    $("loginErr").textContent = "Wrong credentials (admin / admin123)";
  }
};

$("logout").onclick = () => {
  localStorage.removeItem("user");
  currentUser = "";
  showAuth();
};

// ---- Filter/Search events ----
$("search").oninput = renderBooks;
$("catFilter").onchange = renderBooks;
$("sortBy").onchange = renderBooks;
$("availFilter").onchange = renderBooks;

// ---- Modal events ----
$("cancelBorrow").onclick = closeBorrow;
$("confirmBorrow").onclick = confirmBorrow;

// ---- Start ----
if (currentUser) showApp(); else showAuth();