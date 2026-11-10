USE library_system;

-- Additive presentation data only.
-- Run database.sql and load the seeded users/books first.
-- This script does not DROP, DELETE, or INSERT any books.
-- It uses seeded book 1 (5 copies) and seeded book 10 (1 copy).
-- INSERT IGNORE makes rerunning this script safe for these demo IDs.

INSERT IGNORE INTO users
    (id, name, username, password, role, student_num, section, is_archived)
VALUES
    (31, 'Demo Student One', 'demo_student_01', 'demo1234', 'Student', 'DEMO-001', 'BSIT 2-C', 0),
    (32, 'Demo Student Two', 'demo_student_02', 'demo1234', 'Student', 'DEMO-002', 'BSIT 2-C', 0),
    (33, 'Demo Student Three', 'demo_student_03', 'demo1234', 'Student', 'DEMO-003', 'BSIT 2-D', 0),
    (34, 'Demo Student Four', 'demo_student_04', 'demo1234', 'Student', 'DEMO-004', 'BSCS 3-A', 0),
    (35, 'Demo Student Five', 'demo_student_05', 'demo1234', 'Student', 'DEMO-005', 'BSCS 3-A', 0),
    (36, 'Archived Demo Student', 'archived_demo_02', 'demo1234', 'Student', 'DEMO-006', 'BSIT 2-D', 1);

-- Approved active loans: all five copies of book 1 are borrowed.
INSERT IGNORE INTO loans (id, book_id, borrower_id, due, notes)
VALUES
    (9201, 1, 31, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'Approved presentation loan'),
    (9202, 1, 32, DATE_ADD(CURDATE(), INTERVAL 8 DAY), 'Approved presentation loan'),
    (9203, 1, 33, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Overdue presentation loan'),
    (9204, 1, 34, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Approved presentation loan'),
    (9205, 1, 35, DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'Approved presentation loan'),
    (9206, 10, 31, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'Only copy of seeded book 10 is borrowed');

-- Because the seeded copies are exhausted, these remain pending/waitlisted.
INSERT IGNORE INTO requests
    (id, book_id, student_id, req_contact, notes, is_waitlist, date_requested)
VALUES
    (9211, 1, 36, 'demo36@example.com', 'Waiting for a copy of the fully borrowed book.', 1, CURDATE()),
    (9212, 1, 3, 'student@example.com', 'Request submitted while all five copies are borrowed.', 1, CURDATE()),
    (9213, 10, 32, 'demo32@example.com', 'Waiting for the only copy of this seeded book.', 1, CURDATE()),
    (9214, 2, 34, 'demo34@example.com', 'Normal pending request for an available seeded book.', 0, CURDATE());

-- One approved loan has an extension recorded; another has a pending extension request.
INSERT IGNORE INTO loan_extensions
    (id, loan_id, old_due, new_due, reason)
VALUES
    (9221, 9201, DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY),
     'Approved extension for a research project.');

INSERT IGNORE INTO extension_requests (id, loan_id, reason)
VALUES
    (9222, 9202, 'Please extend the due date until the final presentation.');

-- Returned books show completed borrowing and fine states in History.
INSERT IGNORE INTO history
    (id, book_id, borrower_id, due, returned_at, notes, is_archived, fine_paid)
VALUES
    (9231, 2, 33, DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY),
     'Returned late; fine is still unpaid.', 0, 0),
    (9232, 3, 34, DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY),
     'Returned on time and archived for presentation.', 1, 1);

INSERT IGNORE INTO history_extensions
    (id, history_id, old_due, new_due, reason)
VALUES
    (9233, 9231, DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 8 DAY),
     'Extension granted before the book was returned.');

-- Rejected requests demonstrate both active and archived rejection records.
INSERT IGNORE INTO rejections
    (id, book_id, student_id, date_requested, reason, date_processed, is_archived)
VALUES
    (9241, 1, 35, DATE_SUB(CURDATE(), INTERVAL 3 DAY),
     'All copies were already borrowed.', CURDATE(), 0),
    (9242, 10, 36, DATE_SUB(CURDATE(), INTERVAL 10 DAY),
     'The only copy is currently on loan.', DATE_SUB(CURDATE(), INTERVAL 8 DAY), 1);

