<?php
require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function asBool($value) {
    return (bool)$value;
}

function nullableText($value) {
    return $value === null || trim((string)$value) === '' ? null : $value;
}

function insertMappedRows($pdo, $table, $columns, $rows, $mapper) {
    if (empty($rows)) return;
    $placeholders = implode(',', array_fill(0, count($columns), '?'));
    $sql = "INSERT INTO `$table` (`" . implode('`,`', $columns) . "`) VALUES ($placeholders)";
    $stmt = $pdo->prepare($sql);
    foreach ($rows as $row) {
        $stmt->execute($mapper($row));
    }
}

function loadData($pdo) {
    $data = [];

    $data['users'] = $pdo->query(
        'SELECT id, name, username, password, role, student_num, section, is_archived
         FROM users ORDER BY id'
    )->fetchAll(PDO::FETCH_ASSOC);
    foreach ($data['users'] as &$user) {
        $user['id'] = (int)$user['id'];
        $user['studentNum'] = $user['student_num'];
        unset($user['student_num']);
        $user['is_archived'] = asBool($user['is_archived']);
    }
    unset($user);

    $data['books'] = $pdo->query(
        'SELECT id, title, cat, copies, author, published, icon, summary, cover_url, reference_url, is_archived
         FROM books ORDER BY id'
    )->fetchAll(PDO::FETCH_ASSOC);
    foreach ($data['books'] as &$book) {
        $book['id'] = (int)$book['id'];
        $book['copies'] = (int)$book['copies'];
        $book['is_archived'] = asBool($book['is_archived']);
    }
    unset($book);

    $requestSql = $pdo->query(
        'SELECT r.id, r.book_id, r.student_id, u.name AS studentName,
                u.student_num AS reqStudentId, u.section AS reqSection,
                r.req_contact, r.notes, r.is_waitlist, r.date_requested
         FROM requests r
         INNER JOIN users u ON u.id = r.student_id
         INNER JOIN books b ON b.id = r.book_id
         ORDER BY r.id'
    );
    $data['requests'] = [];
    foreach ($requestSql as $row) {
        $data['requests'][] = [
            'id' => (int)$row['id'], 'bookId' => (int)$row['book_id'],
            'studentId' => (int)$row['student_id'], 'studentName' => $row['studentName'],
            'reqStudentId' => $row['reqStudentId'], 'reqSection' => $row['reqSection'],
            'reqContact' => $row['req_contact'], 'notes' => $row['notes'],
            'isWaitlist' => asBool($row['is_waitlist']), 'dateRequested' => $row['date_requested']
        ];
    }

    $extensionRows = $pdo->query(
        "SELECT loan_id AS record_id, 'loan' AS record_type, old_due, new_due, reason FROM loan_extensions
         UNION ALL
         SELECT history_id AS record_id, 'history' AS record_type, old_due, new_due, reason FROM history_extensions
         ORDER BY record_id"
    )->fetchAll(PDO::FETCH_ASSOC);
    $extensionsByLoan = [];
    $extensionsByHistory = [];
    foreach ($extensionRows as $row) {
        $target = $row['record_type'] === 'history' ? $extensionsByHistory : $extensionsByLoan;
        $target[(int)$row['record_id']][] = [
            'oldDue' => $row['old_due'], 'newDue' => $row['new_due'], 'reason' => $row['reason']
        ];
        if ($row['record_type'] === 'history') {
            $extensionsByHistory[(int)$row['record_id']] = $target[(int)$row['record_id']];
        } else {
            $extensionsByLoan[(int)$row['record_id']] = $target[(int)$row['record_id']];
        }
    }

    $loanRows = $pdo->query(
        'SELECT l.id, l.book_id, l.borrower_id, u.name AS borrower, l.due, l.notes
         FROM loans l
         INNER JOIN users u ON u.id = l.borrower_id
         INNER JOIN books b ON b.id = l.book_id
         ORDER BY l.id'
    )->fetchAll(PDO::FETCH_ASSOC);
    $data['loans'] = [];
    foreach ($loanRows as $row) {
        $id = (int)$row['id'];
        $data['loans'][] = [
            'id' => $id, 'bookId' => (int)$row['book_id'], 'borrowerId' => (int)$row['borrower_id'],
            'borrower' => $row['borrower'], 'due' => $row['due'], 'notes' => $row['notes'],
            'extensions' => $extensionsByLoan[$id] ?? []
        ];
    }

    $historyRows = $pdo->query(
        'SELECT h.id, h.book_id, h.borrower_id, u.name AS borrower, h.due, h.returned_at,
                h.notes, h.is_archived, h.fine_paid
         FROM history h
         INNER JOIN users u ON u.id = h.borrower_id
         INNER JOIN books b ON b.id = h.book_id
         ORDER BY h.id'
    )->fetchAll(PDO::FETCH_ASSOC);
    $data['history'] = [];
    foreach ($historyRows as $row) {
        $id = (int)$row['id'];
        $data['history'][] = [
            'id' => $id, 'bookId' => (int)$row['book_id'], 'borrowerId' => (int)$row['borrower_id'],
            'borrower' => $row['borrower'], 'due' => $row['due'], 'returnedAt' => $row['returned_at'],
            'notes' => $row['notes'], 'extensions' => $extensionsByHistory[$id] ?? [],
            'is_archived' => asBool($row['is_archived']), 'fine_paid' => asBool($row['fine_paid'])
        ];
    }

    $rejectionRows = $pdo->query(
        'SELECT r.id, r.book_id, r.student_id, u.name AS studentName,
                u.student_num AS reqStudentId, u.section AS reqSection,
                r.date_requested, r.reason, r.date_processed, r.is_archived
         FROM rejections r
         INNER JOIN users u ON u.id = r.student_id
         INNER JOIN books b ON b.id = r.book_id
         ORDER BY r.id'
    )->fetchAll(PDO::FETCH_ASSOC);
    $data['rejections'] = [];
    foreach ($rejectionRows as $row) {
        $data['rejections'][] = [
            'id' => (int)$row['id'], 'bookId' => (int)$row['book_id'],
            'studentId' => (int)$row['student_id'], 'studentName' => $row['studentName'],
            'reqStudentId' => $row['reqStudentId'], 'reqSection' => $row['reqSection'],
            'dateRequested' => $row['date_requested'], 'reason' => $row['reason'],
            'dateProcessed' => $row['date_processed'], 'is_archived' => asBool($row['is_archived'])
        ];
    }

    $extensionRequestRows = $pdo->query(
        'SELECT er.id, er.loan_id, b.title AS bookName, u.name AS studentName, er.reason
         FROM extension_requests er
         INNER JOIN loans l ON l.id = er.loan_id
         INNER JOIN books b ON b.id = l.book_id
         INNER JOIN users u ON u.id = l.borrower_id
         ORDER BY er.id'
    )->fetchAll(PDO::FETCH_ASSOC);
    $data['extension_requests'] = [];
    foreach ($extensionRequestRows as $row) {
        $data['extension_requests'][] = [
            'id' => (int)$row['id'], 'loanId' => (int)$row['loan_id'],
            'bookName' => $row['bookName'], 'studentName' => $row['studentName'], 'reason' => $row['reason']
        ];
    }

    $data['tickets'] = [];
    $ticketRows = $pdo->query(
        'SELECT t.id, t.user_id, COALESCE(u.name, t.guest_name) AS userName,
                t.subject, t.description, t.date_created, t.time_created, t.status
         FROM tickets t
         LEFT JOIN users u ON u.id = t.user_id
         ORDER BY t.id'
    )->fetchAll(PDO::FETCH_ASSOC);
    $replyStmt = $pdo->prepare(
        'SELECT sender_role AS sender, reply_text AS text, date_created AS date
         FROM ticket_replies WHERE ticket_id = ? ORDER BY id'
    );
    foreach ($ticketRows as $row) {
        $replyStmt->execute([(int)$row['id']]);
        $data['tickets'][] = [
            'id' => (int)$row['id'], 'userId' => $row['user_id'] === null ? 'guest' : (int)$row['user_id'],
            'userName' => $row['userName'], 'subject' => $row['subject'], 'desc' => $row['description'],
            'date' => $row['date_created'], 'time' => $row['time_created'], 'status' => $row['status'],
            'replies' => $replyStmt->fetchAll(PDO::FETCH_ASSOC)
        ];
    }

    $data['adminLogs'] = $pdo->query(
        'SELECT id, admin_id, action, entity_type, entity_id, details, created_at
         FROM admin_logs ORDER BY created_at DESC, id DESC'
    )->fetchAll(PDO::FETCH_ASSOC);
    foreach ($data['adminLogs'] as &$log) {
        $log['id'] = (int)$log['id'];
        $log['adminId'] = (int)$log['admin_id'];
        $log['entityId'] = $log['entity_id'] === null ? null : (int)$log['entity_id'];
        $log['createdAt'] = $log['created_at'];
        unset($log['admin_id'], $log['entity_id'], $log['created_at']);
    }
    unset($log);

    return $data;
}

