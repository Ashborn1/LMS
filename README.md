```markdown
# 📚 Library Management System (Full-Stack)

A fully functional, database-driven Library Management System built from scratch using **Vanilla JavaScript**, **PHP**, and **MySQL**. This project features role-based access control, a modern responsive UI, soft-deletion (archiving), and real-time database synchronization.

## ✨ Features

### 🎓 Role-Based Access Control
*   **Admin:** Manage user accounts, handle support tickets, view/archive history, and monitor system activity.
*   **Bookkeeper:** Manage book inventory, approve/reject borrow requests, process returns, and review loan extension requests.
*   **Student:** Browse the catalog, request books (or join waitlists), track active loans, and request extensions.

### 📖 Catalog & Inventory Management
*   **Real Reference Books:** Seeded with actual IT, Science, English, and Social Studies books (published 2020–2026) complete with cover images and reference links.
*   **Search & Filters:** Search by title/author, filter by category, and filter by publication year (e.g., 2020–2026).
*   **Archive System:** Instead of permanently deleting data, users/books/history are "Archived" (Soft Delete) and can be restored later.

### 🔄 Borrowing & Workflows
*   **Limits Enforced:** Students can borrow a maximum of **5 books total** at a time, limited to **1 copy per book title**.
*   **Waitlist System:** If a book is out of stock, students can join a waitlist.
*   **Extensions:** Students can request due-date extensions. Bookkeepers can approve/reject them based on the validity of the provided reason.
*   **Support Tickets:** Users can submit tickets for account recovery or issues, which the Admin can view and reply to.

### 🎨 UI/UX
*   **5 Dynamic Themes:** Midnight Ocean, Warm Alabaster, Parchment Archive, Reading Room, and Sage Morning.
*   **Responsive Design:** Fully responsive layout that works on mobile and desktop.

---

## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **Backend:** PHP (PDO)
*   **Database:** MySQL (MariaDB)

---

## 🚀 How to Run Locally (Setup Guide)

### Prerequisites
*   [XAMPP](https://www.apachefriends.org/index.html) (for Apache web server).
*   [MySQL Server & Workbench](https://dev.mysql.com/downloads/workbench/) (If you installed Workbench, the standalone MySQL Server usually runs automatically as a Windows Service).

### Step 1: Setup the Project Folder
1. Clone this repository or download the files.
2. Move the folder into your XAMPP `htdocs` directory. 
   *(Example: `D:\Xampp\htdocs\library` or `C:\xampp\htdocs\library`)*

### Step 2: Start the Servers
1. Open **XAMPP Control Panel** and start **Apache**. 
   *(Note: You do NOT need to start the MySQL module inside XAMPP if you are using the standalone MySQL Server installed with MySQL Workbench).*
2. Ensure your standalone **MySQL Server** is running in the background (Check Windows Services or Task Manager).

### Step 3: Setup the Database
1. Open **MySQL Workbench** and connect to your local instance (`localhost:3306`).
2. Open a new query tab and run the following SQL script to create the database, tables, and seed the initial books:

```sql
CREATE DATABASE IF NOT EXISTS library_system;
USE library_system;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    student_num VARCHAR(50),
    section VARCHAR(50),
    is_archived TINYINT(1) DEFAULT 0
);

-- 2. Books Table
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    cat VARCHAR(50),
    copies INT,
    author VARCHAR(100),
    published VARCHAR(10),
    icon VARCHAR(10),
    summary TEXT,
    cover_url VARCHAR(500),
    reference_url VARCHAR(500),
    is_archived TINYINT(1) DEFAULT 0
);

-- 3. Requests Table
CREATE TABLE requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bookId BIGINT,
    studentId BIGINT,
    studentName VARCHAR(100),
    reqStudentId VARCHAR(50),
    reqSection VARCHAR(50),
    reqContact VARCHAR(100),
    notes TEXT,
    isWaitlist BOOLEAN,
    dateRequested VARCHAR(50)
);

-- 4. Loans Table
CREATE TABLE loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bookId BIGINT,
    borrowerId BIGINT,
    borrower VARCHAR(100),
    due VARCHAR(50),
    notes TEXT,
    extensions LONGTEXT
);

-- 5. History Table
CREATE TABLE history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bookId BIGINT,
    borrowerId BIGINT,
    borrower VARCHAR(100),
    due VARCHAR(50),
    returnedAt VARCHAR(50),
    notes TEXT,
    extensions LONGTEXT,
    is_archived TINYINT(1) DEFAULT 0
);

-- 6. Rejections Table
CREATE TABLE rejections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bookId BIGINT,
    studentId BIGINT,
    studentName VARCHAR(100),
    reqStudentId VARCHAR(50),
    reqSection VARCHAR(50),
    dateRequested VARCHAR(50),
    reason TEXT,
    dateProcessed VARCHAR(50),
    is_archived TINYINT(1) DEFAULT 0
);

-- 7. Extension Requests Table
CREATE TABLE extension_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loanId BIGINT,
    bookName VARCHAR(255),
    studentName VARCHAR(100),
    reason TEXT
);

-- 8. Tickets Table
CREATE TABLE tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50),
    userName VARCHAR(100),
    subject VARCHAR(255),
    `desc` TEXT,
    date VARCHAR(50),
    time VARCHAR(50),
    status VARCHAR(50),
    replies LONGTEXT
);
```

Step 4: Configure Database Connection

1. Open the db.php file in your code editor.
2. Update the credentials to match your MySQL setup. 
   (Note: The default password for the root user in a standalone MySQL Server installation is often required, whereas XAMPP's default is usually empty '').

```php
<?php
$host = 'localhost';
$db   = 'library_system';
$user = 'root'; 
$pass = 'YOUR_MYSQL_PASSWORD'; // Update this if needed

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
```

Step 5: Run the App

1. Open your browser.
2. Go to: http://localhost/library/index.html
3. The JavaScript will detect that the database tables are empty and automatically seed the 3 default users and 20 reference books on the first load.

---

🔐 Demo Accounts

Use the following credentials to test the different roles:

Role Username Password
Admin admin admin123
Bookkeeper keeper keeper123
Student student student123

---

📂 Project Structure

· index.html - The main UI shell containing all views, modals, and login screen.
· styles.css - The styling, responsive grid, and all 5 theme variables.
· script.js - The core logic. Handles DOM manipulation, state management, role-based rendering, and fetch() API calls.
· api.php - The REST API endpoint. Handles load (fetching data) and sync (saving data to MySQL).
· db.php - PDO database connection script.

---

⚠️ Notes on Architecture

· Full Sync Saving: To mimic a real-time database without building complex individual REST endpoints (like POST /books, PUT /users), this project uses a sync method. Every time you make a change, the JavaScript payload sends the entire state of the application to api.php. PHP then safely truncates the tables inside a transaction and re-inserts the updated data.
· Archiving vs. Deleting: Data is never hard-deleted from the database via the UI. Clicking "Archive" toggles the is_archived flag to 1, keeping the data intact for historical records.

---

📄 License

This project is open-source and available under the MIT License.

```