-- Admin and guest support tickets, each with example replies.
INSERT IGNORE INTO tickets
    (id, user_id, guest_name, subject, description, date_created, time_created, status)
VALUES
    (9251, 1, NULL, 'Admin presentation ticket',
     'Admin asks how to review the overdue demo loans.', CURDATE(), CURTIME(), 'Open'),
    (9252, NULL, 'Guest Demo User', 'Guest account assistance',
     'Guest asks how to request a book without signing in.', CURDATE(), CURTIME(), 'Open'),
    (9253, 32, NULL, 'Resolved student ticket',
     'Student asks about an approved extension.', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURTIME(), 'Resolved');

INSERT IGNORE INTO ticket_replies
    (id, ticket_id, sender_role, reply_text, date_created)
VALUES
    (9261, 9251, 'Admin', 'The overdue loans appear on the dashboard and Active Loans view.', NOW()),
    (9262, 9252, 'Admin', 'Please include your name, contact details, and requested book in the guest form.', NOW()),
    (9263, 9253, 'Bookkeeper', 'Your extension request was received and is being processed.', NOW());

-- Admin activity history demonstrates detailed, auditable changes.
-- Use the first active Admin from the seeded database so this remains additive.
SET @presentation_admin_id = (
    SELECT id
    FROM users
    WHERE role = 'Admin' AND is_archived = 0
    ORDER BY id
    LIMIT 1
);

INSERT IGNORE INTO admin_logs
    (id, admin_id, action, entity_type, entity_id, details, created_at)
SELECT 9271, @presentation_admin_id, 'Created', 'User', 31,
       'Created Student account for Demo Student One with username "demo_student_01", student number "DEMO-001", section "BSIT 2-C".',
       DATE_SUB(NOW(), INTERVAL 6 DAY)
WHERE @presentation_admin_id IS NOT NULL;

INSERT IGNORE INTO admin_logs
    (id, admin_id, action, entity_type, entity_id, details, created_at)
SELECT 9272, @presentation_admin_id, 'Updated', 'User', 32,
       'Updated Demo Student Two: Section: "BSIT 2-B" → "BSIT 2-C"; Password: changed.',
       DATE_SUB(NOW(), INTERVAL 5 DAY)
WHERE @presentation_admin_id IS NOT NULL;

INSERT IGNORE INTO admin_logs
    (id, admin_id, action, entity_type, entity_id, details, created_at)
SELECT 9273, @presentation_admin_id, 'Archived', 'User', 36,
       'Archived account for Archived Demo Student because the account is no longer active.',
       DATE_SUB(NOW(), INTERVAL 4 DAY)
WHERE @presentation_admin_id IS NOT NULL;

INSERT IGNORE INTO admin_logs
    (id, admin_id, action, entity_type, entity_id, details, created_at)
SELECT 9274, @presentation_admin_id, 'Unarchived', 'User', 36,
       'Restored account for Archived Demo Student after confirming the student record.',
       DATE_SUB(NOW(), INTERVAL 3 DAY)
WHERE @presentation_admin_id IS NOT NULL;

INSERT IGNORE INTO admin_logs
    (id, admin_id, action, entity_type, entity_id, details, created_at)
SELECT 9275, @presentation_admin_id, 'Resolved', 'Ticket', 9253,
       'Resolved ticket "Resolved student ticket" after confirming the approved extension.',
       DATE_SUB(NOW(), INTERVAL 2 DAY)
WHERE @presentation_admin_id IS NOT NULL;

INSERT IGNORE INTO admin_logs
    (id, admin_id, action, entity_type, entity_id, details, created_at)
SELECT 9276, @presentation_admin_id, 'Replied', 'Ticket', 9251,
       'Replied to ticket "Admin presentation ticket" with: "The overdue loans appear on the dashboard and Active Loans view.".',
       DATE_SUB(NOW(), INTERVAL 1 DAY)
WHERE @presentation_admin_id IS NOT NULL;