function syncData($pdo, $input) {
    $required = ['users', 'books', 'requests', 'loans', 'history', 'rejections', 'extensionRequests', 'tickets'];
    foreach ($required as $key) {
        if (!isset($input[$key]) || !is_array($input[$key])) {
            throw new InvalidArgumentException("Missing data collection: $key");
        }
    }

    $pdo->beginTransaction();
    try {
        foreach (['ticket_replies', 'extension_requests', 'loan_extensions', 'history_extensions', 'requests', 'loans', 'history', 'rejections', 'tickets'] as $table) {
            $pdo->exec("DELETE FROM `$table`");
        }

        $userSql = 'INSERT INTO users (id,name,username,password,role,student_num,section,is_archived)
                    VALUES (?,?,?,?,?,?,?,?)
                    ON DUPLICATE KEY UPDATE name=VALUES(name), username=VALUES(username), password=VALUES(password),
                    role=VALUES(role), student_num=VALUES(student_num), section=VALUES(section), is_archived=VALUES(is_archived)';
        $userStmt = $pdo->prepare($userSql);
        foreach ($input['users'] as $row) {
            $userStmt->execute([(int)$row['id'], $row['name'] ?? '', $row['username'] ?? '',
                $row['password'] ?? '', $row['role'] ?? '', nullableText($row['studentNum'] ?? null),
                nullableText($row['section'] ?? null), !empty($row['is_archived']) ? 1 : 0]);
        }

        $bookSql = 'INSERT INTO books (id,title,cat,copies,author,published,icon,summary,cover_url,reference_url,is_archived)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?)
                    ON DUPLICATE KEY UPDATE title=VALUES(title), cat=VALUES(cat), copies=VALUES(copies),
                    author=VALUES(author), published=VALUES(published), icon=VALUES(icon), summary=VALUES(summary),
                    cover_url=VALUES(cover_url), reference_url=VALUES(reference_url), is_archived=VALUES(is_archived)';
        $bookStmt = $pdo->prepare($bookSql);
        foreach ($input['books'] as $row) {
            $bookStmt->execute([(int)$row['id'], $row['title'] ?? '', $row['cat'] ?? '', (int)($row['copies'] ?? 0),
                $row['author'] ?? '', $row['published'] ?? '', $row['icon'] ?? '', $row['summary'] ?? '',
                $row['cover_url'] ?? null, $row['reference_url'] ?? null, !empty($row['is_archived']) ? 1 : 0]);
        }

        insertMappedRows($pdo, 'requests',
            ['id','book_id','student_id','req_contact','notes','is_waitlist','date_requested'],
            $input['requests'], function ($r) {
                return [(int)$r['id'], (int)$r['bookId'], (int)$r['studentId'], $r['reqContact'] ?? null,
                    $r['notes'] ?? null, !empty($r['isWaitlist']) ? 1 : 0, $r['dateRequested'] ?? null];
            });
        insertMappedRows($pdo, 'loans',
            ['id','book_id','borrower_id','due','notes'], $input['loans'], function ($r) {
                return [(int)$r['id'], (int)$r['bookId'], (int)$r['borrowerId'], $r['due'] ?? null, $r['notes'] ?? null];
            });
        insertMappedRows($pdo, 'history',
            ['id','book_id','borrower_id','due','returned_at','notes','is_archived','fine_paid'],
            $input['history'], function ($r) {
                return [(int)$r['id'], (int)$r['bookId'], (int)$r['borrowerId'], $r['due'] ?? null,
                    $r['returnedAt'] ?? null, $r['notes'] ?? null, !empty($r['is_archived']) ? 1 : 0, !empty($r['fine_paid']) ? 1 : 0];
            });
        insertMappedRows($pdo, 'rejections',
            ['id','book_id','student_id','date_requested','reason','date_processed','is_archived'],
            $input['rejections'], function ($r) {
                return [(int)$r['id'], (int)$r['bookId'], (int)$r['studentId'], $r['dateRequested'] ?? null,
                    $r['reason'] ?? '', $r['dateProcessed'] ?? null, !empty($r['is_archived']) ? 1 : 0];
            });
        insertMappedRows($pdo, 'extension_requests',
            ['id','loan_id','reason'], $input['extensionRequests'], function ($r) {
                return [(int)$r['id'], (int)$r['loanId'], $r['reason'] ?? ''];
            });
        insertMappedRows($pdo, 'tickets',
            ['id','user_id','guest_name','subject','description','date_created','time_created','status'],
            $input['tickets'], function ($r) {
                $userId = is_numeric($r['userId'] ?? null) ? (int)$r['userId'] : null;
                $guestName = $userId === null ? ($r['userName'] ?? 'Guest') : null;
                $ticketTime = strtotime($r['time'] ?? '');
                return [(int)$r['id'], $userId, $guestName, $r['subject'] ?? '', $r['desc'] ?? '',
                    $r['date'] ?? date('Y-m-d'), $ticketTime ? date('H:i:s', $ticketTime) : date('H:i:s'),
                    $r['status'] ?? 'Open'];
            });

        $loanExtensionStmt = $pdo->prepare(
            'INSERT INTO loan_extensions (loan_id,old_due,new_due,reason) VALUES (?,?,?,?)'
        );
        $historyExtensionStmt = $pdo->prepare(
            'INSERT INTO history_extensions (history_id,old_due,new_due,reason) VALUES (?,?,?,?)'
        );
        foreach ($input['loans'] as $row) {
            foreach (($row['extensions'] ?? []) as $extension) {
                $loanExtensionStmt->execute([(int)$row['id'], $extension['oldDue'] ?? null,
                    $extension['newDue'] ?? null, $extension['reason'] ?? '']);
            }
        }
        foreach ($input['history'] as $row) {
            foreach (($row['extensions'] ?? []) as $extension) {
                $historyExtensionStmt->execute([(int)$row['id'], $extension['oldDue'] ?? null,
                    $extension['newDue'] ?? null, $extension['reason'] ?? '']);
            }
        }
        $replyStmt = $pdo->prepare(
            'INSERT INTO ticket_replies (ticket_id,sender_role,reply_text,date_created) VALUES (?,?,?,?)'
        );
        foreach ($input['tickets'] as $ticket) {
            foreach (($ticket['replies'] ?? []) as $reply) {
                $replyDate = strtotime($reply['date'] ?? '');
                $replyStmt->execute([(int)$ticket['id'], $reply['sender'] ?? 'Guest',
                    $reply['text'] ?? '', $replyDate ? date('Y-m-d H:i:s', $replyDate) : date('Y-m-d H:i:s')]);
            }
        }
        $adminLogStmt = $pdo->prepare(
            'INSERT IGNORE INTO admin_logs
             (id,admin_id,action,entity_type,entity_id,details,created_at)
             VALUES (?,?,?,?,?,?,?)'
        );
        foreach (($input['adminLogs'] ?? []) as $log) {
            $adminLogStmt->execute([
                (int)$log['id'], (int)$log['adminId'], $log['action'] ?? '',
                $log['entityType'] ?? '', $log['entityId'] ?? null,
                $log['details'] ?? '', $log['createdAt'] ?? date('Y-m-d H:i:s')
            ]);
        }
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

$action = $_GET['action'] ?? '';
try {
    if ($action === 'load') respond(loadData($pdo));
    if ($action === 'sync') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'sync requires POST'], 405);
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) respond(['error' => 'Invalid JSON payload'], 400);
        syncData($pdo, $input);
        respond(['success' => true]);
    }
    if ($action === 'query') {
        $type = $_GET['type'] ?? '';
        if ($type === 'catalog_search') {
            $stmt = $pdo->prepare('SELECT b.id, b.title, b.cat AS category, b.author, b.published
                FROM books b WHERE b.is_archived = 0 AND (b.title LIKE :term OR b.author LIKE :term)
                ORDER BY b.title LIMIT 20');
            $term = '%' . ($_GET['term'] ?? '') . '%';
            $stmt->execute(['term' => $term]);
            respond($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        if ($type === 'category_summary') {
            respond($pdo->query('SELECT cat AS category, COUNT(*) AS title_count, SUM(copies) AS copy_count
                FROM books WHERE is_archived = 0 GROUP BY cat HAVING COUNT(*) > 0 ORDER BY title_count DESC LIMIT 20')
                ->fetchAll(PDO::FETCH_ASSOC));
        }
        if ($type === 'active_loans') {
            respond($pdo->query('SELECT l.id, u.name AS borrower, b.title AS book_title, l.due
                FROM loans l INNER JOIN users u ON u.id = l.borrower_id
                INNER JOIN books b ON b.id = l.book_id ORDER BY l.due LIMIT 50')
                ->fetchAll(PDO::FETCH_ASSOC));
        }
        if ($type === 'overdue_summary') {
            respond($pdo->query("SELECT COUNT(*) AS overdue_loans, COALESCE(SUM(GREATEST(DATEDIFF(CURDATE(), l.due), 0) * 5), 0) AS estimated_fines
                FROM loans l WHERE l.due < CURDATE()")->fetch(PDO::FETCH_ASSOC));
        }
        respond(['error' => 'Unknown query type'], 400);
    }
    respond(['error' => 'Unknown action'], 404);
} catch (Throwable $e) {
    respond(['error' => $e->getMessage()], 500);
}
