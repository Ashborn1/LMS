DROP DATABASE IF EXISTS library_system;
CREATE DATABASE library_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE library_system;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Bookkeeper', 'Student') NOT NULL,
    student_num VARCHAR(50) NULL UNIQUE,
    section VARCHAR(50) NULL,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (is_archived IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE books (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cat VARCHAR(50) NOT NULL,
    copies INT UNSIGNED NOT NULL DEFAULT 0,
    author VARCHAR(100) NOT NULL,
    published YEAR NOT NULL,
    icon VARCHAR(10) NOT NULL,
    summary TEXT NOT NULL,
    cover_url VARCHAR(500) NULL,
    reference_url VARCHAR(500) NULL,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    CHECK (is_archived IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    req_contact VARCHAR(100) NULL,
    notes TEXT NULL,
    is_waitlist TINYINT(1) NOT NULL DEFAULT 0,
    date_requested DATE NOT NULL,
    CONSTRAINT fk_requests_book FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT fk_requests_student FOREIGN KEY (student_id) REFERENCES users(id),
    CHECK (is_waitlist IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE loans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT UNSIGNED NOT NULL,
    borrower_id BIGINT UNSIGNED NOT NULL,
    due DATE NOT NULL,
    notes TEXT NULL,
    CONSTRAINT fk_loans_book FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT fk_loans_borrower FOREIGN KEY (borrower_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT UNSIGNED NOT NULL,
    borrower_id BIGINT UNSIGNED NOT NULL,
    due DATE NOT NULL,
    returned_at DATE NOT NULL,
    notes TEXT NULL,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    fine_paid TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_history_book FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT fk_history_borrower FOREIGN KEY (borrower_id) REFERENCES users(id),
    CHECK (is_archived IN (0, 1)),
    CHECK (fine_paid IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE rejections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    date_requested DATE NOT NULL,
    reason TEXT NOT NULL,
    date_processed DATE NOT NULL,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_rejections_book FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT fk_rejections_student FOREIGN KEY (student_id) REFERENCES users(id),
    CHECK (is_archived IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE loan_extensions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    loan_id BIGINT UNSIGNED NOT NULL,
    old_due DATE NOT NULL,
    new_due DATE NOT NULL,
    reason TEXT NOT NULL,
    CONSTRAINT fk_extensions_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE history_extensions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    history_id BIGINT UNSIGNED NOT NULL,
    old_due DATE NOT NULL,
    new_due DATE NOT NULL,
    reason TEXT NOT NULL,
    CONSTRAINT fk_history_extensions_history FOREIGN KEY (history_id) REFERENCES history(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE extension_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    loan_id BIGINT UNSIGNED NOT NULL,
    reason TEXT NOT NULL,
    CONSTRAINT fk_extension_requests_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    guest_name VARCHAR(100) NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date_created DATE NOT NULL,
    time_created TIME NOT NULL,
    status ENUM('Open', 'Resolved') NOT NULL DEFAULT 'Open',
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id),
    CHECK ((user_id IS NOT NULL) OR (guest_name IS NOT NULL))
) ENGINE=InnoDB;

CREATE TABLE ticket_replies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT UNSIGNED NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    reply_text TEXT NOT NULL,
    date_created DATETIME NOT NULL,
    CONSTRAINT fk_ticket_replies_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admin_logs (
    id BIGINT UNSIGNED PRIMARY KEY,
    admin_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    details TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_logs_admin FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE INDEX idx_books_category ON books(cat);
CREATE INDEX idx_requests_student ON requests(student_id);
CREATE INDEX idx_loans_due ON loans(due);
CREATE INDEX idx_history_borrower ON history(borrower_id);
CREATE INDEX idx_history_extensions_history ON history_extensions(history_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
